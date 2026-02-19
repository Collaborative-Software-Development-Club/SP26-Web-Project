import { requireAuth } from "@/lib/auth";

export default async function Chat() {
  await requireAuth();

  return "no chat selected";
}
