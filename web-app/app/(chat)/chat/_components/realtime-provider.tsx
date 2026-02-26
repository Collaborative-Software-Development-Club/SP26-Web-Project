"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Message } from "../../types";

type ChatRealtimeContextValue = { realtimeMessages: Message[] };

const ChatRealtimeContext = createContext<ChatRealtimeContextValue>({
  realtimeMessages: [],
});

export const useChatRealtime = () => useContext(ChatRealtimeContext);

export function RealtimeChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session) supabase.realtime.setAuth(session.access_token);

      channel = supabase
        .channel("chat-messages")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "chat_messages" },
          (payload) =>
            setRealtimeMessages((prev) => [...prev, payload.new as Message]),
        )
        .subscribe();
    });

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ChatRealtimeContext.Provider value={{ realtimeMessages }}>
      {children}
    </ChatRealtimeContext.Provider>
  );
}
