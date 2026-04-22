"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  LikedYouProfile,
  DiscoveryProfile,
  DiscoveryFilter,
} from "./types";
import { revalidatePath } from "next/cache";

export async function getLikedYouProfiles(): Promise<LikedYouProfile[]> {
  const supabase = await createClient();

  const { data: likedSwipes, error: likedSwipesError } = await supabase
    .rpc("get_liked_you_profiles", {})
    .select("*");

  if (likedSwipesError) {
    throw new Error(
      `Error fetching liked you profiles: ${likedSwipesError.message}`,
    );
  }

  return likedSwipes;
}

// General feed swipe action
export async function saveSwipe(
  targetUserId: string,
  action: "dislike" | "like",
  message: string | null = null,
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || user === null) {
    throw new Error(`Error fetching current user: ${userError?.message}`);
  }

  const { error: swipeError } = await supabase.from("discovery_swipes").upsert(
    {
      user_id: user.id,
      target_user_id: targetUserId,
      action: action,
      message: message,
    },
    { onConflict: "user_id,target_user_id" },
  );

  if (swipeError) {
    throw new Error(`Failed to record swipe: ${swipeError.message}`);
  }
}

// General feed undo swipe action
export async function undoSwipe(targetUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || user === null) {
    throw new Error(`Error fetching current user: ${userError?.message}`);
  }

  const { error: undoError } = await supabase
    .from("discovery_swipes")
    .delete()
    .eq("user_id", user.id)
    .eq("target_user_id", targetUserId);

  if (undoError) {
    throw new Error(`Failed to undo swipe: ${undoError.message}`);
  }
}

// 'Liked' feed undo swipe action
export async function undoMatchSwipe(targetUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || user === null) {
    throw new Error(`Error fetching current user: ${userError?.message}`);
  }

  const { error: undoSwipeError } = await supabase
    .from("discovery_swipes")
    .delete()
    .eq("user_id", user.id)
    .eq("target_user_id", targetUserId);

  if (undoSwipeError) {
    throw new Error(`Failed to undo match swipe: ${undoSwipeError.message}`);
  }

  const [user1_id, user2_id] =
    user.id < targetUserId ? [user.id, targetUserId] : [targetUserId, user.id];
  const { error: undoMatchError } = await supabase
    .from("discovery_matches")
    .delete()
    .eq("user1_id", user1_id)
    .eq("user2_id", user2_id);

  if (undoMatchError) {
    throw new Error(`Failed to undo match: ${undoMatchError.message}`);
  }
}

// Gets user's profile filters, roommate preferences, and hobby filters aggregated to one json object
export async function getDiscoveryFilter(): Promise<DiscoveryFilter> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }
  const { data, error } = await supabase
    .rpc("get_discovery_filter", {
      p_user_id: user.id,
    })
    .select("*");

  if (error) {
    throw new Error(`Error fetching discovery filter: ${error.message}`);
  }
  return data;
}

export async function saveDiscoveryFilter(filters: DiscoveryFilter) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || user === null) {
    throw new Error(`Error fetching current user: ${userError?.message}`);
  }

  const { error: saveError } = await supabase.rpc("save_discovery_filter", {
    p_user_id: user.id,
    roommate_preferences: filters.roommate_preferences,
    profile_filters: filters.profile_filters,
    hobby_filters: filters.hobby_filters,
  });

  if (saveError) {
    throw new Error(`Failed to save discovery filter: ${saveError.message}`);
  }

  revalidatePath("/discovery");
  return true;
}

/*
  getDiscoveryProfiles calls get_ranked_matches in the database:
  1. User profile, filters, roommate prefs, hobby filters
  2. Filter candidates (profile/hobby prefs, dealbreakers, already swiped)
  3. Match score: sum of importance * (1 - |delta| / range)
  4. Return candidates sorted by score descending
*/
export async function getDiscoveryProfiles(): Promise<DiscoveryProfile[]> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || user === null) {
    throw new Error(`Error fetching current user: ${userError?.message}`);
  }

  const { data, error } = await supabase
    .rpc("get_ranked_matches", {
      current_user_id: user.id,
    })
    .select("*");

  if (error) {
    throw new Error(`Error fetching discovery profiles: ${error.message}`);
  }

  return data;
}

export async function revalidateDiscoveryPath() {
  revalidatePath("/discovery");
}
