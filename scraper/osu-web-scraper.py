import requests
from bs4 import BeautifulSoup
import pandas as pd
import re

# Mapping from scraped labels to SQL column names
LABEL_TO_COLUMN = {
    "ID": "osu_id", "Monthly Rent": "monthly_rent", "Move In Date": "move_in_date",
    "Move Out Date": "move_out_date", "Lease Term": "lease_term",
    "Short Lease Term": "short_lease_term", "Sublease Permitted": "sublease_permitted",
    "Security Deposit": "security_deposit", "Property Owner": "property_owner",
    "Property Type": "property_type", "Sector": "sector", "Level": "level",
    "City": "city", "Bedrooms": "bedrooms", "Bathrooms": "bathrooms",
    "Max Occupancy": "max_occupancy", "Wheel Chair Access": "wheelchair_access",
    "Basement": "basement", "Laundry": "laundry", "Parking": "parking",
    "Number of Parking Spaces": "num_parking_spaces",
    "Off-street Parking": "offstreet_parking", "Off-street Monthly": "offstreet_monthly",
    "Off-street Yearly": "offstreet_yearly", "On-street Parking": "onstreet_parking",
    "On-street Permit Required": "onstreet_permit_required",
    "Garage Parking": "garage_parking", "Garage Monthly": "garage_monthly",
    "Garage Yearly": "garage_yearly", "Furnished": "furnished", "Fireplace": "fireplace",
    "Air Conditioning": "air_conditioning", "Dishwasher": "dishwasher", "Stove": "stove",
    "Refrigerator": "refrigerator", "Security System": "security_system",
    "Backyard": "backyard", "Deck Or Porch": "deck_or_porch",
    "Other Amenities": "other_amenities", "Pet Deposit": "pet_deposit",
    "Additional Pet Rent": "additional_pet_rent", "Additional Dog Rent": "additional_dog_rent",
    "Additional Cat Rent": "additional_cat_rent", "Pets Allowed": "pets_allowed",
    "Dogs Allowed": "dogs_allowed", "Cats Allowed": "cats_allowed",
    "Pet Deposit Refundable": "pet_deposit_refundable", "Water Included": "water_included",
    "Electric Included": "electric_included", "Gas Included": "gas_included",
}

BOOLEAN_COLUMNS = {
    "short_lease_term", "sublease_permitted", "wheelchair_access", "basement",
    "parking", "offstreet_parking", "onstreet_parking", "garage_parking",
    "furnished", "fireplace", "dishwasher", "stove", "refrigerator",
    "security_system", "backyard", "deck_or_porch", "pets_allowed",
    "dogs_allowed", "cats_allowed", "pet_deposit_refundable",
    "water_included", "electric_included", "gas_included",
}

INTEGER_COLUMNS = {"bedrooms", "max_occupancy", "num_parking_spaces"}


def parse_bathrooms(value):
    full = half = 0
    m = re.search(r"(\d+)\s*full", value)
    if m: full = int(m.group(1))
    m = re.search(r"(\d+)\s*half", value)
    if m: half = int(m.group(1))
    return full, half


def parse_value(col_name, raw_value):
    if col_name in BOOLEAN_COLUMNS:
        return raw_value.strip().lower() == "yes"
    if col_name in INTEGER_COLUMNS:
        try: return int(raw_value.strip())
        except (ValueError, AttributeError): return None
    return raw_value if raw_value else None


def map_property(raw_data, address, listing_url):
    row = {"address": address, "listing_url": listing_url}
    for label, col in LABEL_TO_COLUMN.items():
        val = raw_data.get(label, "")
        if col == "bathrooms":
            row["full_bathrooms"], row["half_bathrooms"] = parse_bathrooms(val)
        else:
            row[col] = parse_value(col, val)
    return row


# Getting the URL 
base_url = "https://offcampus.osu.edu"
url = base_url + "/search-housing.aspx"

# DEBUG: Declares our page counter for debugging sake
page_num = 1
all_properties = []

# Opens the file that we are putting the scraped data into
with open("test-docs/addresses.txt", "w", encoding="utf-8") as f:

    # We keep looping while the url isn't null (untill next button doesnt work)
    while url != None:

        # Then we make a request to get information from this specific page:
        response = requests.get(url)

        # Then we check to make sure that our requests succeeded
        if response.status_code == 200 :

            # Getting the soup variable for the main page
            soup = BeautifulSoup(response.text, "html.parser")

            # Selects all of the <a> tags and looks for "HypAddress" which contains the address listings
            address_tags = soup.select('a[id*="HypAddress"]')

            # Now we loop through all of these tags
            for tag in address_tags:

                # Getting the address from the text of the tag
                address = tag.get_text(strip=True)

                # Getting the link associated with the address
                address_link = tag["href"]
                full_address_link = base_url + address_link

                # Then we write the address and the link associated with the address
                f.write(address + "\n")
                f.write(full_address_link + "\n")
                f.write("-----------------------------------------------------------------------------\n")

                ### ----------------- Getting Detail Information ------------------- ###

                # Requesting the information from the detail url
                detail_response = requests.get(full_address_link)

                # Then we check to see if the url request succeeded
                if detail_response.status_code == 200:

                    # Getting the soup from the detail response
                    detail_soup = BeautifulSoup(detail_response.text, "html.parser")
                    
                    # Creating a dictionary to hold each property
                    property_data = {}

                    # Then we get all of the items in a list on this page
                    list_items = detail_soup.find_all("li")

                    # Now we loop through each of the items and look for strong_tags
                    for item in list_items:
                        strong_tag = item.find("strong")
                        if strong_tag != None:

                            # We take the lable and print it out into the txt
                            label = strong_tag.get_text(strip=True).replace(":", "")
                            full_text = item.get_text(strip=True)
                            value = full_text.replace(strong_tag.get_text(strip=True), "").strip()

                            property_data[label] = value
                            f.write(f"{label}: {value}\n")

                    # Map scraped data to SQL columns and write to CSV immediately
                    row = map_property(property_data, address, full_address_link)
                    row_df = pd.DataFrame([row])
                    row_df.to_csv("scraped_properties.csv", mode="a", header=not all_properties, index=False)
                    all_properties.append(row)
                else:

                    # Prints off an error message if unable to get any details
                    f.write("Unable to find any details for this property.")
                f.write("-----------------------------------------------------------------------------\n")

            # Now we look for a next button using the title attribute
            next_button = soup.find("a", title = "Go to Next Page")

            # Then we make sure that the next button works and if not assigns the url to null to break the loop
            if next_button != None:

                # DEBUG: Prints off as a page has successfully been printed
                print("Page " + str(page_num) + " has been successfully printed.")
                page_num += 1

                # Changes our url to the next page
                url = base_url + next_button["href"]
            else:
                url = None
        else:
            # If we do not get a code 200 then something has failed and we report an error message.
            print("Request failed:", response.status_code)
            break

print(f"\nDone! Scraped {len(all_properties)} properties to scraped_properties.csv")