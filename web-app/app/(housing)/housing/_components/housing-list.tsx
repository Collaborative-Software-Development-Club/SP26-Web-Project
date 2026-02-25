"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { House, HouseCard } from "./house-card";

export function HousingList({ houses, pageSize = 9 }: { houses: House[]; pageSize?: number }) {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(houses.length / pageSize)), [houses.length, pageSize]);

  const start = (page - 1) * pageSize;
  const pageItems = useMemo(() => houses.slice(start, start + pageSize), [houses, start, pageSize]);

  function go(n: number) {
    setPage((p) => Math.min(Math.max(1, n), totalPages));
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageItems.map((h) => (
          <HouseCard key={h.id} house={h} />
        ))}
      </div>

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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
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
    </div>
  );
}
