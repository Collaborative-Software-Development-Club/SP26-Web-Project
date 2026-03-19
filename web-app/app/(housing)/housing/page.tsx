import { getHousingListings } from "./_actions";
import { HousingList } from "./_components/housing-list";
import { mockHouses } from "@/lib/mock-housing"; //can remove when using real data

const PAGE_SIZE = 9;

export default async function Housing() {
  //const { listings, total } = await getHousingListings(1, PAGE_SIZE);
  // Using mock data for now
  const listings = mockHouses;
  const total = mockHouses.length;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Housing Listings</h1>

        <HousingList initialListings={listings} total={total} pageSize={PAGE_SIZE} />
      </div>
    </div>
  );
}
