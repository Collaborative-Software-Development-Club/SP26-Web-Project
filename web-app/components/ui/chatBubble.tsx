import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  text: string;
}

export function ChatBubble({ text }: ChatBubbleProps) {
  return (
    <div className="flex justify-end">
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2 bg-primary text-primary-foreground shadow-sm",
          "rounded-br-md"
        )}
      >
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
}
