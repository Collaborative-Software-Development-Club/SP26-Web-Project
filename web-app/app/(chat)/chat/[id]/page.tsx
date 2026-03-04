import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ChatClient } from "../_components/chat-client";
import { ChatMessage } from "../../types";

export default async function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireAuth();
  const { id } = await params;
  const supabase = await createClient();

  const result = await supabase
    .from("chat_messages")
    .select("*")
    .eq("conversation_id", id);

  const messages = (result.data as ChatMessage[]) ?? [];

  return (
    <ChatClient
      serverMessages={messages}
      userId={user.id}
      conversationId={id}
    />
  );
}
