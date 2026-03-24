"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DiscoveryNavbar() {
  const pathname = usePathname();
  const isDiscovery = pathname === "/discovery";
  const isLikedYou = pathname === "/discovery/liked-you";
  const isHistory = pathname === "/discovery/history";

  return (
    <div className="flex flex-col items-center justify-center w-3/4 my-4 max-w-sm ">
      <div className="flex flex-row justify-center gap-3">
        <Link
          href="/discovery"
          className={`${isDiscovery ? "text-black" : "text-gray-400"} hover:underline`}
        >
          Discovery
        </Link>
        <p className="text-gray-500">|</p>
        <Link
          href="/discovery/liked-you"
          className={`${isLikedYou ? "text-black" : "text-gray-400"} hover:underline`}
        >
          Liked You
        </Link>
        <p className="text-gray-500">|</p>
        <Link
          href="/discovery/history"
          className={`${isHistory ? "text-black" : "text-gray-400"} hover:underline`}
        >
          History
        </Link>
      </div>
      <hr className="max-w-md w-full" />
    </div>
  );
}
