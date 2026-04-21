"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useMemo } from "react";
import { useChatRealtime } from "./realtime-provider";
import { sendChatMessage } from "../_actions";
import { ChatMessage } from "../../types";
import type { SenderMetaEntry } from "../_sender-meta";

const HOUSING_ESCAPE_PATTERN = /^\[\[HOUSING:([^\]]+)\]\]$/;

function getHousingListingId(content: string): string | null {
  const match = content.trim().match(HOUSING_ESCAPE_PATTERN);
  return match?.[1] ?? null;
}

function renderMessageContent(ChatMessage: ChatMessage) {
  const listingId = getHousingListingId(ChatMessage.content);
  if (listingId) {
    const address = ChatMessage.address ?? "[ERROR] housing listing not found";
    if (address.startsWith("[ERROR]")) {
      return address;
    }
    return (
      <Link href={`/housing/${listingId}`} className="underline">
        {address}
      </Link>
    );
  }
  return ChatMessage.content;
}

export function ChatClient({
  serverMessages,
  userId,
  conversationId,
  conversationTitle,
  isGroupConversation,
  senderMeta,
}: {
  serverMessages: ChatMessage[];
  userId: string;
  conversationId: string;
  conversationTitle: string;
  isGroupConversation: boolean;
  senderMeta: Record<string, SenderMetaEntry>;
}) {
  const [inputValue, setInputValue] = useState("");
  const { realtimeMessages } = useChatRealtime();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const serverIds = new Set(serverMessages.map((m) => m.message_id));
  const liveMessages = realtimeMessages.filter(
    (m) => m.conversation_id === conversationId && !serverIds.has(m.message_id),
  );

  const sortedMessages = useMemo(() => {
    const base = [...serverMessages, ...liveMessages];
    return base.sort((a, b) => {
      const t = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (t !== 0) return t;
      return a.message_id.localeCompare(b.message_id);
    });
  }, [serverMessages, liveMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    await sendChatMessage(conversationId, trimmed);
    setInputValue("");
  };

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">{conversationTitle}</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {sortedMessages.map((msg, i) => {
          const isSelf = msg.sender_id === userId;
          const isHousingMessage = Boolean(getHousingListingId(msg.content));
          const isRunStart =
            i === 0 || sortedMessages[i - 1].sender_id !== msg.sender_id;
          const isRunEnd =
            i === sortedMessages.length - 1 ||
            sortedMessages[i + 1].sender_id !== msg.sender_id;

          if (!isGroupConversation || isSelf) {
            return (
              <div
                key={msg.message_id}
                className={`flex mb-3 ${isSelf ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 max-w-md ${isSelf ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} ${isHousingMessage ? "transition-colors hover:bg-red-900/90" : ""}`}
                >
                  {renderMessageContent(msg)}
                </div>
              </div>
            );
          }

          const meta = senderMeta[msg.sender_id];
          const displayName = meta?.displayName ?? "Unknown";
          const initials =
            meta?.initials ??
            (msg.sender_id.length >= 2
              ? msg.sender_id.slice(0, 2).toUpperCase()
              : "?");

          return (
            <div key={msg.message_id} className="mb-3">
              {isRunStart && (
                <div className="text-xs text-foreground/70 mb-1 ml-14 text-left">
                  {displayName}
                </div>
              )}
              <div className="flex gap-2 items-end">
                <div className="w-8 shrink-0 flex justify-center pb-1">
                  {isRunEnd ? (
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[10px] font-semibold text-muted-foreground"
                      aria-hidden
                    >
                      {initials}
                    </div>
                  ) : null}
                </div>
                <div className="rounded-2xl px-4 py-2 max-w-md bg-muted text-muted-foreground">
                  <div
                    className={`${isHousingMessage ? "transition-colors hover:bg-red-900/20 -mx-4 -my-2 px-4 py-2 rounded-2xl" : ""}`}
                  >
                  {renderMessageContent(msg)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
        <Input
          type="text"
          placeholder="Type a message..."
          className="border-0 flex-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
