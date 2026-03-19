import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv
import math
import os
import re

load_dotenv(".env.local")

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

TABLE_NAME = "housing_property_records"
FILE_PATH = "osu_offcampus_housing.json"

LABEL_TO_COLUMN = {
    "Address": "address",
    "Detail_URL": "listing_url",
    "ID": "osu_id",
    "Monthly Rent": "monthly_rent",
    "Move In Date": "move_in_date",
    "Move Out Date": "move_out_date",
    "Lease Term": "lease_term",
    "Short Lease Term": "short_lease_term",
    "Sublease Permitted": "sublease_permitted",
    "Security Deposit": "security_deposit",
    "Property Owner": "property_owner",
    "Property Type": "property_type",
    "Level": "level",
    "City": "city",
    "Bedrooms": "bedrooms",
    "Bathrooms": "bathrooms",
    "Max Occupancy": "max_occupancy",
    "Wheel Chair Access": "wheelchair_access",
    "Basement": "basement",
    "Laundry": "laundry",
    "Parking": "parking",
    "Number of Parking Spaces": "num_parking_spaces",
    "Off-street Parking": "offstreet_parking",
    "Off-street Monthly": "offstreet_monthly",
    "Off-street Yearly": "offstreet_yearly",
    "On-street Parking": "onstreet_parking",
    "On-street Permit Required": "onstreet_permit_required",
    "Garage Parking": "garage_parking",
    "Garage Monthly": "garage_monthly",
    "Garage Yearly": "garage_yearly",
    "Furnished": "furnished",
    "Fireplace": "fireplace",
    "Air Conditioning": "air_conditioning",
    "Dishwasher": "dishwasher",
    "Stove": "stove",
    "Refrigerator": "refrigerator",
    "Security System": "security_system",
    "Backyard": "backyard",
    "Deck Or Porch": "deck_or_porch",
    "Other Amenities": "other_amenities",
    "Pet Deposit": "pet_deposit",
    "Additional Pet Rent": "additional_pet_rent",
    "Additional Dog Rent": "additional_dog_rent",
    "Additional Cat Rent": "additional_cat_rent",
    "Pets Allowed": "pets_allowed",
    "Dogs Allowed": "dogs_allowed",
    "Cats Allowed": "cats_allowed",
    "Pet Deposit Refundable": "pet_deposit_refundable",
    "Water Included": "water_included",
    "Electric Included": "electric_included",
    "Gas Included": "gas_included",
}

BOOLEAN_COLUMNS = {
    "short_lease_term", "sublease_permitted", "wheelchair_access", "basement",
    "parking", "offstreet_parking", "onstreet_parking", "garage_parking",
    "furnished", "fireplace", "dishwasher", "stove", "refrigerator",
    "security_system", "backyard", "deck_or_porch", "pets_allowed",
    "dogs_allowed", "cats_allowed", "pet_deposit_refundable",
    "water_included", "electric_included", "gas_included",
}

INTEGER_COLUMNS = {
    "bedrooms", "max_occupancy", "num_parking_spaces",
}


def parse_bathrooms(value):
    full = half = 0
    if isinstance(value, str):
        m = re.search(r"(\d+)\s*full", value)
        if m: full = int(m.group(1))
        m = re.search(r"(\d+)\s*half", value)
        if m: half = int(m.group(1))
    return full, half


def clean_row(row):
    """Renames scraped keys to SQL columns and converts types."""
    cleaned = {}

    for raw_key, value in row.items():
        # Handle the Sector key which has embedded whitespace from scraping
        if "Sector" in str(raw_key):
            cleaned["sector"] = value if value else None
            continue

        col = LABEL_TO_COLUMN.get(raw_key)
        if col is None:
            continue

        if isinstance(value, float) and math.isnan(value):
            cleaned[col] = None
        elif col == "bathrooms":
            full, half = parse_bathrooms(value)
            cleaned["full_bathrooms"] = full
            cleaned["half_bathrooms"] = half
        elif col in BOOLEAN_COLUMNS:
            cleaned[col] = str(value).strip().lower() == "yes"
        elif col in INTEGER_COLUMNS:
            try:
                cleaned[col] = int(value)
            except (ValueError, TypeError):
                cleaned[col] = None
        else:
            cleaned[col] = value if value else None

    return cleaned


def main():
    supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

    if FILE_PATH.endswith(".csv"):
        df = pd.read_csv(FILE_PATH)
    elif FILE_PATH.endswith(".json"):
        df = pd.read_json(FILE_PATH)
    else:
        raise ValueError(f"Unsupported file type: {FILE_PATH}")

    print(f"Loaded {len(df)} properties from {FILE_PATH}")

    records = [clean_row(row) for _, row in df.iterrows()]

    BATCH_SIZE = 50
    for i in range(0, len(records), BATCH_SIZE):
        batch = records[i : i + BATCH_SIZE]
        response = supabase_client.table(TABLE_NAME).insert(batch).execute()
        print(f"Inserted batch {i // BATCH_SIZE + 1} ({len(batch)} rows)")

    print(f"\nDone! Uploaded {len(records)} properties to '{TABLE_NAME}'.")


if __name__ == "__main__":
    main()