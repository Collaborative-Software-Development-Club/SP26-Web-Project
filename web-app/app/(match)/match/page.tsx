import { requireAuth } from "@/lib/auth";
import profiles from "@/mock/profiles.json";
import { DiscoveryPage } from "./_components/discovery-page";

export default async function Match() {
  const user = await requireAuth();
  console.log(profiles);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      Match Page
      <DiscoveryPage />
    </div>
  );
}
