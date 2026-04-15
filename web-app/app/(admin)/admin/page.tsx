import { getHousingListings } from "@/app/(housing)/housing/_actions";
import { AdminHousingList } from "./_components/admin-housing-list";

const PAGE_SIZE = 9;

export default async function AdminPage() {
  const { listings } = await getHousingListings(1, PAGE_SIZE);
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Admin — Housing Listings</h1>
        <AdminHousingList initialListings={listings} pageSize={PAGE_SIZE} />
      </div>
    </div>
  );
}