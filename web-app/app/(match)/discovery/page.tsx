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
  const use_API = true;

  console.log("c_discoveryProfiles", c_discoveryProfiles);
  console.log("c_discoveryFilter", c_discoveryFilter);
  
  return (
    <DiscoveryClient
      initialProfiles={use_API ? c_discoveryProfiles : discoveryProfiles}
      discoveryFilters={use_API ? c_discoveryFilter : discoveryFilter}
    />
  );
}
