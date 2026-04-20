"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
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
import { House } from "@/app/(housing)/housing/_components/house-card";
import { getHousingListings } from "@/app/(housing)/housing/_actions";
import { HOUSING_LISTINGS_BATCH_SIZE } from "@/app/(housing)/housing/housing-list-batch";
import { AdminHouseCard } from "./admin-house-card";
import {
  EMPTY_HOUSING_FILTERS,
  filterHouses,
  housingFiltersAreEmpty,
  type HousingFilters,
} from "@/app/(housing)/housing/housing-utils";

export function AdminHousingList({
  initialListings,
  initialTotal,
  pageSize = 9,
}: {
  initialListings: House[];
  initialTotal: number;
  pageSize?: number;
}) {
  const [allListings, setAllListings] = useState<House[]>(initialListings);
  const [filteredListings, setFilteredListings] = useState<House[]>(initialListings);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<HousingFilters>({ ...EMPTY_HOUSING_FILTERS });
  const appliedFiltersRef = useRef<HousingFilters>({ ...EMPTY_HOUSING_FILTERS });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const allListingsRef = useRef(allListings);
  allListingsRef.current = allListings;

  function computeFiltered(rows: House[]) {
    return filterHouses(rows, filters);
  }

  // Keep client state aligned with the server RSC payload (e.g. after router.refresh() when a listing is deleted).
  useEffect(() => {
    setAllListings(initialListings);
    setTotalCount(initialTotal);
    const nextFiltered = filterHouses(initialListings, appliedFiltersRef.current);
    setFilteredListings(nextFiltered);
    setPage((p) => {
      const maxPage = Math.max(1, Math.ceil(nextFiltered.length / pageSize));
      return Math.min(p, maxPage);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when server props change, not draft dialog edits
  }, [initialListings, initialTotal, pageSize]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredListings.slice(start, start + pageSize);
  }, [filteredListings, page, pageSize]);

  /** Total rows in the database (Supabase exact count). */
  const totalRecordCount = totalCount;

  const pagesFromLoadedFiltered = Math.max(1, Math.ceil(filteredListings.length / pageSize));
  const showingFullDataset = housingFiltersAreEmpty(appliedFiltersRef.current);
  const pagesFromTotalRecords = Math.max(1, Math.ceil(totalRecordCount / pageSize));
  const navTotalPages = showingFullDataset
    ? Math.max(pagesFromLoadedFiltered, pagesFromTotalRecords)
    : pagesFromLoadedFiltered;

  const hasMoreRaw = allListings.length < totalCount;

  const listingRangeLabel = useMemo(() => {
    const total = filteredListings.length;
    if (total === 0) return "Showing 0 of 0 listings";
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    return `Showing ${start}–${end} of ${total} listings`;
  }, [filteredListings.length, page, pageSize]);

  function applyFilters() {
    startTransition(() => {
      appliedFiltersRef.current = { ...filters };
      setFilteredListings(computeFiltered(allListings));
      setPage(1);
      setIsDialogOpen(false);
    });
  }

  function clearFilters() {
    appliedFiltersRef.current = { ...EMPTY_HOUSING_FILTERS };
    setFilters({ ...EMPTY_HOUSING_FILTERS });
    setFilteredListings(allListings);
    setPage(1);
  }

  const busy = isPending || isLoadingMore;

  async function goToPage(n: number) {
    const target = Math.max(1, n);
    if (busy) return;
    if (target === page) return;

    setIsLoadingMore(true);
    try {
      let rows = [...allListingsRef.current];

      while (true) {
        const filtered = computeFiltered(rows);
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
          const f = computeFiltered(rows);
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
              <div className="grid grid-cols-2 gap-3">
                <Label className="flex flex-col gap-1">
                  Min rent
                  <Input
                    type="number"
                    value={filters.minRent}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, minRent: e.target.value }))
                    }
                  />
                </Label>
                <Label className="flex flex-col gap-1">
                  Max rent
                  <Input
                    type="number"
                    value={filters.maxRent}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, maxRent: e.target.value }))
                    }
                  />
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Label className="flex flex-col gap-1">
                  Start date
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                  />
                </Label>
                <Label className="flex flex-col gap-1">
                  Semester
                  <select
                    value={filters.semester}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, semester: e.target.value }))
                    }
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
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="City or address"
                  />
                </Label>
                <Label className="flex flex-col gap-1">
                  Max distance (miles)
                  <Input
                    type="number"
                    value={filters.distance}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, distance: e.target.value }))
                    }
                  />
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={clearFilters}>
                Clear
              </Button>
              <Button onClick={applyFilters} disabled={isPending}>
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginated.map((h) => (
          <AdminHouseCard key={h.id} house={h} />
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