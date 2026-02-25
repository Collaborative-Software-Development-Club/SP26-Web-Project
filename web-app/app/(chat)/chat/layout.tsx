import { requireAuth } from "@/lib/auth";
import { getConversationsForDisplay } from "./_actions";
import { ChatSidebar } from "./_components/chatPreviewList";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();
  const conversations = await getConversationsForDisplay(user.id);
  console.log(conversations);

  return (
    <div className="flex h-full">
      <aside className="w-80 shrink-0 border-r">
        <ChatSidebar conversations={conversations} />
      </aside>
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
