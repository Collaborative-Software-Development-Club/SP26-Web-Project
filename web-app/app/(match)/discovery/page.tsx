import { requireAuth } from "@/lib/auth";
import { DiscoveryClient } from "./discovery-client";
import { DiscoveryProfile, RoommatePreference } from "./types";
import { getUserRoommatePreferences, getDiscoveryProfiles } from "./_actions";
//mock
import roommatePreference from "@/mock/roommate_preference.json";
import discoveryProfiles from "@/mock/discover_profiles.json";

export default async function DiscoveryPage() {
  const user = await requireAuth();
  const c_roommatePreferences = await getUserRoommatePreferences(user.id);
  const c_discoveryProfiles = await getDiscoveryProfiles();

  console.log(c_discoveryProfiles);

  return (
    <DiscoveryClient
      initialProfiles={discoveryProfiles as DiscoveryProfile[]}
      roommatePreferences={roommatePreference as RoommatePreference[]}
    />
  );
}
