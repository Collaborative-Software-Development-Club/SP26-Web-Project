"use client";

import { useMemo, useState } from "react";
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
        <button
          onClick={() => go(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Prev
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => go(n)}
              className={`px-3 py-1 rounded ${n === page ? 'bg-blue-600 text-white' : 'border'}`}
            >
              {n}
            </button>
          ))}
        </div>

        <button
          onClick={() => go(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
