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
import { Star, Trash2 } from "lucide-react";
import { House, HouseCard } from "./house-card";
import { DeletedListingCard, type DeletedListing } from "./deleted-listing-card";
import {
  assertCanFavoriteHousing,
  getSavedHousing,
  saveHousingListing,
  unsaveHousingListing,
} from "../_actions";
import { filterHouses, filterDeletedListings, type HousingFilters } from "../housing-utils";
import deletedListings from "@/mock/deleted_listings.json";

export function HousingList({
  initialListings,
  pageSize = 9,
  userId,
}: {
  initialListings: House[];
  pageSize?: number;
  userId: string | null;
}) {
  const [allListings] = useState<House[]>(initialListings);
  const [deletedListingsData] = useState<DeletedListing[]>(deletedListings as DeletedListing[]);
  const [filteredListings, setFilteredListings] = useState<House[]>(initialListings);
  const [filteredDeletedListings, setFilteredDeletedListings] = useState<DeletedListing[]>([]);
  const [page, setPage] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set());
  const [filters, setFilters] = useState<HousingFilters>({
    minRent: "",
    maxRent: "",
    startDate: "",
    semester: "Any",
    location: "",
    distance: "",
    showDeleted: false,
  });
  const [savedOnly, setSavedOnly] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const displayedListings = useMemo(() => {
    const combined = [...filteredListings, ...(filters.showDeleted ? filteredDeletedListings : [])];
    const start = (page - 1) * pageSize;
    return combined.slice(start, start + pageSize);
  }, [filteredListings, filteredDeletedListings, page, pageSize, filters.showDeleted]);

  const totalPages = useMemo(() => {
    const combined = [...filteredListings, ...(filters.showDeleted ? filteredDeletedListings : [])];
    return Math.max(1, Math.ceil(combined.length / pageSize));
  }, [filteredListings, filteredDeletedListings, pageSize, filters.showDeleted]);

  const listingRangeLabel = useMemo(() => {
    const combined = [...filteredListings, ...(filters.showDeleted ? filteredDeletedListings : [])];
    const total = combined.length;
    if (total === 0) return "Showing 0 of 0 listings";
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    return `Showing ${start}–${end} of ${total} listings`;
  }, [filteredListings, filteredDeletedListings, page, pageSize, filters.showDeleted]);

  function applyFilters() {
    startTransition(() => {
      let next = filterHouses(allListings, filters);
      if (savedOnly) {
        next = userId ? next.filter((h) => favoriteIds.has(String(h.id))) : [];
      }
      setFilteredListings(next);
      
      // Filter deleted listings
      let nextDeleted = filterDeletedListings(deletedListingsData, filters);
      if (savedOnly) {
        nextDeleted = userId ? nextDeleted.filter((d) => favoriteIds.has(d.id)) : [];
      }
      setFilteredDeletedListings(nextDeleted);
      
      setPage(1);
      setIsDialogOpen(false);
    });
  }

  function clearFilters() {
    setFilters({ minRent: "", maxRent: "", startDate: "", semester: "Any", location: "", distance: "", showDeleted: false });
    setSavedOnly(false);
    setFilteredListings(initialListings);
    setFilteredDeletedListings([]);
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
      
      let nextDeleted = filterDeletedListings(deletedListingsData, filters);
      nextDeleted = userId ? nextDeleted.filter((d) => favoriteIds.has(d.id)) : [];
      setFilteredDeletedListings(nextDeleted);
      
      setPage(1);
    });
  }, [savedOnly, favoriteIds, allListings, filters, userId, startTransition, deletedListingsData]);

  // Update deleted listings when showDeleted filter changes or filters change
  useEffect(() => {
    startTransition(() => {
      if (filters.showDeleted) {
        let nextDeleted = filterDeletedListings(deletedListingsData, filters);
        if (savedOnly) {
          nextDeleted = userId ? nextDeleted.filter((d) => favoriteIds.has(d.id)) : [];
        }
        setFilteredDeletedListings(nextDeleted);
      } else {
        setFilteredDeletedListings([]);
      }
    });
  }, [filters, deletedListingsData, savedOnly, userId, favoriteIds, startTransition]);

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

              <div className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Show Deleted Listings</span>
                </div>

                <button
                  type="button"
                  aria-pressed={filters.showDeleted}
                  aria-label={filters.showDeleted ? "Hide deleted listings" : "Show deleted listings"}
                  onClick={() => setFilters((prev) => ({ ...prev, showDeleted: !prev.showDeleted }))}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-background text-foreground shadow-sm ring-1 ring-border transition hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Trash2 className={filters.showDeleted ? "h-5 w-5 text-red-500" : "h-5 w-5"} />
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
        {displayedListings.map((item) => {
          // Check if it's a DeletedListing or House based on presence of bedrooms
          if ("bedrooms" in item && item.bedrooms !== undefined) {
            // It's a House
            const house = item as House;
            return (
              <HouseCard
                key={house.id}
                house={house}
                isFavorite={userId ? favoriteIds.has(house.id) : false}
                onToggleFavorite={toggleFavorite}
              />
            );
          } else {
            // It's a DeletedListing
            const deleted = item as DeletedListing;
            return (
              <DeletedListingCard
                key={deleted.id}
                listing={deleted}
                isFavorite={userId ? favoriteIds.has(deleted.id) : false}
                onToggleFavorite={toggleFavorite}
              />
            );
          }
        })}
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
