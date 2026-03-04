import { getHousingListings } from "./_actions";
import { HousingList } from "./_components/housing-list";
import { HousingFilter } from "./_components/housing-filter";

const PAGE_SIZE = 9;

export default async function Housing() {
  const { listings, total } = await getHousingListings(1, PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Housing Listings</h1>

        {/* filter dialog (UI only for now) */}
        <HousingFilter onApply={(filters) => console.log("apply filters", filters)} />

        <HousingList initialListings={listings} total={total} pageSize={PAGE_SIZE} />
      </div>
    </div>
  );
}
