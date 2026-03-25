"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { House, HouseCard } from "./house-card";
import { mockSavedListings } from "./mock-saved-listings";

const PAGE_SIZE = 9;

export function SavedHousingList() {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(mockSavedListings.length / PAGE_SIZE));
  const paginated = mockSavedListings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function go(n: number) {
    const target = Math.min(Math.max(1, n), totalPages);
    if (target !== page) setPage(target);
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginated.map((h) => (
          <HouseCard key={h.id} house={h} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            onClick={() => go(page - 1)}
            disabled={page === 1}
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
                >
                  {n}
                </Button>
              ))}
          </div>

          <Button
            onClick={() => go(page + 1)}
            disabled={page === totalPages}
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