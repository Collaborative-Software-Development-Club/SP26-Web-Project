"use server";

import { createClient } from "@/lib/supabase/server";
import * as chatService from "@/lib/services/chat";
import { ChatMessage, ConversationPreview } from "../types";

const HOUSING_ESCAPE_PATTERN = /^\[\[HOUSING:[^\]]+\]\]$/;
const HOUSING_ESCAPE_EXTRACT_PATTERN = /^\[\[HOUSING:([^\]]+)\]\]$/;

function getHousingListingIdFromContent(content: string): string | null {
  const match = content.trim().match(HOUSING_ESCAPE_EXTRACT_PATTERN);
  return match?.[1] ?? null;
}

async function getHousingAddressMap(
  supabase: Awaited<ReturnType<typeof createClient>>,
  listingIds: string[],
): Promise<{ byId: Map<string, string | null>; lookupError: string | null }> {
  if (listingIds.length === 0) {
    return { byId: new Map<string, string | null>(), lookupError: null };
  }
  //We need to pull from housing again because the address is not stored in the chat_messages table, and chat window is post client hydration, and not accesible currently.
  const { data: housingRows, error: housingError } = await supabase
    .from("housing_property_records")
    .select("id, address")
    .in("id", listingIds);

  if (housingError) {
    const lookupError = `Failed to fetch housing addresses: ${housingError.message}`;
    console.error(`[chat] ${lookupError}`);
    return { byId: new Map<string, string | null>(), lookupError };
  }

  const byId = new Map<string, string | null>();
  for (const row of housingRows ?? []) {
    byId.set(String(row.id), row.address ?? null);
  }
  return { byId, lookupError: null };
}

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
  if (HOUSING_ESCAPE_PATTERN.test(trimmed)) {
    console.log(`[chat] housing escape message sent: ${trimmed}`);
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

  const listingIds = new Set<string>();
  for (const message of data ?? []) {
    if (HOUSING_ESCAPE_PATTERN.test(message.content ?? "")) {
      console.log(
        `[chat] housing escape message found in conversation ${conversationId}: ${message.content}`,
      );
      const listingId = getHousingListingIdFromContent(message.content ?? "");
      if (listingId) listingIds.add(listingId);
    }
  }

  // Fetch housing addresses in advance server side so it is not needed later.
  const { byId: addressByListingId, lookupError: housingLookupError } =
    await getHousingAddressMap(supabase, [...listingIds]);

  return (data ?? []).map((message) => {
    const listingId = getHousingListingIdFromContent(message.content ?? "");
    let address: string | null = null;
    if (listingId) {
      if (housingLookupError) {
        address = `[ERROR] ${housingLookupError}`;
      } else if (!addressByListingId.has(listingId)) {
        address = `[ERROR] housing listing not found (${listingId})`;
      } else {
        address = addressByListingId.get(listingId) ?? `[ERROR] Address is null for listing ${listingId}`;
      }
    }
    return { ...message, address };
  });
}

export async function resolveHousingAddresses(
  listingIds: string[],
): Promise<Record<string, string>> {
  const supabase = await createClient();
  const uniqueIds = [...new Set(listingIds.filter(Boolean))];
  const { byId: addressByListingId, lookupError: housingLookupError } =
    await getHousingAddressMap(supabase, uniqueIds);

  const result: Record<string, string> = {};
  for (const listingId of uniqueIds) {
    if (housingLookupError) {
      result[listingId] = `[ERROR] ${housingLookupError}`;
    } else if (!addressByListingId.has(listingId)) {
      result[listingId] = `[ERROR] housing listing not found (${listingId})`;
    } else {
      result[listingId] =
        addressByListingId.get(listingId) ??
        `[ERROR] Address is null for listing ${listingId}`;
    }
  }

  return result;
}

export async function getConversations(userId: string) {
  return chatService.getConversations(userId);
}

export type DirectConversationTarget = {
  conversationId: string;
  fname: string | null;
  lname: string | null;
};

export async function getDirectConversationTargets(): Promise<
  Record<string, DirectConversationTarget>
> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  // Pull the user's conversations from membership rows, then keep strict 1:1 threads.
  const { data: selfMemberships, error: selfMembershipsError } = await supabase
    .from("chat_conversation_members")
    .select("conversation_id")
    .eq("user_id", user.id);
  if (selfMembershipsError) {
    throw new Error(
      `Failed to fetch user conversations: ${selfMembershipsError.message}`,
    );
  }

  const conversationIds = [
    ...new Set((selfMemberships ?? []).map((m) => m.conversation_id)),
  ];
  if (conversationIds.length === 0) return {};

  const { data: allMemberships, error: allMembershipsError } = await supabase
    .from("chat_conversation_members")
    .select("conversation_id, user_id")
    .in("conversation_id", conversationIds);
  if (allMembershipsError) {
    throw new Error(
      `Failed to fetch conversation members: ${allMembershipsError.message}`,
    );
  }

  const membersByConversation = new Map<string, string[]>();
  for (const row of allMemberships ?? []) {
    const current = membersByConversation.get(row.conversation_id) ?? [];
    current.push(row.user_id);
    membersByConversation.set(row.conversation_id, current);
  }

  const directPairs: { conversationId: string; peerUserId: string }[] = [];
  for (const [conversationId, members] of membersByConversation.entries()) {
    const uniqueMembers = [...new Set(members)];
    if (uniqueMembers.length !== 2 || !uniqueMembers.includes(user.id)) continue;
    const peerUserId = uniqueMembers.find((id) => id !== user.id);
    if (!peerUserId) continue;
    directPairs.push({ conversationId, peerUserId });
  }

  const peerIds = [...new Set(directPairs.map((p) => p.peerUserId))];
  if (peerIds.length === 0) return {};

  const { data: members, error: membersError } = await supabase
    .from("user_profiles")
    .select("user_id, fname, lname")
    .in("user_id", peerIds);

  if (membersError) {
    throw new Error(`Failed to fetch peer names: ${membersError.message}`);
  }

  const memberById = new Map(
    (members ?? []).map((member) => [member.user_id, member]),
  );

  const byPeer: Record<string, DirectConversationTarget> = {};
  for (const pair of directPairs) {
    const peerUserId = pair.peerUserId;
    if (byPeer[peerUserId]) continue;
    const member = memberById.get(peerUserId);
    byPeer[peerUserId] = {
      conversationId: pair.conversationId,
      fname: member?.fname ?? null,
      lname: member?.lname ?? null,
    };
  }

  return byPeer;
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
  const housingListingIds = [
    ...new Set(
      conversations
        .map((conv) => getHousingListingIdFromContent(conv.last_message ?? ""))
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  const { byId: addressByListingId, lookupError: housingLookupError } =
    await getHousingAddressMap(supabase, housingListingIds);

  const previews: ConversationPreview[] = await Promise.all(
    conversations.map(async (conv) => {
      const isGroup = conv.other_member_ids.length > 1;
      const { data: members } = await supabase
        .from("user_profiles")
        .select("user_id, fname, lname")
        .in("user_id", conv.other_member_ids);
      const memberById = new Map(
        (members ?? []).map((member) => [member.user_id, member]),
      );
      const orderedMemberNames = conv.other_member_ids
        .map((memberId) => {
          const member = memberById.get(memberId);
          const fullName = `${member?.fname ?? ""} ${member?.lname ?? ""}`.trim();
          return fullName || memberId;
        })
        .filter(Boolean);
      const name =
        orderedMemberNames.length > 0
          ? orderedMemberNames.join(", ")
          : isGroup
            ? "Group chat"
            : "Unknown user";
      let lastMessage = conv.last_message ?? "No messages yet";
      const listingId = getHousingListingIdFromContent(conv.last_message ?? "");
      if (listingId) {
        if (housingLookupError) {
          lastMessage = `[ERROR] ${housingLookupError}`;
        } else if (!addressByListingId.has(listingId)) {
          lastMessage = `[ERROR] housing listing not found (${listingId})`;
        } else {
          lastMessage =
            addressByListingId.get(listingId) ??
            `[ERROR] Address is null for listing ${listingId}`;
        }
      }

      return {
        id: conv.id,
        name,
        lastMessage,
        timestamp: conv.last_message_at
          ? formatTimestamp(conv.last_message_at)
          : "",
        unread: false,
        isGroup,
      };
    }),
  );
  return previews;
}

export async function createConversation(
  leaderUserId: string,
  memberUserIds: string[],
): Promise<{ conversation_id: string }> {
  const supabase = await createClient();
  const uniqueUserIds = [...new Set([leaderUserId, ...memberUserIds])].sort();
  const isGroup = uniqueUserIds.length > 2;

  const existingConversationId = await findConversationByExactMembers(
    supabase,
    uniqueUserIds,
    isGroup,
  );
  if (existingConversationId) {
    return { conversation_id: existingConversationId };
  }

  const { data: conversation, error: convError } = await supabase
    .from("chat_conversations")
    .insert({ is_group: isGroup })
    .select("conversation_id")
    .single();

  if (convError) {
    throw new Error(`Failed to create conversation: ${convError.message}`);
  }

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

async function findConversationByExactMembers(
  supabase: Awaited<ReturnType<typeof createClient>>,
  memberUserIds: string[],
  isGroup: boolean,
): Promise<string | null> {
  const { data: matchingMemberships, error: matchingError } = await supabase
    .from("chat_conversation_members")
    .select("conversation_id, user_id")
    .in("user_id", memberUserIds);

  if (matchingError) {
    throw new Error(
      `Failed to check existing conversations: ${matchingError.message}`,
    );
  }

  const candidateMap = new Map<string, Set<string>>();
  for (const membership of matchingMemberships ?? []) {
    const currentSet =
      candidateMap.get(membership.conversation_id) ?? new Set<string>();
    currentSet.add(membership.user_id);
    candidateMap.set(membership.conversation_id, currentSet);
  }

  const candidateConversationIds = [...candidateMap.entries()]
    .filter(([, members]) => members.size === memberUserIds.length)
    .map(([conversationId]) => conversationId);

  if (candidateConversationIds.length === 0) {
    return null;
  }

  const { data: candidateConversations, error: candidateConversationsError } =
    await supabase
      .from("chat_conversations")
      .select("conversation_id")
      .in("conversation_id", candidateConversationIds)
      .eq("is_group", isGroup);

  if (candidateConversationsError) {
    throw new Error(
      `Failed to check existing conversations: ${candidateConversationsError.message}`,
    );
  }

  const filteredCandidateIds = (candidateConversations ?? []).map(
    (conversation) => conversation.conversation_id,
  );

  if (filteredCandidateIds.length === 0) {
    return null;
  }

  const { data: candidateMemberships, error: candidateMembershipsError } =
    await supabase
      .from("chat_conversation_members")
      .select("conversation_id, user_id")
      .in("conversation_id", filteredCandidateIds);

  if (candidateMembershipsError) {
    throw new Error(
      `Failed to check existing conversations: ${candidateMembershipsError.message}`,
    );
  }

  const targetSet = new Set(memberUserIds);
  const candidateMembershipMap = new Map<string, Set<string>>();
  for (const membership of candidateMemberships ?? []) {
    const currentSet =
      candidateMembershipMap.get(membership.conversation_id) ??
      new Set<string>();
    currentSet.add(membership.user_id);
    candidateMembershipMap.set(membership.conversation_id, currentSet);
  }

  for (const [conversationId, members] of candidateMembershipMap.entries()) {
    if (
      members.size === targetSet.size &&
      [...targetSet].every((memberId) => members.has(memberId))
    ) {
      return conversationId;
    }
  }

  return null;
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
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("fname, lname")
      .eq("user_id", uid)
      .single();

    if (profileError) {
      throw new Error(
        `Failed to fetch matched user profile (${uid}) from user_profiles: ${profileError.message}`,
      );
    }

    const displayName =
      profile && (profile.fname || profile.lname)
        ? `${profile.fname ?? ""} ${profile.lname ?? ""}`.trim()
        : undefined;

    result.push({ user_id: uid, display_name: displayName });
  }

  return result;
}
