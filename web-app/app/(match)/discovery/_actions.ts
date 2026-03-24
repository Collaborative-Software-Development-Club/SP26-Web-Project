"use server";

import { createClient } from "@/lib/supabase/server";
import type { LikedYouProfile, DiscoveryProfile, DiscoveryFilter } from "./types";
import type { UserProfile } from "@/app/(profile)/types";
import { getUserProfiles } from "@/lib/services/profile";

export async function getLikedYouProfiles(): Promise<LikedYouProfile[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }
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

  const likedProfiles = await getUserProfiles(likedSwipes.map((swipe) => swipe.user_id));

  return likedProfiles.map((profile: UserProfile) => ({
    ...profile,
    message: userIdToMessageMap.get(profile.user_id) ?? "",
  }));
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

// 'Liked' feed swipe action
export async function saveMatchSwipe(
  targetUserId: string,
  action: "dislike" | "like",
  message: string | null = null,
): Promise<{ matched: boolean }> {
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
    throw new Error(`Failed to record match swipe: ${swipeError.message}`);
  }

  if (action === "like") {
    const { data: correspondingSwipe, error: correspondingSwipeError } =
      await supabase
        .from("discovery_swipes")
        .select()
        .eq("user_id", targetUserId)
        .eq("target_user_id", user.id);

    if (correspondingSwipeError) {
      throw new Error(
        `Failed to fetch corresponding swipe: ${correspondingSwipeError?.message}`,
      );
    }

    if (
      correspondingSwipe.length === 0 ||
      correspondingSwipe[0].action === "dislike"
    ) {
      console.log(
        `No corresponding 'like' swipe sent by target user: ${targetUserId}`,
      );
      return { matched: false };
    }

    const [user1_id, user2_id] =
      user.id < targetUserId
        ? [user.id, targetUserId]
        : [targetUserId, user.id];
    const { error: matchError } = await supabase
      .from("discovery_matches")
      .upsert({ user1_id, user2_id }, { onConflict: "user_id,user2_id" });

    if (matchError) {
      throw new Error(`Failed to record match: ${matchError.message}`);
    }

    return { matched: true };
  }

  return { matched: false };
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
  const {data: {user}} = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Unauthorized");
  }
  const { data, error } = await supabase.rpc("get_discovery_filter", {
    user_id: user.id,
  }).select("*");

  if (error) {
    throw new Error(`Error fetching discovery filter: ${error.message}`);
  }
  return {...data,
    hobby_filters: new Set(data.hobby_filters),
  };
}

export async function saveDiscoveryFilter(
  filters: DiscoveryFilter,
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || user === null) {
    throw new Error(`Error fetching current user: ${userError?.message}`);
  }

  const { error: saveError } = await supabase
    .rpc("save_discovery_filter", {
      user_id: user.id,
      roommate_preferences: filters.roommate_preferences,
      profile_filters: filters.profile_filters,
      hobby_filters: filters.hobby_filters,
    });

  if (saveError) {
    throw new Error(
      `Failed to save discovery filter: ${saveError.message}`,
    );
  }
}
    
  
  /* 
    This action gets the profiles with the calculated match score for potential matches. 
    It calls the get_ranked_matches function in the database.

    Here is how the get_ranked_matches function works:
    1. It gets the user's profile, profile filters, roommate preferences, and hobby filters
    2. It filters the candidates based on the profile filters, hobby filters, dealbreaker roommate preferences, and if user already swiped on them
    3. It computes the match score for each candidate by doing Sum(importance * (1 - |user_preference - candidate_preference| / ))
    4. It returns the candidates sorted by the match score in descending order
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

    const { data, error } = await supabase.rpc("get_ranked_matches", {
      current_user_id: user.id,
    }).select("*");

    if (error) {
      throw new Error(`Error fetching discovery profiles: ${error.message}`);
    }

    return data;
  }
  
  