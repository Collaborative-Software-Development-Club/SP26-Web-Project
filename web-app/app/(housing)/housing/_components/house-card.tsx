"use client";

import { Button } from "@/components/ui/button";

export interface House {
  id: string;
  address: string;
  monthly_rent: string;
  bedrooms: number;
  full_bathrooms: number;
  half_bathrooms: number;
  sector: string;
}

function parsePriceNumber(rent: string): number | null {
  const numStr = rent?.replace(/[^0-9.]/g, "");
  if (!numStr) return null;
  const n = Number(numStr);
  return Number.isFinite(n) ? n : null;
}

function formatCurrency(n: number): string {
  return "$" + Math.round(n).toLocaleString();
}

export function HouseCard({ house }: { house: House }) {
  const base = parsePriceNumber(house.monthly_rent);
  const totalBaths = (house.full_bathrooms ?? 0) + (house.half_bathrooms ?? 0) * 0.5;
  let perPerson: string | null = null;
  if (base !== null && house.bedrooms > 1) {
    perPerson = `${formatCurrency(base / house.bedrooms)}/mo per person`;
  }

  return (
    <article className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="h-44 bg-muted flex items-center justify-center">
        <span className="text-muted-foreground text-sm">No image available</span>
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

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button asChild variant="default" size="sm">
              <a href={`/housing/${house.id}`}>View</a>
            </Button>
            <Button variant="outline" size="sm">Save</Button>
          </div>
        </div>
      </div>
    </article>
  );
}
