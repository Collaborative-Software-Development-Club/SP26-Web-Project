import { getHousingListing } from "../_actions";
import { HousingDetail } from "../_components/housing-detail";
import { createClient } from "@/lib/supabase/server";

export default async function HousingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getHousingListing(id);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <HousingDetail listing={listing} userId={user?.id ?? null} />;
}