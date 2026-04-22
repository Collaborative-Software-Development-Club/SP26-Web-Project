import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

import requests


# Resolve repo-relative paths once so the script can be run from anywhere.
REPO_ROOT = Path(__file__).resolve().parent.parent
TEST_DOCS_DIR = REPO_ROOT / "test-docs"

# Buckeye serves listing data from an AppFolio-backed JSON collection endpoint.
BASE_URL = "https://www.buckeyerealestate.com"
COLLECTION_URL = (
    f"{BASE_URL}/rts/collections/public/eb3e92f5/runtime/"
    "collection/appfolio-listings/query-data"
)

# A browser-like header set helps the endpoint treat this request the same way it
# treats a normal page load from a visitor.
DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/123.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json,text/plain,*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": f"{BASE_URL}/all-availability843918fc",
}

# We request listings in pages because the source endpoint is paginated.
PAGE_SIZE = 100


def stringify(value: Any) -> str:
    """
    Convert any source value into the string-heavy style used by the OSU scraper.

    The OSU JSON is essentially a list of dictionaries where values are strings,
    so we normalize non-string data here instead of leaving numbers/booleans mixed in.
    """
    if value is None:
        return ""
    if isinstance(value, bool):
        return "Yes" if value else "No"
    if isinstance(value, float):
        if value.is_integer():
            return str(int(value))
        return str(value)
    if isinstance(value, list):
        cleaned_items = [stringify(item) for item in value if stringify(item)]
        return ", ".join(cleaned_items)
    return str(value).strip()


def build_listing_url(data: dict[str, Any]) -> str:
    """
    Reconstruct the public detail page URL for one AppFolio listing.

    Buckeye exposes pieces of the URL in the feed instead of a direct `detail_url`,
    so we stitch it back together here.
    """
    listable_uid = data.get("listable_uid")
    database_url = data.get("database_url")
    if not listable_uid or not database_url:
        return ""
    return f"{str(database_url).rstrip('/')}/listings/detail/{listable_uid}"


def fetch_listings(limit: int) -> list[dict[str, Any]]:
    """
    Download raw listing payloads from Buckeye's collection endpoint.

    The endpoint returns wrapper objects and the actual listing fields live under
    `item["data"]`, so we return those inner dictionaries for simpler downstream code.
    """
    session = requests.Session()
    session.headers.update(DEFAULT_HEADERS)

    listings: list[dict[str, Any]] = []
    page_number = 0

    while len(listings) < limit:
        params = {
            "pageSize": str(min(PAGE_SIZE, limit - len(listings))),
            "pageNumber": str(page_number),
            "query": "()",
        }

        response = session.get(COLLECTION_URL, params=params, timeout=30)
        response.raise_for_status()

        values = response.json().get("values", [])
        if not values:
            break

        for item in values:
            listings.append(item.get("data", {}))
            if len(listings) >= limit:
                break

        page_number += 1

    return listings[:limit]


