import { requireAuth } from "@/lib/auth";
import { DiscoveryClient } from "./discovery-client";
import profiles from "@/mock/profiles.json";
import { UserProfile } from "./types";

export default async function DiscoveryPage() {
  const user = await requireAuth();

  return <DiscoveryClient initialProfiles={profiles as UserProfile[]} />;
}
