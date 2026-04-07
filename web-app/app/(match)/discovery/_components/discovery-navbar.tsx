"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DiscoveryNavbar() {
  const pathname = usePathname();
  const isDiscovery = pathname === "/discovery";
  const isLikedYou = pathname === "/discovery/liked-you";

  return (
    <nav
      className="mx-auto flex flex-col items-center justify-center w-full max-w-4xl flex-col gap-2 mt-6"
      aria-label="Discovery sections"
    >
      <div className="flex flex-row items-center justify-center gap-3 font-medium">
        <Link
          href="/discovery"
          className={
            isDiscovery
              ? "text-foreground underline decoration-primary underline-offset-4"
              : "text-muted-foreground hover:text-foreground"
          }
        >
          Discovery
        </Link>
        <span className="text-muted-foreground" aria-hidden>
          |
        </span>
        <Link
          href="/discovery/liked-you"
          className={
            isLikedYou
              ? "text-foreground underline decoration-primary underline-offset-4"
              : "text-muted-foreground hover:text-foreground"
          }
        >
          Liked You
        </Link>
      </div>
      <hr className="max-w-md w-full" />
    </nav>
  );
}
