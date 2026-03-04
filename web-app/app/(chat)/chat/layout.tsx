import { requireAuth } from "@/lib/auth";
import { getConversationsForDisplay } from "./_actions";
import { ChatSidebar } from "./_components/chatPreviewList";
import { RealtimeChatProvider } from "./_components/realtime-provider";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();
  const conversations = await getConversationsForDisplay(user.id);

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <aside className="w-80 shrink-0 border-r">
        <ChatSidebar conversations={conversations} />
      </aside>
      <main className="flex flex-1 flex-col min-h-0 overflow-hidden">
        <RealtimeChatProvider>{children}</RealtimeChatProvider>
      </main>
    </div>
  );
}
