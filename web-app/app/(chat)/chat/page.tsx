import { requireAuth } from "@/lib/auth";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

// Mock chat data just for example 
const MOCK_CHATS = [
  { id: 1, name: "Alex Rivera", lastMessage: "Did you see the new design?", time: "2m ago", unread: true },
  { id: 2, name: "Sarah Chen", lastMessage: "Let's meet at 5.", time: "1h ago", unread: false },
  { id: 3, name: "Jordan Smith", lastMessage: "Sent you the files.", time: "3h ago", unread: false },
  { id: 4, name: "Design Team", lastMessage: "The sprint is almost over!", time: "Yesterday", unread: false },
];

export default async function Chat() {
  const user = await requireAuth();

return (
    <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold px-1">Messages</h1>
        <div className="space-y-3">
          {MOCK_CHATS.map((chat) => ( // Replace with "chat preview" component and real chat data
            <Card key={chat.id}>
              <CardHeader> 
                    <CardTitle>{chat.name}</CardTitle>
              </CardHeader>
                    <CardContent>{chat.lastMessage}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}