import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";
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

export async function getAdminStatus(user: User | null): Promise<boolean> {
  if (!user) return false;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("housing_admin")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) {
    console.error(error);
    return false;
  }
  return data?.isAdmin ?? false;
}