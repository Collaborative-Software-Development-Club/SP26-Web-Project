"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function sendMessageAction(
  conversationId: string,
  message: string,
) {
  if (message.length === 0) return;

  const user = await requireAuth();
  const supabase = await createClient();

  try {
    const result = await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: message,
    });
    console.log("sent message");
    console.log(result);
  } catch (error) {
    console.error(error);
  }

  revalidatePath(`/conversation/${conversationId}`);
}
