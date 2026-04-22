"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Share2 } from "lucide-react";
import {
  assertCanShareHousing,
  getHousingShareTargets,
  shareHousingListing,
  type HousingShareTarget,
} from "../_actions";

export function ShareListingDropdown({
  listingId,
  userId,
}: {
  listingId: string;
  userId: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [targets, setTargets] = useState<HousingShareTarget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const MAX_NAME_CHARS = 10;
  const formatName = (name: string) =>
    name.length > MAX_NAME_CHARS ? `${name.slice(0, MAX_NAME_CHARS)}....` : name;
  const dropdownWidthCh = useMemo(() => {
    if (targets.length === 0) return MAX_NAME_CHARS;
    const longest = Math.max(...targets.map((t) => formatName(t.name).length));
    return longest;
  }, [targets]);

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    setError("");
    getHousingShareTargets()
      .then((result) => {
        for (const user of result) {
          if (!(user.fname ?? "").trim() && !(user.lname ?? "").trim()) {
            console.warn(
              `[housing] unable to find name for uuid ${user.peerUserId} in user_profiles`,
            );
          }
        }
        setTargets(result);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load conversations"),
      )
      .finally(() => setIsLoading(false));
  }, [open]);

  function onShare(target: HousingShareTarget) {
    startTransition(async () => {
      try {
        await shareHousingListing(target.conversationId, listingId);
        setOpen(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to share listing");
      }
    });
  }

  function onOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setOpen(false);
      return;
    }
    startTransition(async () => {
      try {
        await assertCanShareHousing();
        setOpen(true);
      } catch {
        router.push("/login");
      }
    });
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Share listing">
          <Share2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-2"
        style={{ width: `${dropdownWidthCh + 2}ch` }}
      >
        <div className="max-h-64 overflow-y-auto">
          {isLoading ? (
            <p className="px-2 py-1 text-sm text-muted-foreground">
              Loading conversations...
            </p>
          ) : targets.length === 0 ? (
            <p className="px-2 py-1 text-sm text-muted-foreground">
              No existing chats available.
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {targets.map((target) => (
                <Button
                  key={target.conversationId}
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  onClick={() => onShare(target)}
                  className="w-full justify-start text-left"
                >
                  {formatName(target.name)}
                </Button>
              ))}
            </div>
          )}
          {error ? (
            <p className="mt-2 px-2 py-1 text-sm text-destructive">{error}</p>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
