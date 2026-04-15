import { createClient } from "@/lib/supabase/server";
import { getHousingListing, getSavedHousing } from "../../_actions";
import { HousingDetail } from "../housing-detail";

export async function HousingDetailPageContent({
  id,
  isAdmin = false,
}: {
  id: string;
  isAdmin?: boolean;
}) {
  void isAdmin;
  const listing = await getHousingListing(id);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialIsFavorite = false;
  if (user?.id) {
    const savedRows = await getSavedHousing(user.id);
    initialIsFavorite = (savedRows ?? []).some(
      (row) => String(row.housing_id) === String(id),
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HousingDetail
        listing={listing}
        userId={user?.id ?? null}
        initialIsFavorite={initialIsFavorite}
      />
    </div>
  );
}
