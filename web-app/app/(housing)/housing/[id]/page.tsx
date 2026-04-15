import { getHousingListing } from "../_actions";
import { HousingDetail } from "../_components/housing-detail";

export default async function HousingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getHousingListing(id);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HousingDetail listing={listing} />
    </div>
  );
}