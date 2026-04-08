import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "./navbar";
import { data } from "framer-motion/client";
import UserProvider from "@/contexts/UserProvider";
import { User } from "lucide-react";

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

// app/layout.tsx
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;

  if (user) {
    const { data } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

    profile = data;
  }

  console.log("User in RootLayout:", user);
  console.log("Profile in RootLayout:", profile);

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
