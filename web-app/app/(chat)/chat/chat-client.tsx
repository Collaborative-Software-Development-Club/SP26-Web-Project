"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ChatBubble } from "@/app/(chat)/components/chatBubble";

export function ChatClient() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      setMessages([...messages, inputValue.trim()]);
      setInputValue("");
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Messages Area - will be scrollable */}
      <div className="flex-1 overflow-y-auto pb-24 px-24 py-6">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatBubble key={index} text={message} />
          ))}
        </div>
      </div>

      {/* Input Area - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background px-24 py-6">
        <Input
          placeholder="Type a message..."
          className="h-12 text-base"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
}
