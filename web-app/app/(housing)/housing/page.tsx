import { getHousingListings } from "./_actions";
import { HousingList } from "./_components/housing-list";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 9;

export default async function Housing() {
  const { listings, total } = await getHousingListings(1, PAGE_SIZE);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Housing Listings</h1>

        <HousingList initialListings={listings} total={total} pageSize={PAGE_SIZE} userId={user?.id ?? null} />
      </div>
    </div>
  );
}