def convert_to_osu_record(data: dict[str, Any]) -> dict[str, str]:
    """
    Map Buckeye's source fields into the same broad JSON shape used by the OSU scraper.

    We keep the exact top-level style:
    - one dictionary per property
    - human-readable field labels
    - string values

    Some OSU fields do not exist on Buckeye, so we simply omit them rather than
    inventing placeholder values that might be misleading.
    """
    amenities = stringify(data.get("amenities"))
    utilities = stringify(data.get("utilities"))

    photos = data.get("photos") or []
    first_photo_url = ""
    if isinstance(photos, list) and photos:
        first = photos[0]
        if isinstance(first, dict):
            first_photo_url = stringify(first.get("url"))

    record = {
        "Address": stringify(
            data.get("full_address") or data.get("address_address1") or "Unknown Address"
        ),
        "Detail_URL": build_listing_url(data),
        "ID": stringify(data.get("id")),
        "Monthly Rent": stringify(data.get("market_rent")),
        "Move In Date": stringify(data.get("available_date")),
        "Lease Term": stringify(data.get("advertised_lease_term")),
        "Security Deposit": stringify(data.get("deposit")),
        "Property Owner": "Buckeye Real Estate",
        "Property Type": stringify(data.get("property_type")),
        "City": stringify(
            ", ".join(
                part
                for part in [
                    stringify(data.get("address_city")),
                    stringify(data.get("address_state")),
                ]
                if part
            )
        ),
        "Bedrooms": stringify(data.get("bedrooms")),
        "Bathrooms": stringify(data.get("bathrooms")),
        "Laundry": stringify(data.get("laundry_type")),
        "Parking": "Yes" if stringify(data.get("parking_type")) else "",
        "Furnished": stringify(data.get("furnished")),
        "Air Conditioning": stringify(data.get("air_conditioning_type")),
        "Dishwasher": stringify(data.get("dishwasher")),
        "Refrigerator": stringify(data.get("refrigerator")),
        "Other Amenities": amenities,
        "Pets Allowed": stringify(data.get("pets_allowed")),
        "Dogs Allowed": stringify(data.get("dogs")),
        "Cats Allowed": stringify(data.get("cats")),
        "Water Included": "Yes" if "water" in utilities.lower() else "",
        "Electric Included": "Yes" if "electric" in utilities.lower() else "",
        "Gas Included": "Yes" if "gas" in utilities.lower() else "",
        "Main Image URL": first_photo_url or stringify(data.get("default_photo_thumbnail_url")),
    }

    # Preserve a few source-specific details using the same human-readable field style.
    extra_fields = {
        "Application Fee": stringify(data.get("application_fee")),
        "Square Feet": stringify(data.get("square_feet")),
        "Postal Code": stringify(data.get("address_postal_code")),
        "Available": stringify(data.get("available")),
        "Utilities": utilities,
        "Contact Phone": stringify(data.get("contact_phone_number")),
        "Contact Email": stringify(data.get("contact_email_address")),
    }

    # Only keep fields that actually contain information. This mirrors the OSU scraper's
    # "whatever we found becomes a key" behavior more closely than filling every key.
    cleaned_record = {key: value for key, value in record.items() if value != ""}
    cleaned_record.update({key: value for key, value in extra_fields.items() if value != ""})
    return cleaned_record


def parse_args() -> argparse.Namespace:
    """Define command line arguments so the scraper is easy to rerun with new limits."""
    parser = argparse.ArgumentParser(
        description="Scrape Buckeye listings into an OSU-style JSON file."
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=30,
        help="Number of listings to fetch. Defaults to 30.",
    )
    parser.add_argument(
        "--output",
        default=str(TEST_DOCS_DIR / "buckeye_osu_format.json"),
        help="Output JSON file path. Defaults to test-docs/buckeye_osu_format.json.",
    )

    # Support shorthand invocation like: `python script.py -50`
    # by normalizing it into the standard `--limit 50` form.
    normalized_argv = []
    for arg in sys.argv[1:]:
        if re.fullmatch(r"-\d+", arg):
            normalized_argv.extend(["--limit", arg[1:]])
        else:
            normalized_argv.append(arg)

    return parser.parse_args(normalized_argv)


def main() -> None:
    """
    Fetch Buckeye data, convert it into the OSU JSON style, and save it to disk.

    The final file will be a JSON array where each element looks like the record
    produced by `osu-web-scraper-copy.py`.
    """
    args = parse_args()
    output_path = Path(args.output)

    if not output_path.is_absolute():
        output_path = REPO_ROOT / output_path

    output_path.parent.mkdir(parents=True, exist_ok=True)

    raw_listings = fetch_listings(limit=args.limit)
    converted_listings = [convert_to_osu_record(listing) for listing in raw_listings]

    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(converted_listings, handle, indent=4)

    print(f"Saved {len(converted_listings)} Buckeye listings to {output_path}")


if __name__ == "__main__":
    main()
