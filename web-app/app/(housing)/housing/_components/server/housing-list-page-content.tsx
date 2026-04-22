import { createClient } from "@/lib/supabase/server";
import { getHousingListings } from "../../_actions";
import { HOUSING_LISTINGS_BATCH_SIZE } from "../../housing-list-batch";
import type { House } from "../house-card";
import { HousingList } from "../housing-list";

const PAGE_SIZE = 9;

export async function HousingListPageContent() {
  let listings: House[] = [];
  let totalCount = 0;
  let loadError: string | null = null;

  try {
    const result = await getHousingListings(1, HOUSING_LISTINGS_BATCH_SIZE);
    listings = (result.listings as House[]) ?? [];
    totalCount = result.total;
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Failed to load listings.";
  }

  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    // Auth is optional for browsing; ignore if Supabase env/network fails here too.
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Housing Listings</h1>
        {loadError ? (
          <div
            className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {loadError}
          </div>
        ) : (
          <HousingList
            initialListings={listings}
            initialTotal={totalCount}
            pageSize={PAGE_SIZE}
            userId={userId}
          />
        )}
      </div>
    </div>
  );
}
