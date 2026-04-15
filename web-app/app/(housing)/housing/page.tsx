import { getHousingListings } from "./_actions";
import { HousingList } from "./_components/housing-list";

const PAGE_SIZE = 9;

export default async function Housing() {
  const { listings, total } = await getHousingListings(1, PAGE_SIZE);

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Housing Listings</h1>

        <HousingList initialListings={listings} total={total} pageSize={PAGE_SIZE} />
      </div>
    </div>
  );
}
