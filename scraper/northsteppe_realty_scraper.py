import argparse
import json
from datetime import datetime
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

OSU_FIELD_ORDER = [
    "Address",
    "Detail_URL",
    "ID",
    "Monthly Rent",
    "Move In Date",
    "Move Out Date",
    "Lease Term",
    "Short Lease Term",
    "Sublease Permitted",
    "Security Deposit",
    "Property Owner",
    "Property Type",
    "Location\r\n                                            Sector",
    "Level",
    "City",
    "Bedrooms",
    "Bathrooms",
    "Max Occupancy",
    "Wheel Chair Access",
    "Basement",
    "Laundry",
    "Parking",
    "Number of Parking Spaces",
    "Off-street Parking",
    "Off-street Monthly",
    "Off-street Yearly",
    "On-street Parking",
    "On-street Permit Required",
    "Garage Parking",
    "Garage Monthly",
    "Garage Yearly",
    "Furnished",
    "Fireplace",
    "Air Conditioning",
    "Dishwasher",
    "Stove",
    "Refrigerator",
    "Security System",
    "Backyard",
    "Deck Or Porch",
    "Other Amenities",
    "Pet Deposit",
    "Additional Pet Rent",
    "Additional Dog Rent",
    "Additional Cat Rent",
    "Pets Allowed",
    "Dogs Allowed",
    "Cats Allowed",
    "Pet Deposit Refundable",
    "Water Included",
    "Electric Included",
    "Gas Included",
    "Name",
    "Phone",
]


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


def includes_term(text: str, *terms: str) -> bool:
    lowered = text.lower()
    return any(term.lower() in lowered for term in terms)


def yes_no_from_boolish(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, bool):
        return "Yes" if value else "No"

    text = stringify(value).lower()
    if not text:
        return ""
    if text in {"yes", "true", "1", "allowed"}:
        return "Yes"
    if text in {"no", "false", "0", "not allowed"}:
        return "No"
    if "allow" in text:
        return "Yes"
    return ""


def format_currency(value: Any) -> str:
    text = stringify(value)
    if not text:
        return ""
    if text.startswith("$"):
        return text

    cleaned = text.replace(",", "").strip()
    try:
        amount = float(cleaned)
    except ValueError:
        return text
    return f"${amount:,.2f}"


def format_date(value: Any) -> str:
    text = stringify(value)
    if not text:
        return ""

    for pattern in ("%Y-%m-%d", "%m-%d-%Y", "%m/%d/%Y", "%m/%d/%y"):
        try:
            parsed = datetime.strptime(text, pattern)
            return f"{parsed.month}/{parsed.day}/{parsed.year}"
        except ValueError:
            continue

    return text.replace("-", "/")


def format_bathrooms(value: Any) -> str:
    text = stringify(value)
    if not text:
        return ""
    if "full" in text or "half" in text:
        return text

    try:
        amount = float(text)
    except ValueError:
        return text

    full_baths = int(amount)
    half_baths = 1 if round(amount - full_baths, 2) >= 0.5 else 0
    return f"{full_baths} full, {half_baths} half"


def build_city(data: dict[str, Any]) -> str:
    city = stringify(data.get("address_city"))
    state = stringify(data.get("address_state"))
    return ", ".join(part for part in [city, state] if part)


