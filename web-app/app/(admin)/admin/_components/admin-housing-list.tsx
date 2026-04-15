"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { House } from "@/app/(housing)/housing/_components/house-card";
import { AdminHouseCard } from "./admin-house-card";
import { getHousingListings } from "@/app/(housing)/housing/_actions";

export function AdminHousingList({
  initialListings,
  pageSize = 9,
}: {
  initialListings: House[];
  pageSize?: number;
}) {
  const [allListings, setAllListings] = useState<House[]>(initialListings);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const { listings } = await getHousingListings(1, 1000);
        const houses = (listings as House[]) ?? [];
        setAllListings(houses);
      } catch (error) {
        console.error("Failed to load admin housing listings", error);
      }
    });
  }, [startTransition]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return allListings.slice(start, start + pageSize);
  }, [allListings, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(allListings.length / pageSize));

  function go(n: number) {
    const target = Math.min(Math.max(1, n), totalPages);
    if (target !== page) setPage(target);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          Showing {paginated.length} of {allListings.length} listings
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginated.map((h) => (
          <AdminHouseCard key={h.id} house={h} />
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