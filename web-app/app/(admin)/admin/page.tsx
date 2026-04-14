import { AdminHousingList } from "./_components/admin-housing-list";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Admin — Housing Listings</h1>
        <AdminHousingList />
      </div>
    </div>
  );
}