def normalize_osu_schema(mapped_fields: dict[str, str]) -> dict[str, str]:
    return {field: mapped_fields.get(field, "") for field in OSU_FIELD_ORDER}


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
    Convert NorthSteppe records into the exact OSU JSON field set and style.
    """
    amenities = stringify(data.get("amenities"))
    utilities = stringify(data.get("utilities"))
    parking_type = stringify(data.get("parking_type"))
    laundry_type = stringify(data.get("laundry_type"))
    air_conditioning_type = stringify(data.get("air_conditioning_type"))

    parking_present = bool(parking_type) or includes_term(
        amenities, "parking", "garage", "carport"
    )
    off_street_parking = bool(parking_type) or includes_term(
        amenities, "off-street parking", "off street parking"
    )

    dishwasher = yes_no_from_boolish(data.get("dishwasher"))
    if not dishwasher and includes_term(amenities, "dishwasher"):
        dishwasher = "Yes"

    refrigerator = yes_no_from_boolish(data.get("refrigerator"))
    if not refrigerator and includes_term(amenities, "refrigerator", "fridge"):
        refrigerator = "Yes"

    stove = "Yes" if includes_term(amenities, "range", "stove", "oven", "microwave") else ""

    pets_allowed = yes_no_from_boolish(data.get("pets_allowed"))
    if not pets_allowed and (stringify(data.get("dogs")) or stringify(data.get("cats"))):
        pets_allowed = "Yes"

    mapped_fields = {
        "Address": stringify(
            data.get("full_address") or data.get("address_address1") or "Unknown Address"
        ),
        "Detail_URL": build_listing_url(data),
        "ID": stringify(data.get("id")),
        "Monthly Rent": format_currency(data.get("market_rent")),
        "Move In Date": format_date(data.get("available_date")),
        "Move Out Date": "",
        "Lease Term": stringify(data.get("advertised_lease_term")),
        "Short Lease Term": "",
        "Sublease Permitted": "",
        "Security Deposit": format_currency(data.get("deposit")),
        "Property Owner": "NorthSteppe Realty",
        "Property Type": stringify(data.get("property_type")),
        "Location\r\n                                            Sector": "",
        "Level": "",
        "City": build_city(data),
        "Bedrooms": stringify(data.get("bedrooms")),
        "Bathrooms": format_bathrooms(data.get("bathrooms")),
        "Max Occupancy": stringify(data.get("max_occupancy")),
        "Wheel Chair Access": yes_no_from_boolish(data.get("wheelchair_accessible")),
        "Basement": "",
        "Laundry": laundry_type or ("Laundry facilities in the unit" if includes_term(
            amenities, "washer/dryer", "laundry"
        ) else ""),
        "Parking": "Yes" if parking_present else "",
        "Number of Parking Spaces": stringify(data.get("parking_spaces")),
        "Off-street Parking": "Yes" if off_street_parking else "",
        "Off-street Monthly": "",
        "Off-street Yearly": "",
        "On-street Parking": "Yes" if includes_term(amenities, "street parking") else "",
        "On-street Permit Required": "",
        "Garage Parking": "Yes" if includes_term(amenities, "garage") else "",
        "Garage Monthly": "",
        "Garage Yearly": "",
        "Furnished": yes_no_from_boolish(data.get("furnished")),
        "Fireplace": "Yes" if includes_term(amenities, "fireplace") else yes_no_from_boolish(data.get("fireplace")),
        "Air Conditioning": air_conditioning_type,
        "Dishwasher": dishwasher,
        "Stove": stove,
        "Refrigerator": refrigerator,
        "Security System": yes_no_from_boolish(data.get("security_system")),
        "Backyard": yes_no_from_boolish(data.get("backyard")),
        "Deck Or Porch": "Yes" if includes_term(amenities, "deck", "porch", "balcony") else "",
        "Other Amenities": amenities,
        "Pet Deposit": format_currency(data.get("pet_deposit")),
        "Additional Pet Rent": format_currency(data.get("pet_rent")),
        "Additional Dog Rent": format_currency(data.get("dog_rent")),
        "Additional Cat Rent": format_currency(data.get("cat_rent")),
        "Pets Allowed": pets_allowed,
        "Dogs Allowed": yes_no_from_boolish(data.get("dogs")),
        "Cats Allowed": yes_no_from_boolish(data.get("cats")),
        "Pet Deposit Refundable": yes_no_from_boolish(data.get("pet_deposit_refundable")),
        "Water Included": "Yes" if "water" in utilities.lower() else "",
        "Electric Included": "Yes" if "electric" in utilities.lower() else "",
        "Gas Included": "Yes" if "gas" in utilities.lower() else "",
        "Name": "",
        "Phone": stringify(data.get("contact_phone_number")),
    }

    return normalize_osu_schema(mapped_fields)


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
