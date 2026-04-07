"use client";

/* eslint-disable @next/next/no-img-element -- listing images use arbitrary external URLs */

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import {
  assertCanFavoriteHousing,
  getSavedHousing,
  saveHousingListing,
  unsaveHousingListing,
} from "../_actions";
import { parseMainImageUrls } from "../main-image-urls";

type Listing = {
  id: string;
  address: string;
  main_image_url?: unknown;
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

export function HousingDetail({
  listing,
  userId,
}: {
  listing: Listing;
  userId: string | null;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const images = parseMainImageUrls(listing.main_image_url);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    startTransition(async () => {
      try {
        const saved = await getSavedHousing(userId);
        if (cancelled) return;
        const savedSet = new Set(
          (saved ?? [])
            .filter((r) => r.housing_id != null)
            .map((r) => String(r.housing_id)),
        );
        setIsFavorite(savedSet.has(String(listing.id)));
      } catch {
        if (!cancelled) setIsFavorite(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [userId, listing.id, startTransition]);

  async function toggleFavorite() {
    if (!userId) {
      router.push("/login");
      return;
    }

    await assertCanFavoriteHousing();
    const wasFavorite = isFavorite;
    setIsFavorite((v) => !v);

    try {
      if (wasFavorite) await unsaveHousingListing(String(listing.id));
      else await saveHousingListing(String(listing.id));
    } catch (e) {
      setIsFavorite(wasFavorite);
      console.error(
        "Failed to persist housing favorite toggle",
        e instanceof Error ? e.message : e,
      );
    }
  }

  const effectiveIsFavorite = userId ? isFavorite : false;

  return (
    <div className="flex min-h-screen bg-background font-sans">

      {/* Main content */}
      <main className="flex-1 p-8 max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground">{listing.address}</h1>
          <button
            type="button"
            aria-label={effectiveIsFavorite ? "Unfavorite listing" : "Favorite listing"}
            onClick={toggleFavorite}
            disabled={isPending}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-background text-foreground shadow-sm ring-1 ring-border transition hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            <Star
              className={
                effectiveIsFavorite
                  ? "h-5 w-5 fill-yellow-400 text-yellow-400"
                  : "h-5 w-5"
              }
            />
          </button>
        </div>

        {/* Listing Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Listing Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              <li><span className="font-semibold">ID:</span> {listing.id}</li>
              <li><span className="font-semibold">Monthly Rent:</span> {listing.monthly_rent}</li>
              <li><span className="font-semibold">Move In Date:</span> {listing.move_in_date}</li>
              <li><span className="font-semibold">Move Out Date:</span> {listing.move_out_date}</li>
              <li><span className="font-semibold">Lease Term:</span> {listing.lease_term}</li>
              <li><span className="font-semibold">Short Lease Term:</span> {listing.short_lease_term ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Sublease Permitted:</span> {listing.sublease_permitted ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Security Deposit:</span> {listing.security_deposit}</li>
              <li><span className="font-semibold">Property Owner:</span> {listing.property_owner}</li>
            </ul>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              <li><span className="font-semibold">Property Type:</span> {listing.property_type}</li>
              <li><span className="font-semibold">Sector:</span> {listing.sector}</li>
              <li><span className="font-semibold">Level:</span> {listing.level}</li>
              <li><span className="font-semibold">City:</span> {listing.city}</li>
              <li><span className="font-semibold">Bedrooms:</span> {listing.bedrooms}</li>
              <li><span className="font-semibold">Full Bathrooms:</span> {listing.full_bathrooms}</li>
              <li><span className="font-semibold">Half Bathrooms:</span> {listing.half_bathrooms}</li>
              <li><span className="font-semibold">Max Occupancy:</span> {listing.max_occupancy}</li>
              <li><span className="font-semibold">Wheelchair Access:</span> {listing.wheelchair_access ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Basement:</span> {listing.basement ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Laundry:</span> {listing.laundry}</li>
            </ul>
          </CardContent>
        </Card>

        {/* Parking */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Parking Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              <li><span className="font-semibold">Parking:</span> {listing.parking ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Number of Spaces:</span> {listing.num_parking_spaces}</li>
              <li><span className="font-semibold">Off-Street Parking:</span> {listing.offstreet_parking ? "Yes" : "No"}</li>
              <li><span className="font-semibold">On-Street Parking:</span> {listing.onstreet_parking ? "Yes" : "No"}</li>
              <li><span className="font-semibold">On-Street Permit Required:</span> {listing.onstreet_permit_required}</li>
              <li><span className="font-semibold">Garage Parking:</span> {listing.garage_parking ? "Yes" : "No"}</li>
            </ul>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              <li><span className="font-semibold">Furnished:</span> {listing.furnished ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Fireplace:</span> {listing.fireplace ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Air Conditioning:</span> {listing.air_conditioning}</li>
              <li><span className="font-semibold">Dishwasher:</span> {listing.dishwasher ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Stove:</span> {listing.stove ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Refrigerator:</span> {listing.refrigerator ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Security System:</span> {listing.security_system ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Backyard:</span> {listing.backyard ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Deck or Porch:</span> {listing.deck_or_porch ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Other Amenities:</span> {listing.other_amenities}</li>
            </ul>
          </CardContent>
        </Card>

        {/* Pet Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pet Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              <li><span className="font-semibold">Pets Allowed:</span> {listing.pets_allowed ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Dogs Allowed:</span> {listing.dogs_allowed ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Cats Allowed:</span> {listing.cats_allowed ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Pet Deposit:</span> {listing.pet_deposit}</li>
              <li><span className="font-semibold">Additional Pet Rent:</span> {listing.additional_pet_rent}</li>
              <li><span className="font-semibold">Additional Dog Rent:</span> {listing.additional_dog_rent}</li>
              <li><span className="font-semibold">Additional Cat Rent:</span> {listing.additional_cat_rent}</li>
              <li><span className="font-semibold">Pet Deposit Refundable:</span> {listing.pet_deposit_refundable ? "Yes" : "No"}</li>
            </ul>
          </CardContent>
        </Card>

        {/* Utilities */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Utilities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              <li><span className="font-semibold">Water Included:</span> {listing.water_included ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Electric Included:</span> {listing.electric_included ? "Yes" : "No"}</li>
              <li><span className="font-semibold">Gas Included:</span> {listing.gas_included ? "Yes" : "No"}</li>
            </ul>
          </CardContent>
        </Card>

      </main>

      {/* Right column - Photos + Contact */}
      <aside className="w-80 p-6 border-l border-border space-y-4">

        {/* Photo gallery */}
        {images.length > 0 && (
          <div>
            <img
              src={images[selectedImage]}
              alt="Property"
              className="w-full rounded object-cover h-52"
            />
            <div className="grid grid-cols-4 gap-1 mt-2">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`View ${i + 1}`}
                  onClick={() => setSelectedImage(i)}
                  className={`w-full h-14 object-cover rounded cursor-pointer border-2 ${
                    selectedImage === i ? "border-primary" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Interested in Renting This Property?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-semibold">{listing.property_owner}</p>
            <p>
              Listing URL:{" "}
              <a href={listing.listing_url} className="text-primary underline" target="_blank" rel="noreferrer">
                View Original Listing
              </a>
            </p>
          </CardContent>
        </Card>

      </aside>
    </div>
  );
}