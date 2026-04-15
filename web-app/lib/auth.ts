import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/app/(profile)/types";
import { getUserProfiles } from "./services/profile";

export async function requireAuth() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    return user;
  }

export async function requireUser(): Promise<UserProfile> {
    const user = await requireAuth();
  const userProfile = (await getUserProfiles([user.id])).at(0);
  if (!userProfile) {
    redirect("/profile/create-profile");
  }
  return userProfile as UserProfile;
}