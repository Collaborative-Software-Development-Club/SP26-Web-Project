import { getHousingListings } from "@/app/(housing)/housing/_actions";
import { getAdminStatus, requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminHousingList } from "../admin-housing-list";

const PAGE_SIZE = 9;

export async function AdminHousingListPageContent() {
  const user = await requireAuth();
  const isAdmin = await getAdminStatus(user);
  if (!isAdmin) {
    redirect("/housing");
  }

  const { listings } = await getHousingListings(1, PAGE_SIZE);

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-semibold text-foreground">
          Admin — Housing Listings
        </h1>
        <AdminHousingList initialListings={listings} pageSize={PAGE_SIZE} />
      </div>
    </div>
  );
}
