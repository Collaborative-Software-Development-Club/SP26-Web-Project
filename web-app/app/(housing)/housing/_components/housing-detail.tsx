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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mainImageUrlsFromRecord } from "../main-image-urls";
import type { HousingListing } from "../types";
import { HousingDetailGallery } from "./housing-detail-gallery";
import { OtherAmenitiesMoreInfo } from "./other-amenities-more-info";

export function HousingDetail({ listing }: { listing: HousingListing }) {
  const hasAmenityValue = (value?: string | null) => {
    if (!value) return false;
    const normalized = value.trim().toLowerCase();
    return normalized !== "" && normalized !== "no" && normalized !== "none" && normalized !== "n/a";
  };
  const otherAmenitiesDetail = hasAmenityValue(listing.other_amenities)
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

  const galleryImages = mainImageUrlsFromRecord(listing.main_image_url);

  return (
    <div className="flex h-full min-h-0 w-full bg-background font-sans">
      {/* Main content */}
      <main className="min-h-0 flex-1 overflow-y-auto p-8 max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold text-foreground">
          {listing.address}
        </h1>

        {/* Photo gallery */}
        <HousingDetailGallery images={galleryImages} title={listing.address} />

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
            {otherAmenitiesDetail && (
              <div className="mt-6">
                <OtherAmenitiesMoreInfo value={otherAmenitiesDetail} />
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
      <aside className="flex min-h-0 w-96 shrink-0 items-center overflow-y-auto border-l border-border p-4">
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

            <Button size="lg" className="w-full rounded-full text-base font-semibold" asChild>
              <a href={listing.listing_url} target="_blank" rel="noopener noreferrer">
                View Original Listing
              </a>
            </Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
