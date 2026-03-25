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

interface HousingFilters {
  minRent: string;
  maxRent: string;
  startDate: string;
  semester: string;
  location: string;
  distance: string;
}

function parsePriceNumber(rent?: string): number | null {
  if (!rent) return null;
  const numStr = rent.replace(/[^0-9.]/g, "");
  if (!numStr) return null;
  const n = Number(numStr);
  return Number.isFinite(n) ? n : null;
}

function parseRentRange(rent?: string): { min: number | null; max: number | null } {
  if (!rent) return { min: null, max: null };

  const parts = rent.split('-').map((s) => s.trim());

  if (parts.length === 2) {
    const minVal = parsePriceNumber(parts[0]);
    const maxVal = parsePriceNumber(parts[1]);
    return { min: minVal, max: maxVal };
  } else {
    const val = parsePriceNumber(rent);
    return { min: val, max: val };
  }
}

function getSemesterFromDate(dateString?: string) {
  if (!dateString) return null;
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return null;
  const month = parsed.getMonth() + 1;
  if (month >= 1 && month <= 4) return "Spring";
  if (month >= 5 && month <= 8) return "Summer";
  return "Fall";
}

function filterHouses(listings: House[], filters: HousingFilters) {
  return listings.filter((house) => {
    const { min: rentMin, max: rentMax } = parseRentRange(house.monthly_rent);

    if (filters.minRent !== "") {
      const minRent = Number(filters.minRent);
      if (!Number.isNaN(minRent) && rentMin !== null && rentMin < minRent) return false;
    }

    if (filters.maxRent !== "") {
      const maxRent = Number(filters.maxRent);
      if (!Number.isNaN(maxRent) && rentMax !== null && rentMax > maxRent) return false;
    }

    if (filters.startDate && house.move_in_date) {
      const filterDate = new Date(filters.startDate);
      const moveIn = new Date(house.move_in_date);
      if (!Number.isNaN(filterDate.getTime()) && !Number.isNaN(moveIn.getTime()) && moveIn < filterDate) {
        return false;
      }
    }

    if (filters.semester) {
      const houseSemester = getSemesterFromDate(house.move_in_date);
      if (houseSemester && filters.semester !== "Any" && houseSemester !== filters.semester) {
        return false;
      }
    }

    if (filters.location) {
      const text = `${house.address ?? ""} ${house.city ?? ""}`.toLowerCase();
      if (!text.includes(filters.location.toLowerCase())) {
        return false;
      }
    }

    if (filters.distance && !Number.isNaN(Number(filters.distance))) {
    }

    return true;
  });
}

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
