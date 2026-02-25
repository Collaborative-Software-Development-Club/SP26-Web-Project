"use client";

import { UndoButton } from "./_components/undo-button";
import { ProfileCard } from "./_components/profile-card";
import { useState } from "react";

type Preference = [string, string];

export interface UserProfile {
  user_id: string;
  is_active: boolean;
  fname: string;
  lname: string;
  gender: string;
  avatar_url: string;
  bio: string;
  major: string;
  year: number;
  created_at: string;
  last_edited_at: string;
  hobbies: string[];
  preferences: Preference[];
}

export function DiscoveryPage({
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
    <div className="flex flex-col items-center justify-center mb-10">
      {/* [dev-only] Developer Debug Bar */}
      {process.env.NODE_ENV !== "production" && (
        <div className="w-full max-w-4xl mb-6 p-4 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
          <span className="text-sm font-medium text-zinc-500">
            Developer Preview Mode
          </span>
          <select
            className="bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            value={selectedUserId}
            onChange={(e) => handleProfileChange(e.target.value)}
          >
            {sortedProfiles.map((p) => (
              <option key={p.user_id} value={p.user_id}>
                {p.fname} {p.lname} ({p.major})
              </option>
            ))}
          </select>
        </div>
      )}
      <ProfileCard profile={selectedProfile} handleNext={handleNext} />
      <UndoButton
        handleBefore={handleBefore}
        isDiscovery={true}
        targetUserId={selectedProfile.user_id}
      />
    </div>
  );
}
