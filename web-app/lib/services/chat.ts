import { createClient } from "@/lib/supabase/server";

export type ChatConversation = {
  id: string;
  created_at: string;
  last_message?: string;
  last_message_at?: string;
  other_member_ids: string[];
};

/**
 * Creates a conversation between two users and optionally sends initial messages.
 * Whichever of user1_message and user2_message is not null gets sent.
 * If both are null, no messages are sent but the conversation is still created.
 * If neither are null, user1's message is sent first.
 */
export async function createConversation(
  user1_id: string,
  user2_id: string,
  user1_message: string | null,
  user2_message: string | null,
): Promise<{ conversation_id: string }> {
  const supabase = await createClient();

  const { data: conversation, error: convError } = await supabase
    .from("chat_conversations")
    .insert({ is_group: false })
    .select("conversation_id")
    .single();

  if (convError) {
    throw new Error(`Failed to create conversation: ${convError.message}`);
  }

  const conversationId = conversation.conversation_id;

  const memberIds = [user1_id, user2_id];
  const now = new Date().toISOString();
  const { error: membersError } = await supabase
    .from("chat_conversation_members")
    .insert(
      memberIds.map((user_id) => ({
        conversation_id: conversationId,
        user_id,
        role: "member",
        joined_at: now,
      })),
    );

  if (membersError) {
    throw new Error(`Failed to add conversation members: ${membersError.message}`);
  }

  const messagesToSend: { sender_id: string; content: string }[] = [];
  if (user1_message !== null) {
    messagesToSend.push({ sender_id: user1_id, content: user1_message });
  }
  if (user2_message !== null) {
    messagesToSend.push({ sender_id: user2_id, content: user2_message });
  }

  if (messagesToSend.length > 0) {
    const { error: messagesError } = await supabase
      .from("chat_messages")
      .insert(
        messagesToSend.map((m) => ({
          conversation_id: conversationId,
          sender_id: m.sender_id,
          content: m.content,
        })),
      );

    if (messagesError) {
      throw new Error(`Failed to send initial messages: ${messagesError.message}`);
    }

    await supabase
      .from("chat_conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("conversation_id", conversationId);
  }

  return { conversation_id: conversationId };
}

/**
 * Returns all conversations that the given user is a part of.
 */
export async function getConversations(user_id: string): Promise<ChatConversation[]> {
  const supabase = await createClient();

  const { data: memberships, error: membersError } = await supabase
    .from("chat_conversation_members")
    .select("conversation_id")
    .eq("user_id", user_id);

  if (membersError) {
    throw new Error(`Failed to fetch conversations: ${membersError.message}`);
  }

  if (!memberships || memberships.length === 0) {
    return [];
  }

  const conversationIds = memberships.map((m) => m.conversation_id);

  const { data: conversations, error: convError } = await supabase
    .from("chat_conversations")
    .select("conversation_id, created_at, last_message_at")
    .in("conversation_id", conversationIds)
    .order("last_message_at", { ascending: false });

  if (convError) {
    throw new Error(`Failed to fetch conversations: ${convError.message}`);
  }

  const result: ChatConversation[] = [];

  for (const conv of conversations ?? []) {
    const { data: otherMembers } = await supabase
      .from("chat_conversation_members")
      .select("user_id")
      .eq("conversation_id", conv.conversation_id)
      .neq("user_id", user_id);

    const other_member_ids = (otherMembers ?? []).map((m) => m.user_id);

    const { data: lastMsg } = await supabase
      .from("chat_messages")
      .select("content, created_at")
      .eq("conversation_id", conv.conversation_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    result.push({
      id: conv.conversation_id,
      created_at: conv.created_at,
      last_message: lastMsg?.content ?? undefined,
      last_message_at: lastMsg?.created_at ?? conv.last_message_at ?? undefined,
      other_member_ids,
    });
  }

  return result;
}
