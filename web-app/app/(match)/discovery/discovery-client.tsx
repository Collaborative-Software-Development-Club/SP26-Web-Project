"use client";

import { ProfileCard } from "./_components/profile-card";
import { Filter } from "./_components/filter";
import { useState } from "react";
import { DiscoveryFilter, DiscoveryProfile } from "./types";
import { UndoButton } from "./_components/undo-button";

export function DiscoveryClient({
  initialProfiles,
  discoveryFilters,
}: {
  initialProfiles: DiscoveryProfile[];
  discoveryFilters: DiscoveryFilter;
}) {
  const [selectedProfile, setSelectedProfile] = useState<
    DiscoveryProfile | undefined
  >(initialProfiles[0]);
  const [history, setHistory] = useState<DiscoveryProfile[]>([]);
  const [reachedEnd, setReachedEnd] = useState(false);

  const handleNext = () => {
    if (!selectedProfile) return;
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
    const prev = history[history.length - 1];
    setSelectedProfile(prev);
    setHistory((h) => h.slice(0, -1));
  };

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
              handleBefore={handleBefore}
              profile={selectedProfile}
            />
          ) : null
        ) : selectedProfile ? (
          <ProfileCard
            profile={selectedProfile}
            isDiscovery={true}
            handleNext={handleNext}
            handleBefore={handleBefore}
          />
        ) : null}
        <div className="w-full max-w-4xl items-start grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 pt-4">
          <div />
          <div className="justify-self-center">
            {history.length > 0 && (
              <UndoButton
                handleBefore={handleBefore}
                targetUserId={history[history.length - 1].user_id}
                isDiscovery={true}
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
        <span className="text-5xl">✦</span>
        <h2 className="px-16 pt-16 text-xl font-semibold text-foreground">
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
  handleBefore,
  profile,
}: {
  handleBefore: () => void;
  profile: DiscoveryProfile;
}) {
  return (
    <div className="w-full dark:bg-black p-4 md:p-8 font-sans flex flex-col items-center">
      <div className="w-3/4 max-w-4xl  overflow-hidden relative md:h-[400px] flex flex-col center-items text-center">
        <span className="text-5xl">✦</span>
        <h2 className="px-16 pt-16 text-xl font-semibold text-zinc-800 dark:text-zinc-200">
          You&apos;re all caught up!
        </h2>
        <p className="px-12 pt-8 text-zinc-400 dark:text-zinc-100">
          Try adjusting your filters to discover more matches!
        </p>
      </div>
    </div>
  );
}
