// web-app/app/(chat)/chat/page.tsx
import { requireAuth } from "@/lib/auth";
import { ChatPreviewItem } from "./_components/chat-preview-item";

export default async function Chat() {
  const user = await requireAuth();

  // Mock Data - Replace with Supabase fetch later
  const chats = [
    {
      id: "room-1",
      partnerName: "Emily Chen",
      partnerAvatarUrl: "/demo/selfie.png", // Using your demo image
      lastMessage: "Hey! Are you still interested in the room?",
      lastMessageAt: new Date().toISOString(),
      unreadCount: 2,
    },
    {
      id: "room-2",
      partnerName: "Daniel Kim",
      lastMessage: "Sounds good, see you then.",
      lastMessageAt: "2025-02-16T10:00:00Z",
      unreadCount: 0,
    },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-black">
      {/* Sidebar List */}
      <div className="w-full max-w-sm border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
        <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Messages
        </h1>
        <div className="flex flex-col gap-2">
          {chats.map((chat) => (
            <ChatPreviewItem
              key={chat.id}
              id={chat.id}
              partnerName={chat.partnerName}
              partnerAvatarUrl={chat.partnerAvatarUrl}
              lastMessage={chat.lastMessage}
              lastMessageAt={chat.lastMessageAt}
              unreadCount={chat.unreadCount}
            />
          ))}
        </div>
      </div>

      {/* Main Chat Area (Placeholder) */}
      <div className="flex flex-1 items-center justify-center p-8 text-zinc-500">
        Select a conversation to start chatting
      </div>
    </div>
  );
}