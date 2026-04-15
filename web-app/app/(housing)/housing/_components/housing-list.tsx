"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { House, HouseCard } from "./house-card";
import {
  assertCanFavoriteHousing,
  getHousingListings,
  getSavedHousing,
  saveHousingListing,
  unsaveHousingListing,
} from "../_actions";
import { filterHouses, type HousingFilters } from "../housing-utils";

export function HousingList({
  initialListings,
  pageSize = 9,
  userId,
}: {
  initialListings: House[];
  pageSize?: number;
  userId: string | null;
}) {
  const [allListings, setAllListings] = useState<House[]>(initialListings);
  const [filteredListings, setFilteredListings] = useState<House[]>(initialListings);
  const [page, setPage] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set());
  const [filters, setFilters] = useState<HousingFilters>({
    minRent: "",
    maxRent: "",
    startDate: "",
    semester: "Any",
    location: "",
    distance: "",
  });
  const [savedOnly, setSavedOnly] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    startTransition(async () => {
      try {
        const { listings } = await getHousingListings(1, 1000);
        const houses = (listings as House[]) ?? [];
        setAllListings(houses);
        setFilteredListings(houses);
      } catch (error) {
        console.error("Failed to load housing listings", error);
      }
    });
  }, []);

  const displayedListings = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredListings.slice(start, start + pageSize);
  }, [filteredListings, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / pageSize));

  const listingRangeLabel = useMemo(() => {
    const total = filteredListings.length;
    if (total === 0) return "Showing 0 of 0 listings";
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    return `Showing ${start}–${end} of ${total} listings`;
  }, [filteredListings.length, page, pageSize]);

  function applyFilters() {
    startTransition(() => {
      let next = filterHouses(allListings, filters);
      if (savedOnly) {
        next = userId ? next.filter((h) => favoriteIds.has(String(h.id))) : [];
      }
      setFilteredListings(next);
      setPage(1);
      setIsDialogOpen(false);
    });
  }

  function clearFilters() {
    setFilters({ minRent: "", maxRent: "", startDate: "", semester: "Any", location: "", distance: "" });
    setSavedOnly(false);
    setFilteredListings(allListings);
    setPage(1);
  }

  // Build a fast set, for fast lookup, to store the saved-housing JSON returned by Supabase.
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    startTransition(async () => {
      try {
        const saved = await getSavedHousing(userId);
        if (cancelled) return;
        setFavoriteIds(
          new Set(
            (saved ?? [])
              .filter((r) => r.housing_id != null)
              .map((r) => String(r.housing_id)),
          ),
        );
      } catch {
        // If the RPC fails (e.g., not deployed yet), we just render as "not saved".
        if (!cancelled) setFavoriteIds(new Set());
      }
    });

    return () => {
      cancelled = true;
    };
  }, [userId, startTransition]);

  // Keep "Saved only" results in sync as the favorites set changes.
  useEffect(() => {
    if (!savedOnly) return;
    startTransition(() => {
      let next = filterHouses(allListings, filters);
      next = userId ? next.filter((h) => favoriteIds.has(String(h.id))) : [];
      setFilteredListings(next);
      setPage(1);
    });
  }, [savedOnly, favoriteIds, allListings, filters, userId, startTransition]);

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
    setPage(target);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">{listingRangeLabel}</span>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Filters
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter housing listings</DialogTitle>
              <DialogDescription>
                Filter by rent, move-in semester/date, location and distance.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Saved only Listings</span>
                </div>

                <button
                  type="button"
                  aria-pressed={savedOnly}
                  aria-label={savedOnly ? "Disable saved-only filter" : "Enable saved-only filter"}
                  onClick={() => setSavedOnly((v) => !v)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-background text-foreground shadow-sm ring-1 ring-border transition hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Star className={savedOnly ? "h-5 w-5 fill-yellow-400 text-yellow-400" : "h-5 w-5"} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Label className="flex flex-col gap-1">
                  Min rent
                  <Input
                    type="number"
                    value={filters.minRent}
                    onChange={(e) => setFilters((prev) => ({ ...prev, minRent: e.target.value }))}
                  />
                </Label>
                <Label className="flex flex-col gap-1">
                  Max rent
                  <Input
                    type="number"
                    value={filters.maxRent}
                    onChange={(e) => setFilters((prev) => ({ ...prev, maxRent: e.target.value }))}
                  />
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Label className="flex flex-col gap-1">
                  Start date
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </Label>
                <Label className="flex flex-col gap-1">
                  Semester
                  <select
                    value={filters.semester}
                    onChange={(e) => setFilters((prev) => ({ ...prev, semester: e.target.value }))}
                    className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="Any">Any</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Fall">Fall</option>
                  </select>
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Label className="flex flex-col gap-1">
                  Location
                  <Input
                    value={filters.location}
                    onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="City or address"
                  />
                </Label>
                <Label className="flex flex-col gap-1">
                  Max distance (miles)
                  <Input
                    type="number"
                    value={filters.distance}
                    onChange={(e) => setFilters((prev) => ({ ...prev, distance: e.target.value }))}
                  />
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={clearFilters}>Clear</Button>
              <Button onClick={applyFilters} disabled={isPending}>Apply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedListings.map((h) => (
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
          <Button onClick={() => go(page - 1)} disabled={page === 1 || isPending} variant="outline" size="sm">
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
