"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
/* Import for icons for amenities */
import {
  Armchair,
  CarFront,
  ChefHat,
  DoorOpen,
  Flame,
  Refrigerator,
  Shield,
  Snowflake,
  Trees,
  WashingMachine,
  Droplets,
  Zap,
} from "lucide-react";

type Listing = {
  id: string;
  address: string;
  listing_url: string;
  monthly_rent: string;
  move_in_date: string;
  move_out_date: string;
  lease_term: string;
  short_lease_term: boolean;
  sublease_permitted: boolean;
  security_deposit: string;
  property_owner: string;
  property_type: string;
  sector: string;
  level: string;
  city: string;
  bedrooms: number;
  full_bathrooms: number;
  half_bathrooms: number;
  max_occupancy: number;
  wheelchair_access: boolean;
  basement: boolean;
  laundry: string;
  parking: boolean;
  num_parking_spaces: number;
  offstreet_parking: boolean;
  onstreet_parking: boolean;
  onstreet_permit_required: string;
  garage_parking: boolean;
  furnished: boolean;
  fireplace: boolean;
  air_conditioning: string;
  dishwasher: boolean;
  stove: boolean;
  refrigerator: boolean;
  security_system: boolean;
  backyard: boolean;
  deck_or_porch: boolean;
  other_amenities: string;
  pet_deposit: string;
  additional_pet_rent: string;
  additional_dog_rent: string;
  additional_cat_rent: string;
  pets_allowed: boolean;
  dogs_allowed: boolean;
  cats_allowed: boolean;
  pet_deposit_refundable: boolean;
  water_included: boolean;
  electric_included: boolean;
  gas_included: boolean;
};

