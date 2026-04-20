"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export interface DeletedListing {
  id: string;
  address: string;
  listing_url: string;
}

export function DeletedListingCard({
  listing,
  isFavorite = false,
  onToggleFavorite,
}: {
  listing: DeletedListing;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}) {
  return (
    <article className="bg-card rounded-lg shadow-sm overflow-hidden opacity-60">
      <div className="relative h-44 bg-muted flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="text-center">
            <p className="text-white font-semibold">Listing Deleted</p>
          </div>
        </div>

        <button
          type="button"
          aria-label={isFavorite ? "Unfavorite listing" : "Favorite listing"}
          onClick={() => onToggleFavorite?.(listing.id)}
          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-background/80 text-foreground shadow-sm ring-1 ring-border backdrop-blur transition hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star className={isFavorite ? "h-4 w-4 fill-yellow-400 text-yellow-400" : "h-4 w-4"} />
        </button>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-medium text-card-foreground">{listing.address}</h2>

        <div className="mt-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded inline-block">
          Deleted Listing
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={listing.listing_url} target="_blank" rel="noopener noreferrer">
                View Original
              </a>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
