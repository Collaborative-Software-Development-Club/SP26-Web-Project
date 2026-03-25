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

  const { data: incomingSwipes, error: incomingSwipesError } = await supabase
    .from("discovery_swipes")
    .select("user_id, action, message, created_at")
    .eq("target_user_id", user.id)
    .eq("action", "like")
    .order("created_at", { ascending: false });

  if (incomingSwipesError) {
    throw new Error(`Failed to fetch incoming history: ${incomingSwipesError.message}`);
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
  const incomingUserIds = incomingSwipes.map((swipe) => swipe.user_id);
  const allUserIds = Array.from(new Set([...targetUserIds, ...incomingUserIds]));
  
  const userProfiles = await getUserProfiles(allUserIds);
  const profileMap = new Map(userProfiles.map(p => [p.user_id, p]));

  const outboundHistory: HistoryProfile[] = swipes
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

  const inboundHistory: HistoryProfile[] = incomingSwipes
    .filter(swipe => profileMap.has(swipe.user_id))
    .map(swipe => {
      const profile = profileMap.get(swipe.user_id)!;
      const isMatched = matchSet.has(swipe.user_id);
      return {
        ...profile,
        action: isMatched ? "matched" : "liked_you",
        message: swipe.message ?? "",
        created_at: swipe.created_at,
        matched: isMatched,
      };
    });

  // [production-ready] Logic for grouping history and handling two colored labels
  const allHistory = [...outboundHistory, ...inboundHistory];
  
  // Group by user_id to correctly show multiple states like "liked you" and "passed", or "liked you" and "match"
  const userActionMap = new Map<string, HistoryProfile>();
  
  for (const item of allHistory) {
    const existing = userActionMap.get(item.user_id);
    if (!existing) {
      userActionMap.set(item.user_id, { ...item });
    } else {
      // Merge multiple actions into a comma-separated string to decode on the client
      const currentActions = existing.action ? existing.action.split(",") : [];
      const newActions = item.action ? item.action.split(",") : [];
      const actions = new Set([...currentActions, ...newActions]);
      
      existing.action = Array.from(actions).filter(Boolean).join(",");
      
      if (new Date(item.created_at) > new Date(existing.created_at)) {
        existing.created_at = item.created_at;
      }
      
      existing.matched = existing.matched || item.matched;
    }
  }
  
  return Array.from(userActionMap.values())
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function clearSwipeHistory() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Delete all swipes where user is the swiper or the target
  const { error: error1 } = await supabase
    .from("discovery_swipes")
    .delete()
    .eq("user_id", user.id);

  const { error: error2 } = await supabase
    .from("discovery_swipes")
    .delete()
    .eq("target_user_id", user.id);

  // Also delete matches
  const { error: error3 } = await supabase
    .from("discovery_matches")
    .delete()
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

  if (error1 || error2 || error3) {
    console.error("Error clearing history:", error1 || error2 || error3);
    return { success: false, error: "Failed to clear history" };
  }

  // Also delete interactions
  const { error: error4 } = await supabase
    .from("discovery_profile_interactions")
    .delete()
    .eq("user_id", user.id);

  if (error4) {
    console.error("Error clearing interactions:", error4);
  }

  return { success: true };
}
