"use client";

import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProfileHeader } from "./_components/profile-header";

export default function ProfilePage() {
  const { user, profile } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !profile) {
      router.replace("/profile/create-profile");
    }
  }, [user, profile, router]);

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-50 p-8 dark:bg-black">
        <p className="text-muted-foreground">
          <Link href="/login" className="text-primary underline">
            Sign in
          </Link>{" "}
          to view your profile.
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-muted-foreground">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="h-full justify-center bg-zinc-50 font-sans dark:bg-black">
      <ProfileHeader profile={profile} />
    </div>
  );
}
