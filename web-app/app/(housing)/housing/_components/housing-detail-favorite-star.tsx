"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import {
  assertCanFavoriteHousing,
  saveHousingListing,
  unsaveHousingListing,
} from "../_actions";

export function HousingDetailFavoriteStar({
  housingId,
  userId,
  initialIsFavorite,
}: {
  housingId: string;
  userId: string | null;
  initialIsFavorite: boolean;
}) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, startTransition] = useTransition();

  function toggleFavorite() {
    if (!userId) {
      router.push("/login");
      return;
    }

    startTransition(async () => {
      await assertCanFavoriteHousing();
      const wasFavorite = isFavorite;
      setIsFavorite(!wasFavorite);
      try {
        if (wasFavorite) await unsaveHousingListing(housingId);
        else await saveHousingListing(housingId);
      } catch (e) {
        setIsFavorite(wasFavorite);
        console.error(
          "Failed to persist housing favorite toggle",
          e instanceof Error ? e.message : e,
        );
      }
    });
  }

  return (
    <button
      type="button"
      aria-label={isFavorite ? "Unfavorite listing" : "Favorite listing"}
      aria-pressed={isFavorite}
      onClick={toggleFavorite}
      disabled={isPending}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-background text-foreground shadow-sm ring-1 ring-border transition hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Star
        className={isFavorite ? "h-5 w-5 fill-yellow-400 text-yellow-400" : "h-5 w-5"}
      />
    </button>
  );
}
