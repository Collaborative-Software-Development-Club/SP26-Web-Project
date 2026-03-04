"use client";

import { UndoButton } from "./_components/undo-button";
import { ProfileCard } from "./_components/profile-card";
import { Filter } from "./_components/filter";
import { useState } from "react";
import { UserProfile } from "./types";
//mock data for now
import roommatePreference from "@/mock/roommate_preference.json";

export function DiscoveryClient({
  initialProfiles,
}: {
  initialProfiles: UserProfile[];
}) {
  const [profiles, setProfiles] = useState<UserProfile[]>(initialProfiles);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile>(
    initialProfiles[0],
  );

  // [dev-only] Sort for consistent dropdown experience
  const sortedProfiles = [...profiles].sort((a, b) =>
    a.fname.localeCompare(b.fname),
  );

  // [dev-only] State for demo selector
  const [selectedUserId, setSelectedUserId] = useState<string>(
    sortedProfiles[0]?.user_id || "1",
  );

  const handleProfileChange = (profileId: string) => {
    setSelectedProfile(
      profiles.find((p) => p.user_id === profileId) || initialProfiles[0],
    );
    setSelectedUserId(profileId);
  };

  const handleNext = () => {
    const currentIndex = profiles.findIndex(
      (p) => p.user_id === selectedUserId,
    );
    if (currentIndex < profiles.length - 1) {
      setSelectedProfile(profiles[currentIndex + 1]);
      setSelectedUserId(profiles[currentIndex + 1].user_id);
    } else {
      setSelectedProfile(initialProfiles[0]);
      setSelectedUserId(initialProfiles[0].user_id);
    }
  };

  const handleBefore = () => {
    const currentIndex = profiles.findIndex(
      (p) => p.user_id === selectedUserId,
    );
    if (currentIndex > 0) {
      setSelectedProfile(profiles[currentIndex - 1]);
      setSelectedUserId(profiles[currentIndex - 1].user_id);
    } else {
      setSelectedProfile(initialProfiles[initialProfiles.length - 1]);
      setSelectedUserId(initialProfiles[initialProfiles.length - 1].user_id);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center mb-10">
      <Filter preferences={roommatePreference}></Filter>
      <ProfileCard profile={selectedProfile} handleNext={handleNext} handleBefore={handleBefore} />
    </div>
  );
}
