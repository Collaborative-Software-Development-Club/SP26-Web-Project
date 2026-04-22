"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function DiscoveryNavbar() {
  const pathname = usePathname();
  const isDiscovery = pathname === "/discovery";
  const isLikedYou = pathname === "/discovery/liked-you";

  return (
    <nav
      className="mx-auto flex flex-col items-center justify-center w-full max-w-4xl gap-4 mt-6"
      aria-label="Discovery sections"
    >
      <div className="relative flex w-64 lg:w-72 rounded-full bg-muted p-1 text-sm font-medium lg:text-base">
        <Link
          href="/discovery"
          className={`relative z-10 flex flex-1 items-center justify-center rounded-full py-1.5 transition-colors ${
            isDiscovery
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {isDiscovery && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 rounded-full bg-background shadow-sm"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">Discovery</span>
        </Link>
        
        <Link
          href="/discovery/liked-you"
          className={`relative z-10 flex flex-1 items-center justify-center rounded-full py-1.5 transition-colors ${
            isLikedYou
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {isLikedYou && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 rounded-full bg-background shadow-sm"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">Liked You</span>
        </Link>
      </div>
      <hr className="w-full max-w-md" />
    </nav>
  );
}