CREATE TABLE housing_property_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL,
  listing_url TEXT,
  main_image_url JSONB,
  osu_id TEXT,
  monthly_rent TEXT,
  move_in_date TEXT,
  move_out_date TEXT,
  lease_term TEXT,
  short_lease_term BOOLEAN,
  sublease_permitted BOOLEAN,
  security_deposit TEXT,
  property_owner TEXT,
  property_type TEXT,
  sector TEXT,
  level TEXT,
  city TEXT,
  bedrooms INTEGER,
  full_bathrooms INTEGER,
  half_bathrooms INTEGER,
  max_occupancy INTEGER,
  wheelchair_access BOOLEAN,
  basement BOOLEAN,
  laundry TEXT,
  parking BOOLEAN,
  num_parking_spaces INTEGER,
  offstreet_parking BOOLEAN,
  offstreet_monthly TEXT,
  offstreet_yearly TEXT,
  onstreet_parking BOOLEAN,
  onstreet_permit_required TEXT,
  garage_parking BOOLEAN,
  garage_monthly TEXT,
  garage_yearly TEXT,
  furnished BOOLEAN,
  fireplace BOOLEAN,
  air_conditioning TEXT,
  dishwasher BOOLEAN,
  stove BOOLEAN,
  refrigerator BOOLEAN,
  security_system BOOLEAN,
  backyard BOOLEAN,
  deck_or_porch BOOLEAN,
  other_amenities TEXT,
  pet_deposit TEXT,
  additional_pet_rent TEXT,
  additional_dog_rent TEXT,
  additional_cat_rent TEXT,
  pets_allowed BOOLEAN,
  dogs_allowed BOOLEAN,
  cats_allowed BOOLEAN,
  pet_deposit_refundable BOOLEAN,
  water_included BOOLEAN,
  electric_included BOOLEAN,
  gas_included BOOLEAN,
  modified_date TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure scraper imports can upsert by address (stable identifier).
ALTER TABLE housing_property_records
  ADD CONSTRAINT housing_property_records_address_key UNIQUE (address);

-- Saved listings (favorites)
-- One user can save many listings; we also store a snapshot (address + url)
-- so the saved item can still be shown if the listing row is deleted.
CREATE TABLE IF NOT EXISTS user_saves_housing (
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  housing_id UUID REFERENCES housing_property_records(id) ON DELETE SET NULL,
  address TEXT NOT NULL,
  listing_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Matches app upsert: onConflict "user_id,address" (housing_id nullable after listing delete)
  CONSTRAINT user_saves_housing_pkey PRIMARY KEY (user_id, address)
);

-- If an older DB used PRIMARY KEY (user_id, housing_id), migrate to (user_id, address) to match the app
-- (backup first; drop dependent policies/FKs as needed for your project).
