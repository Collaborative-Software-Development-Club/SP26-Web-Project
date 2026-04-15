"use client";

import { useState } from "react";

export function HousingDetailGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="mb-6 flex w-full aspect-video items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
        <span className="text-sm text-muted-foreground">No image available</span>
      </div>
    );
  }

  const safeIndex = Math.min(selected, images.length - 1);
  const mainSrc = images[safeIndex] ?? images[0];

  return (
    <div className="mb-6 w-full space-y-2">
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-sm">
        <img
          src={mainSrc}
          alt={`${title} — photo ${safeIndex + 1}`}
          className="h-full w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setSelected(i)}
              className={`overflow-hidden rounded-md border-2 p-0 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                safeIndex === i ? "border-primary" : "border-transparent"
              }`}
            >
              <img
                src={src}
                alt=""
                className="h-14 w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
