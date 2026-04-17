import { requireAuth } from "@/lib/auth";
import { DiscoveryClient } from "./discovery-client";
import { getDiscoveryProfiles, getDiscoveryFilter } from "./_actions";
//mock
import discoveryFilter from "@/mock/discovery_filter.json";
import discoveryProfiles from "@/mock/discover_profiles.json";

export default async function DiscoveryPage() {
  await requireAuth();
  const c_discoveryProfiles = await getDiscoveryProfiles();
  const c_discoveryFilter = await getDiscoveryFilter();
  const use_API = true;

  const profiles = use_API ? c_discoveryProfiles : discoveryProfiles;
  const filters = use_API ? c_discoveryFilter : discoveryFilter;

  const discoveryClientKey = JSON.stringify({
    filter: filters
  });

  return (
    <DiscoveryClient
      key={discoveryClientKey}
      initialProfiles={profiles}
      discoveryFilters={filters}
    />
  );
}
