import { DiscoveryNavbar } from "./_components/discovery-navbar";

export default function DiscoveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col font-sans dark:bg-black">
      <header className="shrink-0 bg-background/80 px-4 py-3 backdrop-blur-sm">
        <DiscoveryNavbar />
      </header>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
