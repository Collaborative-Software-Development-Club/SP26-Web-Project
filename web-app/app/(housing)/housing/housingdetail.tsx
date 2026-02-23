"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type HousingListing = {
  id: string;
  address: string;
  monthlyRentMin: number;
  monthlyRentMax: number;
  moveInDate: string;
  moveOutDate: string;
  leaseTerm: string;
  sublease: boolean;
  securityDeposit: string;
  ownerName: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: string;
  maxOccupancy: number;
  wheelchairAccess: boolean;
  basement: boolean;
  laundry: string;
  parking: boolean;
  parkingSpaces: number;
  petsAllowed: boolean;
  waterIncluded: boolean;
  electricIncluded: boolean;
  gasIncluded: boolean;
  airConditioning: string;
  dishwasher: boolean;
  backyard: boolean;
  deckOrPorch: boolean;
  comments: string;
  images: string[];
  ownerPhone: string;
  ownerEmail: string;
};

export default function HousingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState<HousingListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetch(`/api/housing/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch listing");
        return res.json();
      })
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      Loading...
    </div>
  );

  if (error) return (
    <div className="flex min-h-screen items-center justify-center text-red-500">
      {error}
    </div>
  );

  if (!listing) return null;

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">

      {/* Main content */}
      <main className="flex-1 p-8 max-w-4xl">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-6">{listing.address}</h1>

        {/* Listing Information */}
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-red-700 mb-3">Listing Information</h2>
          <ul className="space-y-1 text-sm">
            <li><span className="font-semibold">ID:</span> {listing.id}</li>
            <li><span className="font-semibold">Monthly Rent:</span> ${listing.monthlyRentMin} - ${listing.monthlyRentMax}</li>
            <li><span className="font-semibold">Move In Date:</span> {listing.moveInDate}</li>
            <li><span className="font-semibold">Move Out Date:</span> {listing.moveOutDate}</li>
            <li><span className="font-semibold">Lease Term:</span> {listing.leaseTerm}</li>
            <li><span className="font-semibold">Sublease Permitted:</span> {listing.sublease ? "Yes" : "No"}</li>
            <li><span className="font-semibold">Security Deposit:</span> {listing.securityDeposit}</li>
            <li><span className="font-semibold">Property Owner:</span> {listing.ownerName}</li>
          </ul>
        </section>

        {/* Property Details */}
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-red-700 mb-3">Property Details</h2>
          <ul className="space-y-1 text-sm">
            <li><span className="font-semibold">Property Type:</span> {listing.propertyType}</li>
            <li><span className="font-semibold">Bedrooms:</span> {listing.bedrooms}</li>
            <li><span className="font-semibold">Bathrooms:</span> {listing.bathrooms}</li>
            <li><span className="font-semibold">Max Occupancy:</span> {listing.maxOccupancy}</li>
            <li><span className="font-semibold">Wheelchair Access:</span> {listing.wheelchairAccess ? "Yes" : "No"}</li>
            <li><span className="font-semibold">Basement:</span> {listing.basement ? "Yes" : "No"}</li>
            <li><span className="font-semibold">Laundry:</span> {listing.laundry}</li>
          </ul>
        </section>

        {/* Parking */}
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-red-700 mb-3">Parking Information</h2>
          <ul className="space-y-1 text-sm">
            <li><span className="font-semibold">Parking:</span> {listing.parking ? "Yes" : "No"}</li>
            <li><span className="font-semibold">Number of Spaces:</span> {listing.parkingSpaces}</li>
          </ul>
        </section>

        {/* Amenities */}
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-red-700 mb-3">Amenities</h2>
          <ul className="space-y-1 text-sm">
            <li><span className="font-semibold">Air Conditioning:</span> {listing.airConditioning}</li>
            <li><span className="font-semibold">Dishwasher:</span> {listing.dishwasher ? "Yes" : "No"}</li>
            <li><span className="font-semibold">Backyard:</span> {listing.backyard ? "Yes" : "No"}</li>
            <li><span className="font-semibold">Deck or Porch:</span> {listing.deckOrPorch ? "Yes" : "No"}</li>
            <li><span className="font-semibold">Pets Allowed:</span> {listing.petsAllowed ? "Yes" : "No"}</li>
          </ul>
        </section>

        {/* Utilities */}
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-red-700 mb-3">Utilities</h2>
          <ul className="space-y-1 text-sm">
            <li><span className="font-semibold">Water Included:</span> {listing.waterIncluded ? "Yes" : "No"}</li>
            <li><span className="font-semibold">Electric Included:</span> {listing.electricIncluded ? "Yes" : "No"}</li>
            <li><span className="font-semibold">Gas Included:</span> {listing.gasIncluded ? "Yes" : "No"}</li>
          </ul>
        </section>

        {/* Comments */}
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-red-700 mb-3">Comments</h2>
          <p className="text-sm">{listing.comments}</p>
        </section>

      </main>

      {/* Right column - Photos + Contact */}
      <aside className="w-80 p-6 border-l space-y-4">

        {/* Main photo */}
        {listing.images.length > 0 && (
          <div>
            <img
              src={listing.images[selectedImage]}
              alt="Property"
              className="w-full rounded object-cover h-52"
            />
            {/* Thumbnail grid */}
            <div className="grid grid-cols-4 gap-1 mt-2">
              {listing.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`View ${i + 1}`}
                  onClick={() => setSelectedImage(i)}
                  className={`w-full h-14 object-cover rounded cursor-pointer border-2 ${
                    selectedImage === i ? "border-red-700" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Contact info */}
        <div className="border rounded p-4">
          <h3 className="font-bold mb-2">Interested in Renting This Property?</h3>
          <p className="text-sm font-semibold">{listing.ownerName}</p>
          <p className="text-sm">Phone: {listing.ownerPhone}</p>
          <p className="text-sm">
            Email:{" "}
            <a href={`mailto:${listing.ownerEmail}`} className="text-red-700 underline">
              {listing.ownerEmail}
            </a>
          </p>
        </div>

      </aside>
    </div>
  );
}