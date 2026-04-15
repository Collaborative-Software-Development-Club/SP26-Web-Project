"use client";

/* eslint-disable @next/next/no-img-element -- listing images use arbitrary external URLs */

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { parseMainImageUrls } from "../main-image-urls";

export interface House {
  id: string;
  address: string;
  monthly_rent: string;
  bedrooms: number;
  full_bathrooms: number;
  half_bathrooms: number;
  sector: string;
  city?: string;
  move_in_date?: string;
  /** JSONB from Supabase; also accepts a string[] after normalization elsewhere */
  main_image_url?: unknown;
}

function parsePriceNumber(rent: string): number | null {
  const numStr = rent?.replace(/[^0-9.]/g, "");
  if (!numStr) return null;
  const n = Number(numStr);
  return Number.isFinite(n) ? n : null;
}

function formatCurrency(n: number): string {
  // Fixed locale so SSR (Node) and the browser agree — default locale differs and causes hydration mismatches.
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function HouseCard({
  house,
  isFavorite = false,
  onToggleFavorite,
}: {
  house: House;
  isFavorite?: boolean;
  onToggleFavorite?: (id: House["id"]) => void;
}) {
  const base = parsePriceNumber(house.monthly_rent);
  const totalBaths = (house.full_bathrooms ?? 0) + (house.half_bathrooms ?? 0) * 0.5;
  let perPerson: string | null = null;
  if (base !== null && house.bedrooms > 1) {
    perPerson = `${formatCurrency(base / house.bedrooms)}/mo per person`;
  }

  const imageUrls = parseMainImageUrls(house.main_image_url);
  const coverSrc = imageUrls[0] ?? null;

  return (
    <article className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-44 bg-muted flex items-center justify-center overflow-hidden">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <span className="text-muted-foreground text-sm">No image available</span>
        )}

        <button
          type="button"
          aria-label={isFavorite ? "Unfavorite listing" : "Favorite listing"}
          onClick={() => onToggleFavorite?.(house.id)}
          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-background/80 text-foreground shadow-sm ring-1 ring-border backdrop-blur transition hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star className={isFavorite ? "h-4 w-4 fill-yellow-400 text-yellow-400" : "h-4 w-4"} />
        </button>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-medium text-card-foreground">{house.address}</h2>
        <p className="text-sm text-muted-foreground">
          {house.monthly_rent}{" "}
          {perPerson && <span className="text-sm text-muted-foreground">({perPerson})</span>}
        </p>

        <div className="mt-3 text-sm text-muted-foreground flex items-center gap-4">
          <span className="whitespace-nowrap">{house.bedrooms} Bedrooms</span>
          <span className="whitespace-nowrap">{totalBaths} Bath</span>
          <span className="whitespace-nowrap capitalize">{house.sector} Campus</span>
        </div>

        {(house.city || house.move_in_date) && (
          <div className="mt-2 text-sm text-muted-foreground">
            {house.city && <div>{house.city}</div>}
            {house.move_in_date && <div>Move-in: {house.move_in_date}</div>}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button asChild variant="default" size="sm">
              <a href={`/housing/${house.id}`}>View</a>
            </Button>
            <Button
              variant={isFavorite ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleFavorite?.(house.id)}
            >
              {isFavorite ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
