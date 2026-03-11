import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "./services/profile";
import { getUserProfiles } from "./services/profile";
import { User } from "@supabase/supabase-js";

export async function requireAuth() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    return user;
  }

export async function requireUser(): Promise<UserProfile> {
    const user = await requireAuth();
    const userProfile = (await getUserProfiles([user.id])).at(0);
    return userProfile as UserProfile
}