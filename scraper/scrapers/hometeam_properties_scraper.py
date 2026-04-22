import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

import requests
from bs4 import BeautifulSoup


# These repo-relative paths keep file output predictable even if the script is
# launched from a different working directory.
REPO_ROOT = Path(__file__).resolve().parent.parent
TEST_DOCS_DIR = REPO_ROOT / "test-docs"

# Hometeam is not AppFolio-backed like the other two sources, so this scraper
# first reads listing cards from the main listings page and then follows each
# detail page for richer property data.
BASE_URL = "https://www.hometeamproperties.net"
LISTINGS_URL = f"{BASE_URL}/osu-off-campus-housing?available=true"

DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/123.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


def clean_text(value: str | None) -> str:
    """Collapse whitespace so scraped text is easier to store and compare."""
    if value is None:
        return ""
    text = re.sub(r"\s+", " ", value).strip()
    return text


def parse_money(value: str | None) -> str:
    """
    Extract the numeric part of a price-like string.

    Example:
    - "$850 / bed" -> "850"
    """
    if not value:
        return ""
    match = re.search(r"(\d+(?:\.\d+)?)", value.replace(",", ""))
    return match.group(1) if match else ""


def parse_ld_json(soup: BeautifulSoup) -> dict[str, Any]:
    """
    Read the JSON-LD block embedded in the detail page.

    Hometeam conveniently publishes structured metadata in `application/ld+json`,
    which is easier to parse reliably than scraping every visible text block.
    """
    script = soup.select_one('script[type="application/ld+json"]')
    if not script:
        return {}

    try:
        return json.loads(script.get_text(strip=True))
    except json.JSONDecodeError:
        return {}


def parse_additional_properties(ld_data: dict[str, Any]) -> dict[str, str]:
    """
    Flatten JSON-LD `additionalProperty` entries into a normal dictionary.

    This turns records like `{name: "Square Feet", value: "900"}` into
    `{"Square Feet": "900"}` for easier lookup.
    """
    result: dict[str, str] = {}
    for item in ld_data.get("additionalProperty", []):
        name = clean_text(item.get("name"))
        value = clean_text(item.get("value"))
        if name:
            result[name] = value
    return result


def extract_main_image_url(ld_data: dict[str, Any]) -> str:
    """Extract a representative image URL from JSON-LD image data."""
    image_data = ld_data.get("image")
    if isinstance(image_data, str):
        return clean_text(image_data)
    if isinstance(image_data, list) and image_data:
        first_image = image_data[0]
        if isinstance(first_image, str):
            return clean_text(first_image)
        if isinstance(first_image, dict):
            return clean_text(first_image.get("url") or first_image.get("@id"))
    if isinstance(image_data, dict):
        return clean_text(image_data.get("url") or image_data.get("@id"))
    return ""


def extract_feature_blocks(soup: BeautifulSoup) -> list[str]:
    """
    Pull out amenity/feature cards from the page layout.

    These do not have direct OSU equivalents, so later we join them into a single
    `Other Amenities` field.
    """
    blocks: list[str] = []
    for block in soup.select(".flex-block-featured-amenity"):
        title_el = block.select_one(".large-text")
        desc_el = block.select_one(".text-muted")

        title = clean_text(title_el.get_text(" ", strip=True) if title_el else None)
        description = clean_text(desc_el.get_text(" ", strip=True) if desc_el else None)

        if title and description:
            blocks.append(f"{title}: {description}")
        elif title:
            blocks.append(title)

    return blocks


