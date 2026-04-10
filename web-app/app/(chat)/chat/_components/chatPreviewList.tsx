"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CreateConversationDialog } from "./create-conversation-dialog";
import { Conversation } from "../../types";

const AVATAR_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-amber-500",
];

function nameMatchesSearch(name: string, searchEntry: string) {
  const searchTokens = searchEntry
    .toLowerCase()
    .trim()
    .split(/[,\s]+/)
    .filter(Boolean);
  if (searchTokens.length === 0) return true;

  const nameTokens = name
    .toLowerCase()
    .trim()
    .split(/[,\s]+/)
    .filter(Boolean);

  return searchTokens.every((token) =>
    nameTokens.some((namePart) => namePart.startsWith(token)),
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function ChatPreviewItem({
  conversation,
  isSelected,
  colorIndex,
}: {
  conversation: Conversation;
  isSelected: boolean;
  colorIndex: number;
}) {
  return (
    <Link
      href={`/chat/${conversation.id}`}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
        isSelected && "bg-muted",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white",
          AVATAR_COLORS[colorIndex % AVATAR_COLORS.length],
        )}
      >
        {conversation.isGroup ? (
          <span className="text-[11px] font-semibold leading-none">GC</span>
        ) : (
          getInitials(conversation.name)
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "truncate text-sm",
              conversation.unread ? "font-semibold" : "font-medium",
            )}
          >
            {conversation.name}
          </span>
          <span className="ml-2 shrink-0 text-xs text-muted-foreground">
            {conversation.timestamp}
          </span>
        </div>
        <p
          className={cn(
            "truncate text-sm",
            conversation.unread ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {conversation.lastMessage}
        </p>
      </div>

      {conversation.unread && (
        <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
      )}
    </Link>
  );
}

export function ChatSidebar({
  conversations,
}: {
  conversations: Conversation[];
}) {
  const pathname = usePathname();
  const [searchEntry, setSearchEntry] = useState("");
  const filteredConversations = conversations.filter((c) =>
    nameMatchesSearch(c.name, searchEntry),
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-2 border-b px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Messages</h2>
          <CreateConversationDialog />
        </div>
        <Input
          type="text"
          placeholder="Search conversations..."
          value={searchEntry}
          onChange={(e) => setSearchEntry(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-sm text-muted-foreground">
            <p>No conversations yet.</p>
            <p>Create one to get started.</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No conversations match your search.
          </div>
        ) : (
          filteredConversations.map((conversation, index) => (
            <ChatPreviewItem
              key={conversation.id}
              conversation={conversation}
              isSelected={pathname === `/chat/${conversation.id}`}
              colorIndex={index}
            />
          ))
        )}
      </div>
    </div>
  );
}
