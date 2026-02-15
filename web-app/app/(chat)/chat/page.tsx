import { requireAuth } from "@/lib/auth";
import { ChatClient } from "./chat-client";

export default async function Chat() {
  await requireAuth();

  return <ChatClient />;
}
