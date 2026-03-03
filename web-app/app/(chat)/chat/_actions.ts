"use server";

import { createClient } from "@/lib/supabase/server";
import * as chatService from "@/lib/services/chat";
import { ChatMessage, ConversationPreview } from "../types";

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

export async function sendChatMessage(conversationId: string, message: string) {
  const trimmed = message?.trim();
  if (!trimmed) {
    throw new Error("Message cannot be empty");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase.from("chat_messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content: trimmed,
  });

  if (error) {
    throw new Error(`Failed to send message: ${error.message}`);
  }

  await supabase
    .from("chat_conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("conversation_id", conversationId);
}

export async function getConversationMessages(
  conversationId: string,
): Promise<ChatMessage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chat_messages")
    .select("message_id, content, sender_id, created_at, conversation_id")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }

  return data ?? [];
}

export async function getConversations(userId: string) {
  return chatService.getConversations(userId);
}

function formatTimestamp(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / 604800000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return `${weeks}w`;
}

export async function getConversationsForDisplay(
  userId: string,
): Promise<ConversationPreview[]> {
  const supabase = await createClient();
  const conversations = await chatService.getConversations(userId);

  const previews: ConversationPreview[] = [];

  for (const conv of conversations) {
    let name = "Unknown";
    if (conv.other_member_ids.length > 0) {
      try {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, fname, lname")
          .in("user_id", conv.other_member_ids);

        if (profiles && profiles.length > 0) {
          name =
            profiles
              .map(
                (p) => `${p.fname ?? ""} ${p.lname ?? ""}`.trim() || "Unknown",
              )
              .filter(Boolean)
              .join(", ") || "Unknown";
        } else {
          name =
            conv.other_member_ids.length === 1
              ? "User"
              : `${conv.other_member_ids.length} users`;
        }
      } catch {
        name =
          conv.other_member_ids.length === 1
            ? "User"
            : `${conv.other_member_ids.length} users`;
      }
    }

    previews.push({
      id: conv.id,
      name,
      lastMessage: conv.last_message ?? "No messages yet",
      timestamp: conv.last_message_at
        ? formatTimestamp(conv.last_message_at)
        : "now",
      unread: false,
    });
  }

  return previews;
}

export async function createConversation(
  leaderUserId: string,
  memberUserIds: string[],
): Promise<{ conversation_id: string }> {
  const supabase = await createClient();

  const isGroup = memberUserIds.length > 1;
  const { data: conversation, error: convError } = await supabase
    .from("chat_conversations")
    .insert({ is_group: isGroup })
    .select("conversation_id")
    .single();

  if (convError) {
    throw new Error(`Failed to create conversation: ${convError.message}`);
  }

  const allUserIds = [leaderUserId, ...memberUserIds];
  const uniqueUserIds = [...new Set(allUserIds)];
  const now = new Date().toISOString();

  const { error: membersError } = await supabase
    .from("chat_conversation_members")
    .insert(
      uniqueUserIds.map((user_id) => ({
        conversation_id: conversation.conversation_id,
        user_id,
        role: "member",
        joined_at: now,
      })),
    );

  if (membersError) {
    throw new Error(
      `Failed to add conversation members: ${membersError.message}`,
    );
  }

  return { conversation_id: conversation.conversation_id };
}

export async function createConversationWithCurrentUser(
  memberUserIds: string[],
): Promise<{ conversation_id: string }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  return createConversation(user.id, memberUserIds);
}

export async function getMatchedUserIds(): Promise<
  { user_id: string; display_name?: string }[]
> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: asUser1 } = await supabase
    .from("discovery_matches")
    .select("user2_id")
    .eq("user1_id", user.id);

  const { data: asUser2 } = await supabase
    .from("discovery_matches")
    .select("user1_id")
    .eq("user2_id", user.id);

  const matchedIds = new Set<string>();
  (asUser1 ?? []).forEach((r) => matchedIds.add(r.user2_id));
  (asUser2 ?? []).forEach((r) => matchedIds.add(r.user1_id));

  const result: { user_id: string; display_name?: string }[] = [];
  for (const uid of matchedIds) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("fname, lname")
      .eq("user_id", uid)
      .single();

    const displayName =
      profile && (profile.fname || profile.lname)
        ? `${profile.fname ?? ""} ${profile.lname ?? ""}`.trim()
        : undefined;

    result.push({ user_id: uid, display_name: displayName });
  }

  return result;
}
