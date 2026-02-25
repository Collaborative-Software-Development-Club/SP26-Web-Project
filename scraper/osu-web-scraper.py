import requests
from bs4 import BeautifulSoup

# Getting the URL 
base_url = "https://offcampus.osu.edu"
url = base_url + "/search-housing.aspx"

# DEBUG: Declares our page counter for debugging sake
page_num = 1

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