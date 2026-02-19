import { requireAuth } from "@/lib/auth";
import { ChatClient } from "./chat-client";
import { createClient } from "@/lib/supabase/server";

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

  const messages = (result.data as Message[]) ?? [];

  return (
    <ChatClient
      serverMessages={messages}
      userId={user.id}
      conversationId={id}
    />
  );
}
