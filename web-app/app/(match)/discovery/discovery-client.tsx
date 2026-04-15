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
  const [profiles, setProfiles] = useState<DiscoveryProfile[]>(initialProfiles);
  const [selectedProfile, setSelectedProfile] = useState<DiscoveryProfile>(
    profiles[0],
  );
  const [history, setHistory] = useState<DiscoveryProfile[]>([]);
  const [reachedEnd, setReachedEnd] = useState(false);

  const handleNext = () => {
    const currentIndex = profiles.findIndex(
      (p) => p.user_id === selectedProfile.user_id,
    );
    setHistory((h) => [...h, selectedProfile]);
    if (currentIndex < profiles.length - 1) {
      setSelectedProfile(profiles[currentIndex + 1]);
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
    <div className="flex min-h-0 flex-1 flex-col gap-12">
      <div className="flex shrink-0 justify-center px-4 pt-4">
        <Filter discoveryFilter={discoveryFilters} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center gap-6 px-4 pb-8">
        {profiles.length === 0 ? (
          <NoResultsReturned />
        ) : reachedEnd ? (
          <NoMoreResults handleBefore={handleBefore} profile={selectedProfile} />
        ) : (
          <ProfileCard
            profile={selectedProfile}
            handleNext={handleNext}
            handleBefore={handleBefore}
          />
        )}
        {history.length > 0 && (
          <UndoButton
            handleBefore={handleBefore}
            targetUserId={history[history.length - 1].user_id}
            isDiscovery={true}
            lastEntry={history[history.length - 1].fname}
          />
        )}
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
