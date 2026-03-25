import { DiscoveryNavbar } from "./_components/discovery-navbar";

export default function DiscoveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center font-sans dark:bg-black gap-4">
      <DiscoveryNavbar />
      {children}
    </div>
  );
}
