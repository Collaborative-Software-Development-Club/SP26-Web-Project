import { HousingDetailPageContent } from "../_components/server/housing-detail-page-content";

export default async function HousingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <HousingDetailPageContent id={id} />;
}