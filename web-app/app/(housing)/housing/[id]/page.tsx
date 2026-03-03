import { getHousingListing } from "../_actions";
import { HousingDetail } from "../_components/housing-detail";

export default async function HousingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const listing = await getHousingListing(params.id);
  return <HousingDetail listing={listing} />;
}