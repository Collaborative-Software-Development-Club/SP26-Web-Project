"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { House, HouseCard } from "./house-card";
import {
  assertCanFavoriteHousing,
  getHousingListings,
  getSavedHousing,
  saveHousingListing,
  unsaveHousingListing,
} from "../_actions";

export function HousingList({
  initialListings,
  total,
  pageSize = 9,
  userId,
}: {
  initialListings: House[];
  total: number;
  pageSize?: number;
  userId: string | null;
}) {
  const [listings, setListings] = useState<House[]>(initialListings);
  const [page, setPage] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set());
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Build a fast set, for fast lookup, to store the saved-housing JSON returned by Supabase.
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    startTransition(async () => {
      try {
        const saved = await getSavedHousing(userId);
        if (cancelled) return;
        setFavoriteIds(new Set((saved ?? []).map(String)));
      } catch {
        // If the RPC fails (e.g., not deployed yet), we just render as "not saved".
        if (!cancelled) setFavoriteIds(new Set());
      }
    });

    return () => {
      cancelled = true;
    };
  }, [userId, startTransition]);

  async function toggleFavorite(id: string) {
    if (!userId) {
      router.push("/login");
      return;
    }

    await assertCanFavoriteHousing();
    const wasFavorite = favoriteIds.has(id);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      if (wasFavorite) await unsaveHousingListing(id);
      else await saveHousingListing(id);
    } catch (e) {
      // Roll back optimistic update if persistence fails.
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFavorite) next.add(id);
        else next.delete(id);
        return next;
      });
      console.error(
        "Failed to persist housing favorite toggle",
        e instanceof Error ? e.message : e,
      );
    }
  }

  function go(n: number) {
    const target = Math.min(Math.max(1, n), totalPages);
    if (target === page) return;

    startTransition(async () => {
      const { listings: newListings } = await getHousingListings(target, pageSize);
      setListings(newListings as House[]);
      setPage(target);
    });
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((h) => (
          <HouseCard
            key={h.id}
            house={h}
            isFavorite={userId ? favoriteIds.has(h.id) : false}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            onClick={() => go(page - 1)}
            disabled={page === 1 || isPending}
            variant="outline"
            size="sm"
          >
            Prev
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n >= page - 3 && n <= page + 3)
              .map((n) => (
                <Button
                  key={n}
                  onClick={() => go(n)}
                  variant={n === page ? "default" : "outline"}
                  size="sm"
                  disabled={isPending}
                >
                  {n}
                </Button>
              ))}
          </div>

          <Button
            onClick={() => go(page + 1)}
            disabled={page === totalPages || isPending}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
