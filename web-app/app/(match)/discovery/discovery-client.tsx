"use client";

import { UndoButton } from "./_components/undo-button";
import { ProfileCard } from "./_components/profile-card";
import { Filter } from "./_components/filter";
import { useState } from "react";
import { DiscoveryProfile, ProfileFilter, RoommatePreference } from "./types";

export function DiscoveryClient({
  initialProfiles,
  profileFilters,
  roommatePreferences,
}: {
  initialProfiles: DiscoveryProfile[];
  profileFilters: ProfileFilter;
  roommatePreferences: RoommatePreference[];
}) {
  const [profiles, setProfiles] = useState<DiscoveryProfile[]>(initialProfiles);
  const [selectedProfile, setSelectedProfile] = useState<DiscoveryProfile>(
    profiles[0],
  );

  const handleNext = () => {
    const currentIndex = profiles.findIndex(
      (p) => p.user_id === selectedProfile.user_id,
    );
    if (currentIndex < profiles.length - 1) {
      setSelectedProfile(profiles[currentIndex + 1]);
    } else {
      setSelectedProfile(profiles[0]);
    }
  };

  const handleBefore = () => {
    const currentIndex = profiles.findIndex(
      (p) => p.user_id === selectedProfile.user_id,
    );
    if (currentIndex > 0) {
      setSelectedProfile(profiles[currentIndex - 1]);
    } else {
      setSelectedProfile(profiles[profiles.length - 1]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center mb-10">
      <Filter
        profileFilters={{
          use_major: profileFilters.use_major,
          use_year: profileFilters.use_year,
          use_gender: profileFilters.use_gender,
        }}
        roommatePreferences={roommatePreferences}
      ></Filter>
      <ProfileCard
        profile={selectedProfile}
        handleNext={handleNext}
        handleBefore={handleBefore}
      />
    </div>
  );
}
