import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { UserProfile } from "@/app/(profile)/types";
import { createClient } from "@/lib/supabase/server";
import { getUserProfiles } from "@/lib/services/profile";
import UserProvider from "@/contexts/UserProvider";
import { Navbar } from "./navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roommate Finder @OSU",
  description: "Find your perfect roommate at OSU",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: UserProfile | null = null;

  if (user) {
    const rows = await getUserProfiles([user.id]);
    const p = rows[0];
    if (p) {
      profile = {
        ...p,
        majors: p.majors ?? [],
      };
    }
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider user={user} profile={profile}>
          <div className="flex h-dvh min-h-0 w-full flex-col overflow-hidden">
            <Navbar user={user} />
            <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              {children}
            </main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
