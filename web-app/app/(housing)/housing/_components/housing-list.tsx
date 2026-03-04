"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { House, HouseCard } from "./house-card";
import { getHousingListings } from "../_actions";

export function HousingList({ initialListings, total, pageSize = 9 }: { initialListings: House[]; total: number; pageSize?: number }) {
  const [listings, setListings] = useState<House[]>(initialListings);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

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
          <HouseCard key={h.id} house={h} />
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
