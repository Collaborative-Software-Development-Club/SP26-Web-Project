import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ChatClient } from "../_components/chat-client";
import { getConversationMessages } from "../_actions";
import { ChatMessage } from "../../types";
import { buildSenderMetaFromProfiles, type SenderMetaEntry } from "../_sender-meta";

export default async function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireAuth();
  const { id } = await params;
  const supabase = await createClient();

  let messages: ChatMessage[];
  let conversationTitle: string;
  let isGroupConversation: boolean;
  let senderMeta: Record<string, SenderMetaEntry>;

  messages = (await getConversationMessages(id)) as ChatMessage[];

  const { data: allMemberRows } = await supabase
    .from("chat_conversation_members")
    .select("user_id")
    .eq("conversation_id", id);

  const allMemberIds = (allMemberRows ?? []).map((m) => m.user_id);
  const otherMemberIds = allMemberIds.filter((memberId) => memberId !== user.id);
  isGroupConversation = otherMemberIds.length > 1;

  const { data: profiles } = await supabase
    .from("user_profiles")
    .select("user_id, fname, lname")
    .in("user_id", allMemberIds);

  senderMeta = buildSenderMetaFromProfiles(profiles ?? []);

  conversationTitle = "Conversation";
  if (otherMemberIds.length > 0) {
    const profileById = new Map(
      (profiles ?? []).map((profile) => [profile.user_id, profile]),
    );
    conversationTitle = otherMemberIds
      .map((memberId) => {
        const profile = profileById.get(memberId);
        const fullName = `${profile?.fname ?? ""} ${profile?.lname ?? ""}`.trim();
        return fullName || memberId;
      })
      .join(", ");
  }

  return (
    <ChatClient
      serverMessages={messages}
      userId={user.id}
      conversationId={id}
      conversationTitle={conversationTitle}
      isGroupConversation={isGroupConversation}
      senderMeta={senderMeta}
    />
  );
}
