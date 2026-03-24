"use server";

import { createClient } from "@/lib/supabase/server";
import { LikedYouProfile, RoommatePreference, DiscoveryProfile, HistoryProfile } from "./types";
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
    console.error(`Failed to record swipe: ${swipeError.message}`);
    // We don't throw here so the UI doesn't crash on mock data testing.
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
    console.error(`Failed to record match swipe: ${swipeError.message}`);
    // We don't throw here so the UI doesn't crash on mock data testing.
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

// Gets users preference table
export async function getUserRoommatePreferences(user_id: string): Promise<RoommatePreference[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("discovery_roommate_preferences")
    .select("preference_id, importance, user_preferences(name)")
    .eq("user_id", user_id);

  if (error) {
    throw new Error(`Error fetching user roommate preferences: ${error.message}`);
  } else {
    return data.map((item) => ({
      preference_id: item.preference_id,
      importance: item.importance,
      name: item.user_preferences[0]?.name,
    }));
  }
}

export async function saveUserRoommatePreferences(
  preferences: RoommatePreference[],
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
    .from("discovery_roommate_preferences")
    .upsert(
      preferences.map((preference) => ({
        user_id: user.id,
        preference_id: preference.preference_id,
        importance: preference.importance,
      })),
      { onConflict: "user_id,preference_id" },
    );

  if (saveError) {
    throw new Error(
      `Failed to save user roommate preferences: ${saveError.message}`,
    );
  }
}
    
  
  /* 
    Function gets all active user profiles and then takes a user_id to return a sorted list of match score objects
    Matches a user with all active users in the database based on the distance in preferences
    If we do not have preferences or importance assigned the score will default to 0    
  */
  export async function getDiscoveryProfiles(preference_ids: string[]): Promise<DiscoveryProfile[]> {
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
      preference_ids,
    }).select("*");

    if (error) {
      throw new Error(`Error fetching discovery profiles: ${error.message}`);
    }

    return data;
  }
  
  
export async function getUserSwipeHistory(): Promise<HistoryProfile[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: swipes, error: swipesError } = await supabase
    .from("discovery_swipes")
    .select("target_user_id, action, message, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (swipesError) {
    throw new Error(`Failed to fetch history: ${swipesError.message}`);
  }

  const { data: matches, error: matchesError } = await supabase
    .from("discovery_matches")
    .select("user1_id, user2_id")
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

  if (matchesError) {
    throw new Error(`Failed to fetch matches: ${matchesError.message}`);
  }

  const matchSet = new Set(
    matches.map((m) => (m.user1_id === user.id ? m.user2_id : m.user1_id))
  );

  const targetUserIds = swipes.map((swipe) => swipe.target_user_id);
  const userProfiles = await getUserProfiles(targetUserIds);
  
  const profileMap = new Map(userProfiles.map(p => [p.user_id, p]));

  // Ensure returning profiles even if user is missing, though they shouldn't be
  return swipes
    .filter(swipe => profileMap.has(swipe.target_user_id))
    .map(swipe => {
      const profile = profileMap.get(swipe.target_user_id)!;
      return {
        ...profile,
        action: swipe.action,
        message: swipe.message ?? "",
        created_at: swipe.created_at,
        matched: matchSet.has(swipe.target_user_id),
      };
    });
}
