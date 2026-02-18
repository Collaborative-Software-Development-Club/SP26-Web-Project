import { Input } from "@/components/ui/input"

const messages = [
  { id: 1, text: "Hey! Are you still looking for a roommate?", isUser: false },
  { id: 2, text: "Yes! I am looking for two roommates.", isUser: true },
]

export function ChatClient() {
  return (
    <div className="p-4 w-3/5 min-h-screen ml-[35%]">
      <h1 className="text-2xl font-semibold mb-6">Chat</h1>

      <div className="bg-background rounded-lg p-6 mb-4 min-h-96 border">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex mb-3 ${msg.isUser ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-2xl px-4 py-2 max-w-md ${msg.isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-background rounded-lg border p-3">
        <Input type="text" placeholder="Type a message..." className="border-0" />
      </div>
    </div>
  )
}
