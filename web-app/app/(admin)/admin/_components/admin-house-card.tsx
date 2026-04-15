"use client";

/* eslint-disable @next/next/no-img-element -- listing images use arbitrary external URLs */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { House } from "@/app/(housing)/housing/_components/house-card";
import { parseMainImageUrls } from "@/app/(housing)/housing/main-image-urls";
import { deleteHousingListing } from "../admin-db";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

function parsePriceNumber(rent: string): number | null {
  const numStr = rent?.replace(/[^0-9.]/g, "");
  if (!numStr) return null;
  const n = Number(numStr);
  return Number.isFinite(n) ? n : null;
}

function formatCurrency(n: number): string {
  // Fixed locale so SSR (Node) and the browser agree — default locale differs and can cause hydration mismatches.
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function AdminHouseCard({ house }: { house: House }) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const base = parsePriceNumber(house.monthly_rent);
  const totalBaths = (house.full_bathrooms ?? 0) + (house.half_bathrooms ?? 0) * 0.5;
  let perPerson: string | null = null;
  if (base !== null && house.bedrooms > 1) {
    perPerson = `${formatCurrency(base / house.bedrooms)}/mo per person`;
  }

  const imageUrls = parseMainImageUrls(house.main_image_url);
  const coverSrc = imageUrls[0] ?? null;

  function onDeleteClick() {
    startTransition(async () => {
      try {
        await deleteHousingListing(house.id);
        setIsConfirmOpen(false);
        router.refresh();
      } catch (error) {
        console.error(
          "Failed to delete housing listing",
          error instanceof Error ? error.message : error,
        );
      }
    });
  }

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
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isPending}>
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete this listing?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. Please confirm you want to delete
                    this housing listing.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 rounded-md border border-border bg-muted/30 p-3 text-sm">
                  <p>
                    <span className="font-semibold">UUID:</span> {house.id}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span> {house.address}
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsConfirmOpen(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={onDeleteClick}
                    disabled={isPending}
                  >
                    {isPending ? "Deleting..." : "Confirm Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </article>
  );
}