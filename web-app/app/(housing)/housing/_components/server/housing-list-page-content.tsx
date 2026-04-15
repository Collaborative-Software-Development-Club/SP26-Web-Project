import { createClient } from "@/lib/supabase/server";
import { getHousingListings } from "../../_actions";
import { HousingList } from "../housing-list";

const PAGE_SIZE = 9;

export async function HousingListPageContent() {
  const { listings } = await getHousingListings(1, PAGE_SIZE);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Housing Listings</h1>
        <HousingList
          initialListings={listings}
          pageSize={PAGE_SIZE}
          userId={user?.id ?? null}
        />
      </div>
    </div>
  );
}
