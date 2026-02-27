import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv
import math
import os

load_dotenv(".env.local")

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

TABLE_NAME = "housing_property_records"
FILE_PATH = "osu_offcampus_housing.json"

BOOLEAN_COLUMNS = {
    "short_lease_term", "sublease_permitted", "wheelchair_access", "basement",
    "parking", "offstreet_parking", "onstreet_parking", "garage_parking",
    "furnished", "fireplace", "dishwasher", "stove", "refrigerator",
    "security_system", "backyard", "deck_or_porch", "pets_allowed",
    "dogs_allowed", "cats_allowed", "pet_deposit_refundable",
    "water_included", "electric_included", "gas_included",
}

INTEGER_COLUMNS = {
    "bedrooms", "full_bathrooms", "half_bathrooms",
    "max_occupancy", "num_parking_spaces",
}


def clean_row(row):
    """Ensures proper types and replaces NaN with None for JSON serialization."""
    cleaned = {}
    for key, value in row.items():
        if key == "id":
            continue
        if isinstance(value, float) and math.isnan(value):
            cleaned[key] = None
        elif key in BOOLEAN_COLUMNS:
            cleaned[key] = bool(value) if not (isinstance(value, float) and math.isnan(value)) else None
        elif key in INTEGER_COLUMNS:
            cleaned[key] = int(value) if value is not None and not (isinstance(value, float) and math.isnan(value)) else None
        else:
            cleaned[key] = value
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
