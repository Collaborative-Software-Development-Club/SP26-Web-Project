import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const AVATAR_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-amber-500",
]

interface Conversation {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  unread: boolean
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Jane Doe",
    lastMessage: "Hey! Are you still looking for a roommate?",
    timestamp: "2m",
    unread: true,
  },
  {
    id: "2",
    name: "John Smith",
    lastMessage: "Yes! I am looking for two roommates.",
    timestamp: "1h",
    unread: false,
  },
  {
    id: "3",
    name: "Alex Chen",
    lastMessage: "Sounds good! Let me know when you want to meet up.",
    timestamp: "3d",
    unread: false,
  },
  {
    id: "4",
    name: "Sam Rivera",
    lastMessage: "I'm moving in August, does that work?",
    timestamp: "5d",
    unread: true,
  },
  {
    id: "5",
    name: "Morgan Lee",
    lastMessage: "Thanks for the info!",
    timestamp: "1w",
    unread: false,
  },
]

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function ChatPreviewItem({
  conversation,
  isSelected,
  onSelect,
  colorIndex,
}: {
  conversation: Conversation
  isSelected: boolean
  onSelect: (id: string) => void
  colorIndex: number
}) {
  return (
    <button
      onClick={() => onSelect(conversation.id)}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
        isSelected && "bg-muted",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white",
          AVATAR_COLORS[colorIndex % AVATAR_COLORS.length],
        )}
      >
        {getInitials(conversation.name)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className={cn("truncate text-sm", conversation.unread ? "font-semibold" : "font-medium")}>
            {conversation.name}
          </span>
          <span className="ml-2 shrink-0 text-xs text-muted-foreground">
            {conversation.timestamp}
          </span>
        </div>
        <p className={cn(
          "truncate text-sm",
          conversation.unread ? "text-foreground" : "text-muted-foreground",
        )}>
          {conversation.lastMessage}
        </p>
      </div>

      {conversation.unread && (
        <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  )
}

export function ChatPreviewList({
  selectedId,
  onSelect,
}: {
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-2 border-b px-4 py-4">
        <h2 className="text-lg font-semibold">Messages</h2>
        <Input
          type="text"
          placeholder="Search conversations..."
          readOnly
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {mockConversations.map((conversation, index) => (
          <ChatPreviewItem
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedId === conversation.id}
            onSelect={onSelect}
            colorIndex={index}
          />
        ))}
      </div>
    </div>
  )
}