export function HousingDetail({ listing }: { listing: Listing }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const images: string[] = [];
  const hasAmenityValue = (value?: string | null) => {
    if (!value) return false;
    const normalized = value.trim().toLowerCase();
    return normalized !== "" && normalized !== "no" && normalized !== "none" && normalized !== "n/a";
  };
  const additionalAmenitiesLink = hasAmenityValue(listing.other_amenities)
    ? listing.other_amenities.trim()
    : null;

  const amenityItems = [
    { label: listing.furnished ? "Furnished" : "Not furnished", Icon: Armchair },
    { label: listing.fireplace ? "Fireplace" : "No fireplace", Icon: Flame },
    {
      label: hasAmenityValue(listing.air_conditioning)
        ? listing.air_conditioning
        : "No air conditioning",
      Icon: Snowflake,
    },
    { label: listing.dishwasher ? "Dishwasher" : "No dishwasher", Icon: ChefHat },
    { label: listing.stove ? "Stove" : "No stove", Icon: ChefHat },
    { label: listing.refrigerator ? "Refrigerator" : "No refrigerator", Icon: Refrigerator },
    { label: listing.security_system ? "Security system" : "No security system", Icon: Shield },
    { label: listing.backyard ? "Backyard" : "No backyard", Icon: Trees },
    { label: listing.deck_or_porch ? "Deck/Porch" : "No deck or porch", Icon: DoorOpen },
    {
      label: hasAmenityValue(listing.laundry) ? listing.laundry : "No laundry listed",
      Icon: WashingMachine,
    },
    { label: listing.parking ? "Parking available" : "No parking", Icon: CarFront },
    { label: listing.offstreet_parking ? "Off-street parking" : "No off-street parking", Icon: CarFront },
    { label: listing.onstreet_parking ? "On-street parking" : "No on-street parking", Icon: CarFront },
    { label: listing.garage_parking ? "Garage parking" : "No garage parking", Icon: CarFront },
    {
      label: listing.num_parking_spaces > 0
        ? `Parking for ${listing.num_parking_spaces} vehicle${listing.num_parking_spaces === 1 ? "" : "s"}`
        : "No parking spaces listed",
      Icon: CarFront,
    },
    {
      label: hasAmenityValue(listing.onstreet_permit_required)
        ? "Permit required for street parking"
        : "No street permit required",
      Icon: CarFront,
    },
  ];
  const utilityItems = [
    { label: listing.water_included ? "Water included" : "No water included", Icon: Droplets },
    { label: listing.electric_included ? "Electric included" : "No electric included", Icon: Zap },
    { label: listing.gas_included ? "Gas included" : "No gas included", Icon: Flame },
  ];

  return (
    <div className="flex h-full bg-background font-sans">
      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8 max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold text-foreground">
          {listing.address}
        </h1>

        {/* Photo gallery */}
        {images.length > 0 ? (
          <div className="w-full aspect-[16/9] overflow-hidden rounded-2xl border border-border shadow-sm">
            <img
              src={images[selectedImage]}
              alt="Property"
              className="h-full w-full object-cover"
            />
            <div className="mt-2 grid grid-cols-4 gap-1">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`View ${i + 1}`}
                  onClick={() => setSelectedImage(i)}
                  className={`h-14 w-full cursor-pointer rounded object-cover border-2 ${
                    selectedImage === i ? "border-primary" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-6 flex w-full aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
            <span className="text-sm text-muted-foreground">No image available</span>
          </div>
        )}

        {/* Lease Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Lease Info</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border text-sm">
              <li className="py-3"><span className="font-semibold">Monthly Rent:</span> {listing.monthly_rent}</li>
              <li className="py-3"><span className="font-semibold">Move In Date:</span> {listing.move_in_date}</li>
              <li className="py-3"><span className="font-semibold">Move Out Date:</span> {listing.move_out_date}</li>
              <li className="py-3"><span className="font-semibold">Lease Term:</span> {listing.lease_term}</li>
              <li className="py-3"><span className="font-semibold">Short Lease Term:</span> {listing.short_lease_term ? "Yes" : "No"}</li>
              <li className="py-3"><span className="font-semibold">Sublease Permitted:</span> {listing.sublease_permitted ? "Yes" : "No"}</li>
              <li className="py-3"><span className="font-semibold">Security Deposit:</span> {listing.security_deposit}</li>
              <li className="py-3"><span className="font-semibold">Property Owner:</span> {listing.property_owner}</li>
            </ul>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Property Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border text-sm">
              <li className="py-3"><span className="font-semibold">Property Type:</span> {listing.property_type}</li>
              <li className="py-3"><span className="font-semibold">Sector:</span> {listing.sector}</li>
              <li className="py-3"><span className="font-semibold">Level:</span> {listing.level}</li>
              <li className="py-3"><span className="font-semibold">City:</span> {listing.city}</li>
              <li className="py-3"><span className="font-semibold">Bedrooms:</span> {listing.bedrooms}</li>
              <li className="py-3"><span className="font-semibold">Full Bathrooms:</span> {listing.full_bathrooms}</li>
              <li className="py-3"><span className="font-semibold">Half Bathrooms:</span> {listing.half_bathrooms}</li>
              <li className="py-3"><span className="font-semibold">Max Occupancy:</span> {listing.max_occupancy}</li>
              <li className="py-3"><span className="font-semibold">Wheelchair Access:</span> {listing.wheelchair_access ? "Yes" : "No"}</li>
              <li className="py-3"><span className="font-semibold">Basement:</span> {listing.basement ? "Yes" : "No"}</li>
              <li className="py-3"><span className="font-semibold">Laundry:</span> {listing.laundry}</li>
            </ul>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {amenityItems.map(({ label, Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground"
                >
                  <Icon className="h-5 w-5 shrink-0 text-foreground" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            {additionalAmenitiesLink && (
              <div className="mt-6">
                <a
                  href={additionalAmenitiesLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  More Pictures and Showings
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pet Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Pet Info</CardTitle>
          </CardHeader>
          <CardContent>
            {listing.pets_allowed ? (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-border">
                  <div className="grid grid-cols-3">
                    <div className="border-r border-border p-4">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        General
                      </p>
                      <p className="text-base font-medium text-foreground">
                        Pets allowed
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Pet rent: {listing.additional_pet_rent}
                      </p>
                    </div>

                    <div className="border-r border-border p-4">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Dogs
                      </p>
                      <p className="text-base font-medium text-foreground">
                        {listing.dogs_allowed ? "Allowed" : "Not allowed"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Dog rent: {listing.additional_dog_rent}
                      </p>
                    </div>

                    <div className="p-4">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Cats
                      </p>
                      <p className="text-base font-medium text-foreground">
                        {listing.cats_allowed ? "Allowed" : "Not allowed"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Cat rent: {listing.additional_cat_rent}
                      </p>
                    </div>
                  </div>
                </div>

                <ul className="divide-y divide-border text-sm text-foreground">
                  <li className="py-3"><span className="font-semibold">Pet Deposit:</span> {listing.pet_deposit}</li>
                  <li className="py-3"><span className="font-semibold">Pet Deposit Refundable:</span> {listing.pet_deposit_refundable ? "Yes" : "No"}</li>
                </ul>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center justify-center rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-foreground sm:col-span-3">
                  No pets allowed
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Utilities */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Utilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {utilityItems.map(({ label, Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground"
                >
                  <Icon className="h-5 w-5 shrink-0 text-foreground" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* More Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>More Info</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              <li><span className="font-semibold">ID:</span> {listing.id}</li>
            </ul>
          </CardContent>
        </Card>
      </main>

      {/* Right column - Contact */}
      <aside className="flex w-150 shrink-0 items-center border-l border-border p-4">
        <Card className="w-full rounded-2xl shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-center text-2xl">Interested in Renting This Property?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Base Info</p>
              <p className="text-2xl font-semibold text-foreground">
                {listing.monthly_rent}{" "}
                <span className="text-sm font-normal text-muted-foreground">per month</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {listing.bedrooms} {listing.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="grid grid-cols-2">
                <div className="border-r border-border p-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Move In
                  </p>
                  <p className="text-base font-medium text-foreground">
                    {listing.move_in_date}
                  </p>
                </div>

                <div className="p-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Move Out
                  </p>
                  <p className="text-base font-medium text-foreground">
                    {listing.move_out_date}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
              Owned by {listing.property_owner}
            </div>

            <a
              href={listing.listing_url}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center rounded-full bg-red-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-red-700"
            >
              View Original Listing
            </a>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
