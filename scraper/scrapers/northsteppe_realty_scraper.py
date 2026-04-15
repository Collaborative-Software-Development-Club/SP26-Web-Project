import argparse
import json
from pathlib import Path
from typing import Any

import requests


# Resolve shared repo locations once so this script can be run from any shell folder.
REPO_ROOT = Path(__file__).resolve().parent.parent
TEST_DOCS_DIR = REPO_ROOT / "test-docs"

# NorthSteppe also uses an AppFolio-backed JSON feed, just with a different endpoint.
BASE_URL = "https://www.northsteppe.com"
COLLECTION_URL = (
    f"{BASE_URL}/rts/collections/public/b1d481a1/runtime/"
    "collection/appfolio-listings/query-data"
)

DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/123.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json,text/plain,*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": f"{BASE_URL}/availability",
}

PAGE_SIZE = 100


def stringify(value: Any) -> str:
    """Normalize values into the string-based style used by the OSU JSON output."""
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
    """Construct the public-facing listing page URL from AppFolio feed fragments."""
    listable_uid = data.get("listable_uid")
    database_url = data.get("database_url")
    if not listable_uid or not database_url:
        return ""
    return f"{str(database_url).rstrip('/')}/listings/detail/{listable_uid}"


def fetch_listings(limit: int) -> list[dict[str, Any]]:
    """
    Read listing pages from the NorthSteppe collection endpoint until we hit `limit`.

    Just like Buckeye, the useful listing fields live inside the nested `data` object.
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
    Convert NorthSteppe records into the same general field-label format as the OSU JSON.

    We intentionally use labels like `Address`, `Detail_URL`, `Monthly Rent`, etc.
    so these files are easier to compare side-by-side with the OSU sample output.
    """
    amenities = stringify(data.get("amenities"))
    utilities = stringify(data.get("utilities"))

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
        "Property Owner": "NorthSteppe Realty",
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
    }

    extra_fields = {
        "Application Fee": stringify(data.get("application_fee")),
        "Square Feet": stringify(data.get("square_feet")),
        "Postal Code": stringify(data.get("address_postal_code")),
        "Available": stringify(data.get("available")),
        "Utilities": utilities,
        "Contact Phone": stringify(data.get("contact_phone_number")),
        "Contact Email": stringify(data.get("contact_email_address")),
    }

    cleaned_record = {key: value for key, value in record.items() if value != ""}
    cleaned_record.update({key: value for key, value in extra_fields.items() if value != ""})
    return cleaned_record


def parse_args() -> argparse.Namespace:
    """Expose a small CLI so you can change the sample size or output path quickly."""
    parser = argparse.ArgumentParser(
        description="Scrape NorthSteppe listings into an OSU-style JSON file."
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=30,
        help="Number of listings to fetch. Defaults to 30.",
    )
    parser.add_argument(
        "--output",
        default=str(TEST_DOCS_DIR / "northsteppe_osu_format.json"),
        help="Output JSON file path. Defaults to test-docs/northsteppe_osu_format.json.",
    )
    return parser.parse_args()


def main() -> None:
    """Run the scraper end-to-end and save the converted OSU-style listing records."""
    args = parse_args()
    output_path = Path(args.output)

    if not output_path.is_absolute():
        output_path = REPO_ROOT / output_path

    output_path.parent.mkdir(parents=True, exist_ok=True)

    raw_listings = fetch_listings(limit=args.limit)
    converted_listings = [convert_to_osu_record(listing) for listing in raw_listings]

    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(converted_listings, handle, indent=4)

    print(f"Saved {len(converted_listings)} NorthSteppe listings to {output_path}")


if __name__ == "__main__":
    main()