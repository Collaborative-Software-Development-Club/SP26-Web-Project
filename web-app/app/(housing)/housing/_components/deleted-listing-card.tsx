"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export interface DeletedListing {
  id: string;
  address: string;
  listing_url: string | null;
}

export function DeletedListingCard({
  listing,
  onToggleFavorite,
}: {
  listing: DeletedListing;
  onToggleFavorite?: (address: string) => void;
}) {
  return (
    <article className="overflow-hidden rounded-lg bg-card opacity-60 shadow-sm">
      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-muted">
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <p className="font-semibold text-white">Listing Deleted</p>
        </div>
        <button
          type="button"
          aria-label="Unsave deleted listing"
          onClick={() => onToggleFavorite?.(listing.address)}
          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-background/80 text-foreground shadow-sm ring-1 ring-border backdrop-blur transition hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        </button>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-medium text-card-foreground">{listing.address}</h2>

        <div className="mt-2 inline-block rounded bg-red-100 px-2 py-1 text-xs text-red-800">
          Deleted Listing
        </div>

        <div className="mt-4 flex items-center justify-between">
          {listing.listing_url ? (
            <Button asChild size="sm" variant="outline">
              <a href={listing.listing_url} rel="noopener noreferrer" target="_blank">
                View Original
              </a>
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">Original link unavailable</span>
          )}
        </div>
      </div>
    </article>
  );
}
