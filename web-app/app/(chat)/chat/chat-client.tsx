"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { ChatSidebar } from "./_components/chatPreviewList"
import { getConversationMessages, sendChatMessage } from "./_actions"
import type { ChatMessage, ConversationPreview } from "../types"

const SAMPLE_MESSAGES: Record<
  string,
  { id: string; text: string; isUser: boolean }[]
> = {
  "sample-1": [
    { id: "s1-1", text: "Hey! Are you still looking for a roommate?", isUser: false },
    { id: "s1-2", text: "Yes! I am looking for two roommates.", isUser: true },
  ],
  "sample-2": [
    { id: "s2-1", text: "Yes! I am looking for two roommates.", isUser: false },
    { id: "s2-2", text: "Great! When would you like to view the place?", isUser: true },
  ],
  "sample-3": [
    { id: "s3-1", text: "Sounds good! Let me know when you want to meet up.", isUser: false },
    { id: "s3-2", text: "How about this weekend?", isUser: true },
  ],
}

export function ChatClient({
  initialConversations,
  currentUserId,
}: {
  initialConversations: ConversationPreview[]
  currentUserId: string
}) {
  const [selectedId, setSelectedId] = useState(
    initialConversations[0]?.id ?? "",
  )
  const [messages, setMessages] = useState<
    { id: string; text: string; isUser: boolean }[]
  >([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [sending, setSending] = useState(false)

  const selectedConversation = initialConversations.find((c) => c.id === selectedId)

  async function handleSendMessage() {
    const trimmed = inputValue.trim();
    if (!trimmed || !selectedId) return;

    setInputValue("");

    if (selectedId.startsWith("sample-")) {
      setMessages((prev) => [
        ...prev,
        { id: `sample-${Date.now()}`, text: trimmed, isUser: true },
      ]);
      return;
    }

    setSending(true);
    try {
      await sendChatMessage(selectedId, trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}`,
          text: trimmed,
          isUser: true,
        },
      ]);
    } catch (e) {
      setInputValue(trimmed);
      console.error("Failed to send message:", e);
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    if (!selectedId) {
      setMessages([])
      return
    }

    if (selectedId.startsWith("sample-")) {
      setMessages(SAMPLE_MESSAGES[selectedId] ?? [])
      return
    }

    setLoading(true)
    getConversationMessages(selectedId)
      .then((msgs: ChatMessage[]) =>
        msgs.map((m) => ({
          id: m.message_id,
          text: m.content,
          isUser: m.sender_id === currentUserId,
        })),
      )
      .then(setMessages)
      .finally(() => setLoading(false))
  }, [selectedId, currentUserId])

  return (
    <div className="flex h-[calc(100vh-80px)]">
      <aside className="w-80 shrink-0 border-r">
        <ChatSidebar conversations={initialConversations} />
      </aside>

      <main className="flex flex-1 flex-col">
        <div className="border-b px-6 py-4">
          <h1 className="text-lg font-semibold">
            {selectedConversation?.name ?? "Select a conversation"}
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md rounded-2xl px-4 py-2 ${msg.isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>

        <form
          className="border-t p-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            type="text"
            placeholder="Type a message..."
            className="border-0"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!selectedId || sending}
          />
        </form>
      </main>
    </div>
  )
}
