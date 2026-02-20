"use client";

import { DiscoveryPage } from "./discovery-page";
import { UserProfile } from "./discovery-page";
import { useState } from "react";
import { VibesWithYouPage} from "./liked-page";

export function MatchClient({
  initialDiscoveryProfiles,
  initialLikedProfiles,
}: {
  initialDiscoveryProfiles: UserProfile[];
  initialLikedProfiles: UserProfile[];
}) {
  const [isDiscovery, setIsDiscovery] = useState(true);

  return (
    <div className="flex flex-col items-center min-h-screen w-full">
      <div className="flex flex-col items-center justify-center w-3/4 my-4 max-w-sm ">
        <div className="flex flex-row justify-center gap-3">
          <button
            onClick={() => setIsDiscovery(true)}
            className={`${isDiscovery ? "text-black" : "text-gray-400"} hover:underline`}
          >
            Discovery
          </button>
          <p className="text-gray-500">|</p>
          <button
            onClick={() => setIsDiscovery(false)}
            className={`${!isDiscovery ? "text-black" : "text-gray-400"} hover:underline`}
          >
            Vibes With You
          </button>
        </div>
        <hr className="max-w-md w-full" />
      </div>
      {isDiscovery ? (
        <DiscoveryPage initialProfiles={initialDiscoveryProfiles} />
      ) : (
        <VibesWithYouPage initialVibes={initialLikedProfiles.map(p => ({ profile: p, message: "I vibe with you! What housing options on campus are you interested in?" }))} />
      )}
    </div>
  );
}
