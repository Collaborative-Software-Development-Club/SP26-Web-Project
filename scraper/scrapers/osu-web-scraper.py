import argparse
import requests
from bs4 import BeautifulSoup
import pandas as pd

# Getting the URL
base_url = "https://offcampus.osu.edu"
url = base_url + "/search-housing.aspx"

page_num = 1

# This will store every property as a dictionary
all_properties = []


def to_absolute_url(base: str, src: str | None) -> str:
    if not src:
        return ""
    if src.startswith("http://") or src.startswith("https://"):
        return src
    if src.startswith("/"):
        return base + src
    return f"{base}/{src}"


def extract_main_image_url(detail_soup: BeautifulSoup) -> str:
    """Pick a representative property image from the listing detail page."""
    for image in detail_soup.select("img"):
        src = image.get("src")
        if not src:
            continue
        # Property photos live under this path on the OSU off-campus site.
        if "/posts/vendors/properties/" in src:
            return to_absolute_url(base_url, src)
    return ""


def parse_args():
    parser = argparse.ArgumentParser(
        description="Scrape OSU off-campus housing listings."
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=800,
        help="Maximum number of listings to scrape. Defaults to 800.",
    )
    parser.add_argument(
        "--output",
        default="test-docs/osu_offcampus_housing.json",
        help="Output JSON file path. Defaults to test-docs/osu_offcampus_housing.json.",
    )
    parser.add_argument(
        "--csv-output",
        default="test-docs/osu_offcampus_housing.csv",
        help="Output CSV file path. Defaults to test-docs/osu_offcampus_housing.csv.",
    )
    return parser.parse_args()


def main():
    global url, page_num, all_properties
    args = parse_args()

    while url is not None and len(all_properties) < args.limit:

        response = requests.get(url)

        if response.status_code == 200:

            soup = BeautifulSoup(response.text, "html.parser")

            address_tags = soup.select('a[id*="HypAddress"]')

            for tag in address_tags:
                if len(all_properties) >= args.limit:
                    break

                address = tag.get_text(strip=True)
                address_link = tag["href"]
                full_address_link = base_url + address_link

                # Create base property dictionary
                property_data = {
                    "Address": address,
                    "Detail_URL": full_address_link
                }

                # ----------------- Getting Detail Information ------------------- #

                detail_response = requests.get(full_address_link)

                if detail_response.status_code == 200:

                    detail_soup = BeautifulSoup(detail_response.text, "html.parser")
                    list_items = detail_soup.find_all("li")
                    main_image_url = extract_main_image_url(detail_soup)

                    for item in list_items:
                        strong_tag = item.find("strong")
                        if strong_tag is not None:

                            label = strong_tag.get_text(strip=True).replace(":", "")
                            full_text = item.get_text(strip=True)
                            value = full_text.replace(strong_tag.get_text(strip=True), "").strip()

                            property_data[label] = value

                    if main_image_url:
                        property_data["Main Image URL"] = main_image_url

                else:
                    property_data["Details_Error"] = "Unable to retrieve property details"

                # Add this property to master list
                all_properties.append(property_data)

            # Handle Pagination
            next_button = soup.find("a", title="Go to Next Page")

            if next_button is not None and len(all_properties) < args.limit:
                print(f"Page {page_num} scraped successfully.")
                page_num += 1
                url = base_url + next_button["href"]
            else:
                url = None
        else:
            print("Request failed:", response.status_code)
            break

    # ----------------- Convert to DataFrame ------------------- #
    df = pd.DataFrame(all_properties).fillna("")
    df.to_csv(args.csv_output, index=False)
    df.to_json(args.output, orient="records", indent=4)

    print(f"Scraping complete. Saved {len(df)} records to {args.output} and {args.csv_output}.")


if __name__ == "__main__":
    main()