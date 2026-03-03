"use client";

import { Button } from "@/components/ui/button";

export interface House {
  id: number;
  address: string;
  price: string;
  img: string;
  bedrooms: number;
  bathrooms: number;
  sector: 'north' | 'south' | 'east' | 'west' | string;
}

function parsePriceNumber(price: string): number | null {
  // Extract digits and decimals from strings like "$1,200/mo"
  const numStr = price.replace(/[^0-9.]/g, '');
  if (!numStr) return null;
  const n = Number(numStr);
  return Number.isFinite(n) ? n : null;
}

function formatCurrency(n: number): string {
  return '$' + Math.round(n).toLocaleString();
}

export function HouseCard({ house }: { house: House }) {
  const base = parsePriceNumber(house.price);
  let perPerson: string | null = null;
  if (base !== null && house.bedrooms > 1) {
    perPerson = `${formatCurrency(base / house.bedrooms)}/mo per person`;
  }

  return (
    <article className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="h-44 bg-muted overflow-hidden">
        <img src={house.img} alt={house.address} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-medium text-card-foreground">{house.address}</h2>
        <p className="text-sm text-muted-foreground">
          {house.price}{' '}
          {perPerson && <span className="text-sm text-muted-foreground">({perPerson})</span>}
        </p>

        <div className="mt-3 text-sm text-muted-foreground flex items-center gap-4">
          <span className="whitespace-nowrap">{house.bedrooms} Bedrooms</span>
          <span className="whitespace-nowrap">{house.bathrooms} Bath</span>
          <span className="whitespace-nowrap capitalize">{house.sector} Campus</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button asChild variant="default" size="sm">
              <a href="#">View</a>
            </Button>
            <Button variant="outline" size="sm">Save</Button>
          </div>
        </div>
      </div>
    </article>
  );
}
