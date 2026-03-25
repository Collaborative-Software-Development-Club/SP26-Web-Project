"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
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
import { House, HouseCard } from "./house-card";
import { getHousingListings } from "../_actions";
import { filterHouses, type HousingFilters } from "../housing-utils";

export function HousingList({ initialListings, total, pageSize = 9 }: { initialListings: House[]; total: number; pageSize?: number }) {
  const [allListings, setAllListings] = useState<House[]>(initialListings);
  const [filteredListings, setFilteredListings] = useState<House[]>(initialListings);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<HousingFilters>({
    minRent: "",
    maxRent: "",
    startDate: "",
    semester: "Any",
    location: "",
    distance: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  function applyFilters() {
    startTransition(() => {
      const next = filterHouses(allListings, filters);
      setFilteredListings(next);
      setPage(1);
      setIsDialogOpen(false);
    });
  }

  function clearFilters() {
    setFilters({ minRent: "", maxRent: "", startDate: "", semester: "Any", location: "", distance: "" });
    setFilteredListings(allListings);
    setPage(1);
  }

  function go(n: number) {
    const target = Math.min(Math.max(1, n), totalPages);
    if (target === page) return;
    setPage(target);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          Showing {filteredListings.length} of {allListings.length} listings
        </span>

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
          <HouseCard key={h.id} house={h} />
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