def parse_listing_cards(session: requests.Session) -> list[dict[str, str]]:
    """
    Collect the summary cards from the main Hometeam listings page.

    Each card gives us the address, the detail page URL, and a few summary values.
    We then enrich each record by visiting its detail page.
    """
    response = session.get(LISTINGS_URL, timeout=30)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    cards: list[dict[str, str]] = []

    for item in soup.select(".collection-item-unit-listing-v3.w-dyn-item"):
        link = item.select_one("a.link-block-unit-listing-v3")
        if not link or not link.get("href"):
            continue

        detail_url = f"{BASE_URL}{link['href']}"

        cards.append(
            {
                "Address": clean_text(
                    item.select_one(".fs_name").get_text(" ", strip=True)
                    if item.select_one(".fs_name")
                    else None
                ),
                "Detail_URL": detail_url,
                "Monthly Rent": parse_money(
                    item.select_one(".fs_rent-fall").get_text(" ", strip=True)
                    if item.select_one(".fs_rent-fall")
                    else None
                ),
                "Bedrooms": clean_text(
                    item.select_one(".bedroom-count").get_text(" ", strip=True)
                    if item.select_one(".bedroom-count")
                    else None
                ),
                "Bathrooms": clean_text(
                    item.select_one(".bathroom-count").get_text(" ", strip=True)
                    if item.select_one(".bathroom-count")
                    else None
                ),
                "Property Type": clean_text(
                    item.select_one(".type-title").get_text(" ", strip=True)
                    if item.select_one(".type-title")
                    else None
                ),
                "Fall Rate Per Bed": parse_money(
                    item.select_one(".fs_rent-fall-btb").get_text(" ", strip=True)
                    if item.select_one(".fs_rent-fall-btb")
                    else None
                ),
            }
        )

    return cards


def enrich_listing(session: requests.Session, listing: dict[str, str]) -> dict[str, str]:
    """
    Visit a Hometeam detail page and merge the extra information into the record.

    This is where we align Hometeam-specific fields into OSU-style labels where possible.
    """
    response = session.get(listing["Detail_URL"], timeout=30)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    ld_data = parse_ld_json(soup)
    additional = parse_additional_properties(ld_data)
    main_image_url = extract_main_image_url(ld_data)
    feature_blocks = extract_feature_blocks(soup)

    offers = ld_data.get("offers", {}) or {}
    price_specs = offers.get("priceSpecification", []) or []

    fall_rate = ""
    immediate_rate = ""

    # Hometeam names these rates explicitly in the structured data, so we can
    # split them into clearer fields before mapping them into the output record.
    for spec in price_specs:
        name = clean_text(spec.get("name"))
        value = parse_money(spec.get("price"))
        if name == "Fall 2026 Rate":
            fall_rate = value
        elif name == "Immediate Move-in Rate":
            immediate_rate = value

    meta_desc = soup.find("meta", attrs={"name": "description"})

    enriched = dict(listing)
    enriched.update(
        {
            "Address": additional.get("Address") or listing.get("Address", ""),
            "Property Owner": "Hometeam Properties",
            "Property Type": additional.get("Building Type") or listing.get("Property Type", ""),
            "Square Feet": additional.get("Square Feet", ""),
            "City": "Columbus, OH" if additional.get("Address") else "",
            "Move In Date": "Immediate" if immediate_rate else "",
            "Other Amenities": ", ".join(feature_blocks),
            "Description": clean_text(meta_desc.get("content") if meta_desc else None),
            "Latitude": additional.get("Latitude", ""),
            "Longitude": additional.get("Longitude", ""),
            "Immediate Rate": immediate_rate,
            "Main Image URL": main_image_url,
        }
    )

    # If the card-level rate was blank but the detail page had a better value,
    # prefer the detail page value.
    if fall_rate:
        enriched["Monthly Rent"] = fall_rate

    return {key: value for key, value in enriched.items() if value != ""}


def parse_args() -> argparse.Namespace:
    """Provide a small CLI interface that matches the other scraper scripts."""
    parser = argparse.ArgumentParser(
        description="Scrape Hometeam listings into an OSU-style JSON file."
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=20,
        help="Maximum number of listings to scrape. Defaults to 20.",
    )
    parser.add_argument(
        "--output",
        default=str(TEST_DOCS_DIR / "hometeam_osu_format.json"),
        help="Output JSON file path. Defaults to test-docs/hometeam_osu_format.json.",
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
    Scrape Hometeam's listings and save them as a JSON array of OSU-style records.

    The final output mirrors the OSU scraper's broad structure:
    [
        {"Address": "...", "Detail_URL": "...", ...},
        ...
    ]
    """
    args = parse_args()
    output_path = Path(args.output)

    if not output_path.is_absolute():
        output_path = REPO_ROOT / output_path

    output_path.parent.mkdir(parents=True, exist_ok=True)

    session = requests.Session()
    session.headers.update(DEFAULT_HEADERS)

    listing_cards = parse_listing_cards(session)[: args.limit]
    converted_listings = [enrich_listing(session, listing) for listing in listing_cards]

    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(converted_listings, handle, indent=4)

    print(f"Saved {len(converted_listings)} Hometeam listings to {output_path}")


if __name__ == "__main__":
    main()
