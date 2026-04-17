import base64
import json
import math
import os
import re
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv
from postgrest.exceptions import APIError
from supabase import create_client

_SCRAPER = Path(__file__).resolve().parent
load_dotenv(_SCRAPER.parent / "web-app" / ".env.local")
load_dotenv(_SCRAPER / ".env.local", override=True)

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SECRET_SERVER_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_SECRET_KEY")
API_KEY = SECRET_SERVER_KEY or (
    os.environ.get("SUPABASE_KEY")
    or os.environ.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
    or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    or os.environ.get("SUPABASE_ANON_KEY")
)

TABLE_NAME = "housing_property_records"
FILE_PATH = "osu_offcampus_housing.json"

LABEL_TO_COLUMN = {
    "Address": "address",
    "Detail_URL": "listing_url",
    "Property_Images": "main_image_url",
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


def describe_api_key_role(key: str) -> str:
    """Single line for logs — never print the full key."""
    if key.startswith("sb_publishable_"):
        return "publishable — RLS still applies (wrong key for this script)"
    if key.startswith("sb_secret_"):
        return "sb_secret — should bypass RLS; if you still see 42501, key may be wrong or not loaded"
    if key.startswith("eyJ"):
        try:
            payload_b64 = key.split(".")[1]
            pad = (-len(payload_b64)) % 4
            if pad:
                payload_b64 += "=" * pad
            claims = json.loads(base64.urlsafe_b64decode(payload_b64.encode("ascii")))
            role = claims.get("role", "?")
            if role == "service_role":
                return "JWT role=service_role — bypasses RLS"
            return f"JWT role={role!r} — only service_role bypasses RLS for this flow"
        except Exception:
            return "JWT — could not decode; check key is full service_role secret"
    return "unknown key shape"


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
        elif col == "main_image_url":
            # Keep as a list for jsonb / array columns; store null if empty.
            if isinstance(value, list):
                cleaned[col] = value if len(value) > 0 else None
            elif value:
                cleaned[col] = [value]
            else:
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
    if not SUPABASE_URL or not API_KEY:
        raise SystemExit(
            "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY in .env.local "
            "(Project Settings → API → secret / service_role). "
            "Publishable keys are blocked by RLS on upsert."
        )

    if not SECRET_SERVER_KEY:
        print(
            "Warning: No secret server key in env; falling back to publishable/anon. "
            "Set SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY in scraper/.env.local only.\n"
        )

    print(f"Using API key: {describe_api_key_role(API_KEY)}\n")

    supabase_client = create_client(SUPABASE_URL, API_KEY)

    if FILE_PATH.endswith(".csv"):
        df = pd.read_csv(FILE_PATH)
    elif FILE_PATH.endswith(".json"):
        df = pd.read_json(FILE_PATH)
    else:
        raise ValueError(f"Unsupported file type: {FILE_PATH}")

    print(f"Loaded {len(df)} properties from {FILE_PATH}")

    # Clean rows and de-dupe by normalized address within this import run.
    # NOTE: Upserts require a UNIQUE constraint on `address`. Missing unique → PostgREST error
    # about ON CONFLICT, not code 42501. RLS violations (42501) are permissions, not uniqueness.
    seen_addresses = set()
    records = []
    for _, row in df.iterrows():
        cleaned = clean_row(row)
        addr_norm = (cleaned.get("address") or "").strip().lower()
        if not addr_norm:
            continue
        if addr_norm in seen_addresses:
            continue
        seen_addresses.add(addr_norm)
        records.append(cleaned)

    BATCH_SIZE = 50
    for i in range(0, len(records), BATCH_SIZE):
        batch = records[i : i + BATCH_SIZE]
        # Upsert by address: existing rows get updated in place and keep the same UUID `id`.
        try:
            supabase_client.table(TABLE_NAME).upsert(batch, on_conflict="address").execute()
        except APIError as e:
            msg = (e.message or str(e)).lower()
            if e.code == "42501" or "row-level security" in msg:
                print(
                    "\nRLS blocked this write.\n\n"
                    "  1) Recommended: add your server secret to scraper/.env.local (never commit it):\n"
                    "       SUPABASE_SECRET_KEY=sb_secret_...\n"
                    "     or legacy JWT:\n"
                    "       SUPABASE_SERVICE_ROLE_KEY=eyJ...\n"
                    "     Dashboard → Project Settings → API → Secret API keys.\n\n"
                    "  2) If you must use the publishable key: upsert runs INSERT + UPDATE on conflict.\n"
                    "     You need policies for both, including UPDATE USING/WITH CHECK. Messages that\n"
                    "     mention \"USING expression\" usually mean the UPDATE (or row visibility) check\n"
                    "     failed. Easiest fix is still the secret key, which bypasses RLS for this script.\n"
                )
            raise
        print(f"Upserted batch {i // BATCH_SIZE + 1} ({len(batch)} rows)")

    print(f"\nDone! Uploaded {len(records)} properties to '{TABLE_NAME}'.")


if __name__ == "__main__":
    main()
