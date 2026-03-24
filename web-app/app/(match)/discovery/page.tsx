import { requireAuth } from "@/lib/auth";
import { DiscoveryClient } from "./discovery-client";
import { getDiscoveryProfiles, getDiscoveryFilter } from "./_actions";
//mock
import discoveryFilter from "@/mock/discovery_filter.json";
import discoveryProfiles from "@/mock/discover_profiles.json";

export default async function DiscoveryPage() {
  const user = await requireAuth();
  const c_discoveryProfiles = await getDiscoveryProfiles();
  const c_discoveryFilter = await getDiscoveryFilter();

  //TODO: replace with c_discoveryProfiles and Filter
  return (
    <DiscoveryClient
      initialProfiles={discoveryProfiles}
      discoveryFilters={discoveryFilter}
    />
  );
}
