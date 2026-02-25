import { requireAuth } from "@/lib/auth";
import { ChatClient } from "./chat-client";
import { getConversationsForDisplay, type ConversationPreview } from "./_actions";

const SAMPLE_CONVERSATIONS: ConversationPreview[] = [
  {
    id: "sample-1",
    name: "Jane Doe",
    lastMessage: "Hey! Are you still looking for a roommate?",
    timestamp: "2m",
    unread: true,
  },
  {
    id: "sample-2",
    name: "John Smith",
    lastMessage: "Yes! I am looking for two roommates.",
    timestamp: "1h",
    unread: false,
  },
  {
    id: "sample-3",
    name: "Alex Chen",
    lastMessage: "Sounds good! Let me know when you want to meet up.",
    timestamp: "3d",
    unread: false,
  },
];

export default async function Chat() {
  const user = await requireAuth();
  const conversations = await getConversationsForDisplay(user.id);

<<<<<<< HEAD
  return "no chat selected";
=======
  const displayConversations =
    conversations.length > 0 ? conversations : SAMPLE_CONVERSATIONS;

  return (
    <ChatClient
      initialConversations={displayConversations}
      currentUserId={user.id}
    />
  );
>>>>>>> dev
}
