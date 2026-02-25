import { requireAuth } from "@/lib/auth";
import { MatchClient } from "./match-client";
import profiles from "@/mock/profiles.json";
import { UserProfile } from "./discovery-page";

export default async function MatchPage() {
  const user = await requireAuth();

  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <MatchClient
        initialDiscoveryProfiles={profiles as UserProfile[]}
        initialLikedProfiles={profiles as UserProfile[]}
      />
    </div>
  );
}
