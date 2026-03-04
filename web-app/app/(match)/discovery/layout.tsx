import { DiscoveryNavbar } from "./_components/discovery-navbar";

export default function DiscoveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <DiscoveryNavbar />
      {children}
    </div>
  );
}
