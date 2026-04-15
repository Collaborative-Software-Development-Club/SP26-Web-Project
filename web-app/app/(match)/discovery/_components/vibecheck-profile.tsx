"use client";

import { LikedYouProfile } from "../types";
import {ProfileCard} from "./profile-card";

export function VibeCheckProfile({
  profile,
  onAccept,
  onPass,
}: {
  profile: LikedYouProfile;
  onAccept: (userId: string) => void;
  onPass: (userId: string) => void;
}) {
  if (!profile) return <div>Loading...</div>;

  return (
    <ProfileCard
      profile={profile}
      isDiscovery={false}
      onAccept={onAccept}
      onPass={onPass}
    />
  );
}
