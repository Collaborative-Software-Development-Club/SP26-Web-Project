"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { sendMessageAction } from "./actions";

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
  const messages = serverMessages;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      await sendMessageAction(conversationId, inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="p-4 w-3/5 min-h-screen ml-[35%]">
      <h1 className="text-2xl font-semibold mb-6">Chat</h1>
      <div className="bg-background rounded-lg p-6 mb-4 min-h-96 border">
        {messages.map((msg) => (
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
      <form
        onSubmit={handleSubmit}
        className="bg-background rounded-lg border p-3 flex gap-2"
      >
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
