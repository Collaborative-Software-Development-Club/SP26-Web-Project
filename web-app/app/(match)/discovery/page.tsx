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
  const c_discoveryProfiles = await getDiscoveryProfiles(
    c_roommatePreferences.map((preference) => preference.preference_id),
  );

  return (
    <DiscoveryClient
      initialProfiles={c_discoveryProfiles.length > 0 ? c_discoveryProfiles : (discoveryProfiles as DiscoveryProfile[])}
      roommatePreferences={c_roommatePreferences.length > 0 ? c_roommatePreferences : (roommatePreference as RoommatePreference[])}
    />
  );
}
