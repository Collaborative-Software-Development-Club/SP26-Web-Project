import { HousingDetailPageContent } from "../_components/server/housing-detail-page-content";

export default async function HousingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ admin?: string }>;
}) {
  const { id } = await params;
  const { admin } = await searchParams;
  return <HousingDetailPageContent id={id} isAdmin={admin === "1"} />;
}