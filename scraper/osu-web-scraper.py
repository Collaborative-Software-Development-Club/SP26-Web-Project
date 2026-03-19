import requests
from bs4 import BeautifulSoup
import pandas as pd

# Getting the URL 
base_url = "https://offcampus.osu.edu"
url = base_url + "/search-housing.aspx"

page_num = 1

# This will store every property as a dictionary
all_properties = []

while url is not None: 

    response = requests.get(url)

    if response.status_code == 200:

        soup = BeautifulSoup(response.text, "html.parser")

        address_tags = soup.select('a[id*="HypAddress"]')

        for tag in address_tags:

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
                
                # Extract all images from the carousel
                all_image_urls = []
                image_slides = detail_soup.find_all("div", class_="c-propertyimages__slide")
                
                for slide in image_slides:
                    img_tag = slide.find("img")
                    if img_tag and img_tag.get("src"):
                        image_url = img_tag["src"]
                        
                        # Make the image URL absolute if it's relative
                        if image_url and not image_url.startswith("http"):
                            if image_url.startswith("/"):
                                image_url = base_url + image_url
                            else:
                                image_url = base_url + "/" + image_url
                        
                        all_image_urls.append(image_url)
                
                # Store all images as a list
                property_data["Property_Images"] = all_image_urls

                list_items = detail_soup.find_all("li")

                for item in list_items:
                    strong_tag = item.find("strong")
                    if strong_tag is not None:

                        label = strong_tag.get_text(strip=True).replace(":", "")
                        full_text = item.get_text(strip=True)
                        value = full_text.replace(strong_tag.get_text(strip=True), "").strip()

                        property_data[label] = value

            else:
                property_data["Details_Error"] = "Unable to retrieve property details"

            # Add this property to master list
            all_properties.append(property_data)

        # Handle Pagination
        next_button = soup.find("a", title="Go to Next Page")

        if next_button is not None:
            print(f"Page {page_num} scraped successfully.")
            page_num += 1
            url = base_url + next_button["href"]
        else:
            url = None

    else:
        print("Request failed:", response.status_code)
        break

# ----------------- Convert to DataFrame ------------------- #

df = pd.DataFrame(all_properties)

# Optional: Fill missing values with empty string
df = df.fillna("")

# Save to CSV (optional)
df.to_csv("osu_offcampus_housing.csv", index=False)

# Save to JSON
df.to_json("osu_offcampus_housing.json", orient="records", indent=4)

print("Scraping complete. Data saved to CSV and JSON.")