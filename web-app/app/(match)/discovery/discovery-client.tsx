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

  const [reachedEnd, setReachedEnd] = useState(false);

  const handleNext = () => {
    const currentIndex = profiles.findIndex(
      (p) => p.user_id === selectedProfile.user_id,
    );
    if (currentIndex < profiles.length - 1) {
      setSelectedProfile(profiles[currentIndex + 1]);
    } else {
      setReachedEnd(true);
    }
  };

  const handleBefore = () => {
    const currentIndex = profiles.findIndex(
      (p) => p.user_id === selectedProfile.user_id,
    );
    if (!reachedEnd) {
      if (currentIndex > 0) {
        setSelectedProfile(profiles[currentIndex - 1]);
      } else {
        setSelectedProfile(profiles[profiles.length - 1]);
      }
    } else {
      setReachedEnd(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mb-10">
      <Filter discoveryFilter={discoveryFilters}></Filter>
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
    </div>
  );
}

const NoResultsReturned = () => {
  return (
    <div className="w-full bg-zinc-50 dark:bg-black p-4 md:p-8 font-sans flex flex-col items-center">
      <div className="w-3/4 max-w-4xl  overflow-hidden relative md:h-[560px] flex flex-col center-items text-center">
        <span className="text-5xl">✦</span>
        <h2 className="px-16 pt-16 text-xl font-semibold text-zinc-800 dark:text-zinc-200">
          Oops! We couldn&apos;t find any matches...
        </h2>
        <p className="px-12 pt-8 text-zinc-400 dark:text-zinc-100">
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
    <div className="w-full bg-zinc-50 dark:bg-black p-4 md:p-8 font-sans flex flex-col items-center">
      <div className="w-3/4 max-w-4xl  overflow-hidden relative md:h-[560px] flex flex-col center-items text-center">
        <span className="text-5xl">✦</span>
        <h2 className="px-16 pt-16 text-xl font-semibold text-zinc-800 dark:text-zinc-200">
          You're all caught up!
        </h2>
        <p className="px-12 pt-8 text-zinc-400 dark:text-zinc-100">
          Try adjusting your filters to discover more matches!
        </p>
        <div className="p-[1rem] mt-auto flex flex-col items-center">
          <UndoButton
            handleBefore={handleBefore}
            isDiscovery={true}
            targetUserId={profile.user_id}
          />
        </div>
      </div>
    </div>
  );
}
