import { requireAuth } from "@/lib/auth";
import ProfileImageScroll from "./_components/image-scroll";

export default async function ProfilePage() {
  const user = await requireAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      Profile Page
    </div>
  );
}
