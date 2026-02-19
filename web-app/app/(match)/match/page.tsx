import { requireAuth } from "@/lib/auth";
import { MatchClient } from "./match-client";
import profiles from "@/mock/profiles.json";
import { UserProfile } from "./discovery-page";
import { createClient } from "@/lib/supabase/server";

export default async function MatchPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: likedSwipes, error: likedSwipesError } = await supabase
    .from("discovery_swipes")
    .select("user_id, created_at, message")
    .eq("target_user_id", user.id)
    .eq("action", "like")
    .order("created_at", { ascending: false });

  // Create a custom error page (error.tsx) under /match if this fails
  if (likedSwipesError) {
    throw new Error(
      `Failed to fetch liked profiles: ${likedSwipesError.message}`,
    );
  }

  const userIdToMessageMap: Map<string, string> = new Map(
    likedSwipes.map((swipe) => [swipe.user_id, swipe.message]),
  );

  const likedUserIds = likedSwipes.map((swipe) => swipe.user_id);
  // const likedProfiles = profileService.getProfiles(likedUserIds);

  console.log(likedSwipes);
  console.log(userIdToMessageMap);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <MatchClient
        initialDiscoveryProfiles={profiles as UserProfile[]}
        initialLikedProfiles={profiles as UserProfile[]}
      />
    </div>
  );
}
