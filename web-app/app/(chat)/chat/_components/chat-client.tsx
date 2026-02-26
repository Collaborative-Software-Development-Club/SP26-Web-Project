"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useChatRealtime } from "./realtime-provider";
import { sendMessageAction } from "../_actions";
import { Message } from "../../types";

export function ChatClient({
  serverMessages,
  userId,
  conversationId,
}: {
  serverMessages: Message[];
  userId: string;
  conversationId: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const { realtimeMessages } = useChatRealtime();

  const serverIds = new Set(serverMessages.map((m) => m.message_id));
  const liveMessages = realtimeMessages.filter(
    (m) => m.conversation_id === conversationId && !serverIds.has(m.message_id),
  );
  const allMessages = [...serverMessages, ...liveMessages];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      await sendMessageAction(conversationId, inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-6">
        {allMessages.map((msg) => (
          <div
            key={msg.message_id}
            className={`flex mb-3 ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-2xl px-4 py-2 max-w-md ${msg.sender_id === userId ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              {msg.content}
            </div>
          </div>
        ))}
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
