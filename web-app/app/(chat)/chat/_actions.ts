"use server";

import { createClient } from "@/lib/supabase/server";

/* Example from match team
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

    const { error: matchError } = await supabase
      .from("discovery_matches")
      .upsert(
        { user_id: user.id, target_user_id: targetUserId },
        { onConflict: "user_id,target_user_id" },
      );

    if (matchError) {
      throw new Error(`Failed to record match: ${matchError.message}`);
    }

    return { matched: true };
  }

  return { matched: false };
}
*/

export async function sendChatMessage(
  conversationId: string,
  messagerUserId: string,
  message: string,
) {
  //Make sure message isnt null, create a messageId and a timestamp to send as well
}

export async function getConversationMessages(conversationId: string) {}

export async function getConversations(userId: string) {}

export async function createConversation(
  creatingUserId: string,
  otherMemberUserIds: string[],
) {}
