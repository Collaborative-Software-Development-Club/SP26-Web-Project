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
import {motion} from "framer-motion";



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
        //{ href: "/login", label: "Login" },
        //{ href: "/signup", label: "Sign Up" },
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
          className="hidden flex-wrap items-center gap-2 rounded-full md:flex md:gap-4 bg-muted/40 p-1 border border/50 shadow-sm"
          aria-label="Main"
        >
          {navLinks.map((link) => {
            const isActive = pathname.includes(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-5 py-2 text-sm font-medium transition-colors outline-none",
                  isActive
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-pill"
                    className = "absolute inset-0 rounded-full bg-background shadow-sm border border-border/50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5}}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
            
          <div className="pl-2 border-l border-border/50 ml-1">
            {isSignedIn ? (
                <form action={signOut}>
                  <Button 
                    type="submit" 
                    className="rounded-full h-9 px-4 hover:bg-red-100 hover:text-red-700 dark:bg-red-950/30 dark:hover:bg-red-900/50"
                  >
                    Sign Out
                  </Button>
                </form>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-full h-9 px-4 hover:bg-muted"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full h-9 px-4 hover:bg-red-100 hover:text-red-700 dark:bg-red-950/30 dark:hover:bg-red-900/50"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
         </div>
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
              <nav className="flex flex-col gap-1" aria-label="Main">
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
              <div className="mt-auto flex flex-col gap-2 border-t pt-10 pb-4">
                {isSignedIn ? (
                <form action={signOut} className="mt-auto">
                  <Button type="submit" className="w-full" variant="secondary">
                    Sign Out
                  </Button>
                </form>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="w-full ">
                      <Link href="/signup" onClick={() => setMobileOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
