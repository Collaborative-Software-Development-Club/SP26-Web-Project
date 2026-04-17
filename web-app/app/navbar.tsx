"use client";

import { signOut } from "@/app/(profile)/_actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";



export function Navbar({ user, isAdmin = false }: {user: User | null;  isAdmin?: boolean;}) {
  const isSignedIn = user !== null;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = isSignedIn
    ? [
        { href: "/discovery", label: "Match" },
        { href: "/chat", label: "Chat" },
        { href: "/housing", label: "Housing" },
        { href: "/profile", label: "My Profile" },
        ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
      ]
    : [
        { href: "/housing", label: "Housing" },
        { href: "/login", label: "Login" },
        { href: "/signup", label: "Sign Up" },
      ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 p-2 shadow-sm backdrop-blur-sm dark:bg-zinc-900/90">
      <div className="flex w-full items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8 md:py-4">
        <Link href="/" className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold text-primary sm:text-xl md:text-2xl">
            OSU Roommate Finder
          </h1>
        </Link>

        <nav
          className="hidden flex-wrap items-center gap-2 md:flex md:gap-4"
          aria-label="Main"
        >
          {navLinks.map((link) => {
            const isActive = pathname.includes(link.href);
            return (
              <Button
                asChild
                key={link.href}
                variant={isActive ? "outline" : "ghost"}
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

        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="size-5" />
            </Button>
          </DialogTrigger>
          <DialogContent
            showCloseButton
            className={cn(
              "fixed top-0 right-0 left-auto h-full max-h-[100dvh] w-full max-w-sm translate-x-0 translate-y-0 gap-0 rounded-none border-y-0 border-r-0 p-0 shadow-xl",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-200",
            )}
          >
            <DialogTitle className="sr-only">Main menu</DialogTitle>
            <div className="flex h-full flex-col gap-4 p-6 pt-14">
              <nav
                className="flex flex-col gap-1"
                aria-label="Main"
              >
                {navLinks.map((link) => {
                  const isActive = pathname.includes(link.href);
                  return (
                    <Button
                      asChild
                      key={link.href}
                      variant={isActive ? "outline" : "ghost"}
                      className="h-11 w-full justify-start"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </Button>
                  );
                })}
              </nav>
              {isSignedIn && (
                <form action={signOut} className="mt-auto border-t pt-4">
                  <Button type="submit" className="w-full" variant="secondary">
                    Sign Out
                  </Button>
                </form>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
