"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { signOut } from "@/app/(profile)/_actions";

export function Navbar({ user }: { user: User | null }) {
  const isSignedIn = user !== null;
  const pathname = usePathname();
  const navLinks = isSignedIn
    ? [
        { href: "/discovery", label: "Match" },
        { href: "/chat", label: "Chat" },
        { href: "/housing", label: "Housing" },
        { href: "/profile", label: "My Profile" },
      ]
    : [
        { href: "/housing", label: "Housing" },
        { href: "/login", label: "Login" },
        { href: "/signup", label: "Sign Up" },
      ];

  return (
    <header className="sticky top-0 z-50 p-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm shadow-sm">
      <div className="w-full px-8 py-4 items-center justify-between flex flex-row">
        <Link href="/" className="flex items-center gap-5">
          <h1 className="text-2xl font-bold text-primary">
            OSU Roommate Finder
          </h1>
        </Link>

        <nav className="flex flex-wrap items-center gap-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Button
                asChild
                key={link.href}
                variant={isActive ? "secondary" : "ghost"}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            );
          })}

          {isSignedIn && (
            <form action={signOut}>
              <Button type="submit">Sign Out</Button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
