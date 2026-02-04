import { requireAuth } from "@/lib/auth";

export default async function Chat() {
  const user = await requireAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      Chat Page
    </div>
  );
}
