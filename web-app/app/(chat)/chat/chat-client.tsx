"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ChatPreviewList } from "./_components/chatPreviewList"

const messages = [
  { id: 1, text: "Hey! Are you still looking for a roommate?", isUser: false },
  { id: 2, text: "Yes! I am looking for two roommates.", isUser: true },
]

export function ChatClient() {
  const [selectedId, setSelectedId] = useState("1")

  return (
    <div className="flex h-[calc(100vh-80px)]">
      <aside className="w-80 shrink-0 border-r">
        <ChatPreviewList selectedId={selectedId} onSelect={setSelectedId} />
      </aside>

      <main className="flex flex-1 flex-col">
        <div className="border-b px-6 py-4">
          <h1 className="text-lg font-semibold">Jane Doe</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {messages.map((msg) => (
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
          ))}
        </div>

        <div className="border-t p-3">
          <Input type="text" placeholder="Type a message..." className="border-0" />
        </div>
      </main>
    </div>
  )
}
