"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
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
import {
  EMPTY_HOUSING_FILTERS,
  filterHouses,
  housingFiltersAreEmpty,
  type HousingFilters,
} from "../housing-utils";
import { HOUSING_LISTINGS_BATCH_SIZE } from "../housing-list-batch";

export function HousingList({
  initialListings,
  initialTotal,
  pageSize = 9,
  userId,
}: {
  initialListings: House[];
  initialTotal: number;
  pageSize?: number;
  userId: string | null;
}) {
  const [allListings, setAllListings] = useState<House[]>(initialListings);
  const [filteredListings, setFilteredListings] = useState<House[]>(initialListings);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set());
  const [filters, setFilters] = useState<HousingFilters>({ ...EMPTY_HOUSING_FILTERS });
  const appliedFiltersRef = useRef<HousingFilters>({ ...EMPTY_HOUSING_FILTERS });
  const [savedOnly, setSavedOnly] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const allListingsRef = useRef(allListings);
  const favoriteIdsRef = useRef(favoriteIds);
  allListingsRef.current = allListings;
  favoriteIdsRef.current = favoriteIds;

  function computeFiltered(
    rows: House[],
    favs: Set<string>,
    housingFilters: HousingFilters = filters,
  ) {
    let next = filterHouses(rows, housingFilters);
    if (savedOnly) {
      next = userId ? next.filter((h) => favs.has(String(h.id))) : [];
    }
    return next;
  }

  // Keep client state aligned with the server RSC payload (e.g. after router.refresh()).
  useEffect(() => {
    setAllListings(initialListings);
    setTotalCount(initialTotal);
    const nextFiltered = computeFiltered(
      initialListings,
      favoriteIds,
      appliedFiltersRef.current,
    );
    setFilteredListings(nextFiltered);
    setPage((p) => {
      const maxPage = Math.max(1, Math.ceil(nextFiltered.length / pageSize));
      return Math.min(p, maxPage);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when server props change, not draft dialog edits
  }, [initialListings, initialTotal, pageSize]);

  const displayedListings = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredListings.slice(start, start + pageSize);
  }, [filteredListings, page, pageSize]);

  /** Total rows in the database (Supabase exact count). */
  const totalRecordCount = totalCount;

  const pagesFromLoadedFiltered = Math.max(1, Math.ceil(filteredListings.length / pageSize));
  const showingFullDataset =
    !savedOnly && housingFiltersAreEmpty(appliedFiltersRef.current);
  const pagesFromTotalRecords = Math.max(1, Math.ceil(totalRecordCount / pageSize));
  const navTotalPages = showingFullDataset
    ? Math.max(pagesFromLoadedFiltered, pagesFromTotalRecords)
    : pagesFromLoadedFiltered;

  const hasMoreRaw = allListings.length < totalCount;

  const listingRangeLabel = useMemo(() => {
    const totalForLabel = showingFullDataset ? totalRecordCount : filteredListings.length;
    if (filteredListings.length === 0) {
      return totalForLabel === 0 ? "Showing 0 of 0 listings" : `Showing 0 of ${totalForLabel} listings`;
    }
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, filteredListings.length);
    return `Showing ${start}–${end} of ${totalForLabel} listings`;
  }, [filteredListings.length, page, pageSize, showingFullDataset, totalRecordCount]);

  function applyFilters() {
    startTransition(() => {
      appliedFiltersRef.current = { ...filters };
      setFilteredListings(computeFiltered(allListings, favoriteIds));
      setPage(1);
      setIsDialogOpen(false);
    });
  }

  function clearFilters() {
    appliedFiltersRef.current = { ...EMPTY_HOUSING_FILTERS };
    setFilters({ ...EMPTY_HOUSING_FILTERS });
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
      setFilteredListings(computeFiltered(allListings, favoriteIds));
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

  const busy = isPending || isLoadingMore;

  async function goToPage(n: number) {
    const target = Math.max(1, n);
    if (busy) return;
    if (target === page) return;

    setIsLoadingMore(true);
    try {
      let rows = [...allListingsRef.current];
      const favs = favoriteIdsRef.current;

      while (true) {
        const filtered = computeFiltered(rows, favs, appliedFiltersRef.current);
        const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));
        const neededEnd = target * pageSize;

        if (neededEnd <= filtered.length) {
          setAllListings(rows);
          setFilteredListings(filtered);
          setPage(Math.min(target, maxPage));
          break;
        }

        if (rows.length >= totalCount) {
          setAllListings(rows);
          setFilteredListings(filtered);
          setPage(Math.min(target, maxPage));
          break;
        }

        const apiPage = Math.floor(rows.length / HOUSING_LISTINGS_BATCH_SIZE) + 1;
        const { listings: batch } = await getHousingListings(
          apiPage,
          HOUSING_LISTINGS_BATCH_SIZE,
        );
        if (!batch?.length) {
          const f = computeFiltered(rows, favs, appliedFiltersRef.current);
          setAllListings(rows);
          setFilteredListings(f);
          setPage(Math.min(target, Math.max(1, Math.ceil(f.length / pageSize))));
          break;
        }
        rows = [...rows, ...(batch as House[])];
        allListingsRef.current = rows;
      }
    } finally {
      setIsLoadingMore(false);
    }
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

      {(navTotalPages > 1 || hasMoreRaw) && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            onClick={() => void goToPage(page - 1)}
            disabled={page === 1 || busy}
            variant="outline"
            size="sm"
          >
            Prev
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: navTotalPages }, (_, i) => i + 1)
              .filter((n) => n >= page - 3 && n <= page + 3)
              .map((n) => (
                <Button
                  key={n}
                  onClick={() => void goToPage(n)}
                  variant={n === page ? "default" : "outline"}
                  size="sm"
                  disabled={busy}
                >
                  {n}
                </Button>
              ))}
          </div>
          <Button
            onClick={() => void goToPage(page + 1)}
            disabled={busy || (page >= navTotalPages && !hasMoreRaw)}
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
