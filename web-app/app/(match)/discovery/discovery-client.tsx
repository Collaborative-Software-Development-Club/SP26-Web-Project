"use client";

import { ProfileCard } from "./_components/profile-card";
import { Filter } from "./_components/filter";
import { useLayoutEffect, useRef, useState, useTransition } from "react";
import { DiscoveryFilter, DiscoveryProfile } from "./types";
import { UndoButton } from "./_components/undo-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListPlus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { revalidateDiscoveryPath } from "./_actions";

export function DiscoveryClient({
  initialProfiles,
  discoveryFilters,
}: {
  initialProfiles: DiscoveryProfile[];
  discoveryFilters: DiscoveryFilter;
}) {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState<
    DiscoveryProfile | undefined
  >(initialProfiles[0]);
  const [history, setHistory] = useState<DiscoveryProfile[]>([]);
  const historyRef = useRef(history);
  useLayoutEffect(() => {
    historyRef.current = history;
  }, [history]);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [fromUndo, setFromUndo] = useState(false);
  const [exitFromUndo, setExitFromUndo] = useState(false);

  const handleNext = () => {
    if (!selectedProfile) return;
    setFromUndo(false);
    setExitFromUndo(false);
    const currentIndex = initialProfiles.findIndex(
      (p) => p.user_id === selectedProfile.user_id,
    );
    setHistory((h) => [...h, selectedProfile]);
    if (currentIndex < initialProfiles.length - 1) {
      setSelectedProfile(initialProfiles[currentIndex + 1]);
    } else {
      setReachedEnd(true);
    }
  };

  const handleBefore = () => {
    if (reachedEnd) {
      setReachedEnd(false);
      setHistory((h) => h.slice(0, -1));
      return;
    }
    if (history.length === 0) return;
    setExitFromUndo(true);
    requestAnimationFrame(() => {
      const h = historyRef.current;
      if (h.length === 0) return;
      const prev = h[h.length - 1];
      setSelectedProfile(prev);
      setHistory((prevH) => prevH.slice(0, -1));
      setFromUndo(true);
      setExitFromUndo(false);
    });
  };

  const [loadMorePending, startLoadMore] = useTransition();

  const handleLoadMore = () => {
    startLoadMore(async () => {
      await revalidateDiscoveryPath();
      router.refresh();
    });
  };

  const canLoadMore = initialProfiles.length === 30 && reachedEnd;

  return (
    <div className="flex flex-col items-center w-full px-4">
      {/* Mobile: filter absolute position by navbar */}
      <div className="md:hidden absolute right-6 top-22 z-30">
        <div className="w-[220px]">
          <Filter discoveryFilter={discoveryFilters} />
        </div>
      </div>
      {/* Big Screen Header */}
      <div className="hidden md:block w-full max-w-4xl mb-4 relative">
        <div className="absolute right-0 top-0">
          <Filter discoveryFilter={discoveryFilters} />
        </div>

        {/* Title */}
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground xl:text-3xl md:text-2xl">
            Discovery
          </h1>
          <p className="text-muted-foreground xl:text-sm md:text-xs">
            Find potential roommates based on your preferences
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        {initialProfiles.length === 0 ? (
          <NoResultsReturned />
        ) : reachedEnd ? (
          selectedProfile ? (
            <NoMoreResults
              canLoadMore={canLoadMore}
              handleLoadMore={handleLoadMore}
              loadMorePending={loadMorePending}
            />
          ) : null
        ) : selectedProfile ? (
          <ProfileCard
            profile={selectedProfile}
            isDiscovery={true}
            handleNext={handleNext}
            isFromUndo={fromUndo}
            exitFromUndo={exitFromUndo}
            onFromUndoConsumed={() => setFromUndo(false)}
          />
        ) : null}
        <div className="w-full max-w-4xl grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 pt-4">
          <div />
          <div className="justify-self-center">
            {history.length > 0 && (
              <UndoButton
                handleBefore={handleBefore}
                targetUserId={history[history.length - 1].user_id}
                lastEntry={history[history.length - 1].fname}
              />
            )}
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}

const NoResultsReturned = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-3/4 max-w-4xl  overflow-hidden relative md:h-[560px] flex flex-col center-items text-center">
        <span className="text-5xl p-10">✦</span>
        <h2 className="px-16 text-xl font-semibold text-foreground">
          Oops! We couldn&apos;t find any matches...
        </h2>
        <p className="px-12 pt-8 text-muted-foreground">
          Try adjusting your filters to discover more matches!
        </p>
      </div>
    </div>
  );
};

function NoMoreResults({
  canLoadMore,
  handleLoadMore,
  loadMorePending,
}: {
  canLoadMore: boolean;
  handleLoadMore: () => void;
  loadMorePending: boolean;
}) {
  return (
    <>
      {canLoadMore ? (
        <div className="flex w-full flex-col items-center">
          <div className="center-items relative flex min-h-[400px] w-3/4 max-w-4xl flex-col overflow-hidden text-center">
            <span className="p-10 text-5xl">✦</span>
            <h2 className="px-8 text-xl font-semibold text-zinc-800 sm:px-16 dark:text-zinc-200">
              You&apos;ve reached the end of the list!
            </h2>
            <p className="px-6 pt-4 text-sm text-zinc-500 sm:px-12 sm:pt-8 dark:text-zinc-400">
              Load the next set of people we think you may like.
            </p>
            <div className="mt-8 flex justify-center px-4">
              <Button
                type="button"
                size="lg"
                onClick={handleLoadMore}
                disabled={loadMorePending}
                className={cn(
                  "h-12 min-w-[200px] gap-2.5 rounded-full px-8 text-base font-semibold shadow-md",
                  "hover:shadow-lg active:scale-[0.98]",
                )}
              >
                {loadMorePending ? (
                  <Loader2
                    className="size-5 shrink-0 animate-spin"
                    aria-hidden
                  />
                ) : (
                  <ListPlus className="size-5 shrink-0" aria-hidden />
                )}
                {loadMorePending ? "Loading…" : "Load more matches"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full dark:bg-black p-4 md:p-8 font-sans flex flex-col items-center">
          <div className="w-3/4 max-w-4xl  overflow-hidden relative md:h-[400px] flex flex-col center-items text-center">
            <span className="text-5xl p-10">✦</span>
            <h2 className="px-16 text-xl font-semibold text-zinc-800 dark:text-zinc-200">
              You&apos;re all caught up!
            </h2>
            <p className="px-12 pt-8 text-zinc-400 dark:text-zinc-100">
              Try adjusting your filters to discover more matches!
            </p>
          </div>
        </div>
      )}
    </>
  );
}
