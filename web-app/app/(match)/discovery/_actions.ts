"use server";

import { createClient } from "@/lib/supabase/server";
import { UserProfile, LikedYouProfile } from "./types";

export async function getLikedYouProfiles() {
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

  // const likedProfiles = await profileService.getProfiles(likedSwipes.map((swipe) => swipe.user_id);

//   const likedYouProfiles: LikedYouProfile[] = likedProfiles.map((profile) => ({
//     ...profile,
//     message: userIdToMessageMap.get(profile.user_id) ?? "",
//   }));

  return userIdToMessageMap;
  //return likedYouProfiles;
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

// Gets users preference table
export async function getUserRoommatePreferences(user_id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("discovery_roommate_preferences")
    .select("preference_id, importance")
    .eq("user_id", user_id);

  if (error) {
    throw new Error(`Error fetching user roommate preferences: ${error.message}`);
  } else {
    const preferenceIds = data.map((item) => ({
      preference_id: item.preference_id,
      importance: item.importance,
    }));
    return preferenceIds;
  }
}
