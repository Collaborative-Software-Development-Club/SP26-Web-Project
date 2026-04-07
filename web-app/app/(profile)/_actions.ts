"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  Hobby,
  HobbyCategoryGroup,
  Major,
  Preference,
  UserProfile,
} from "./types";

const OSU_EMAIL_REGEX = /^[a-z]+\.[0-9]+@osu\.edu$/;

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return;
  }

  if (!OSU_EMAIL_REGEX.test(email)) {
    redirect(
      `/login?error=${encodeURIComponent("You must use an OSU email address")}`,
    );
  }

  if (password.length < 6) {
    redirect(
      `/login?error=${encodeURIComponent("Password must be at least 6 characters")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/profile");
}

export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return;
  }
  if (!OSU_EMAIL_REGEX.test(email)) {
    redirect(
      `/signup?error=${encodeURIComponent("You must use an OSU email address")}`,
    );
  }

  if (password.length < 6) {
    redirect(
      `/signup?error=${encodeURIComponent("Password must be at least 6 characters")}`,
    );
  }

  const supabase = await createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback?next=/profile`,
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (data.session) {
    redirect("/profile");
  }

  redirect(
    `/confirm?message=${encodeURIComponent(
      "Check your email and click the confirmation link to finish signing up.",
    )}`,
  );
}

/**
 * Saves a profile for the signed-in user
 */
export async function saveProfileAction(profile: UserProfile) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error: profileError } = await supabase
    .from("user_profiles")
    .upsert([
      {
        user_id: user.id,
        is_active: true,
        bio: profile.bio,
        year: profile.year,
        avatar_url: profile.avatar_url,
        fname: profile.fname,
        lname: profile.lname,
        gender: profile.gender,
      },
    ]);

  if (profileError) {
    return { error: "Failed to save profile: " + profileError.message };
  }

  const { error: majorsError } = await supabase
    .from("user_profile_majors")
    .upsert(profile.majors.map(m => ({
      user_id: user.id,
      major_id: m.major_id,
    })), { onConflict: "user_id, major_id" });

  if (majorsError) {
    return { error: "Failed to save majors: " + majorsError.message };
  }

  const { error: hobbiesError } = await supabase
    .from("user_profile_hobbies")
    .upsert(profile.hobbies.map(h => ({
      user_id: user.id,
      hobby_id: h.hobby_id,
    })), { onConflict: "user_id, hobby_id" });

  if (hobbiesError) {
    return { error: "Failed to save hobbies: " + hobbiesError.message };
  }

  const { error: preferencesError } = await supabase
    .from("user_profile_preferences")
    .upsert(profile.preferences.map(p => ({
      user_id: user.id,
      preference_id: p.preference_id,
      value: p.value,
    })), { onConflict: "user_id, preference_id" });

  if (preferencesError) {
    return { error: "Failed to save preferences: " + preferencesError.message };
  }

  return { ok: true };
}


/** Supabase may return one object or an array for embedded FK rows. */
type EmbeddedCategoryName = { name: string };

type UserHobbyRow = {
  hobby_id: number | string;
  name: string;
  user_hobby_categories?: EmbeddedCategoryName | EmbeddedCategoryName[] | null;
};

function categoryNameFromEmbed(
  embed: EmbeddedCategoryName | EmbeddedCategoryName[] | null | undefined,
): string {
  if (embed == null) return "uncategorized";
  if (Array.isArray(embed)) {
    return embed[0]?.name?.trim() || "uncategorized";
  }
  return embed.name?.trim() || "uncategorized";
}

/** Group hobbies by category (nested `user_hobby_categories.name` from Supabase). */
function groupHobbiesData(rows: UserHobbyRow[]): HobbyCategoryGroup[] {
  const groups = new Map<string, Hobby[]>();

  for (const row of rows) {
    const category = categoryNameFromEmbed(row.user_hobby_categories);
    const hobbyId = String(row.hobby_id);
    const list = groups.get(category) ?? [];
    list.push({ hobby_id: hobbyId, name: row.name });
    groups.set(category, list);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, hobbies]) => ({ category, hobbies }));
}

/** Return all the major, hobby and preference choices **/
export async function getMajorsHobbiesPreferences(): Promise<
  | { error: string }
  | { majorData: Major[]; hobbiesData: HobbyCategoryGroup[]; preferencesData: Preference[] }
> {
  const supabase = await createClient();

  const { data: majorsData, error: majorsError } = await supabase
    .from("user_majors")
    .select("major_id, name")
    .order("name", { ascending: true });

  if (majorsError) {
    return { error: majorsError.message };
  }

  const { data: preferencesData, error: preferencesError } = await supabase
    .from("user_preferences")
    .select("*");

  if (preferencesError) {
    return { error: preferencesError.message };
  }

  const { data: hobbiesData, error: hobbiesError } = await supabase
  .from("user_hobbies")
  .select(`
    hobby_id,
    name,
    user_hobby_categories(name)
  `)


  if (hobbiesError) {
    return { error: hobbiesError.message };
  }

  const hobbies = groupHobbiesData((hobbiesData ?? []) as UserHobbyRow[]);
  
  return {
    majorData: majorsData,
    hobbiesData: hobbies,
    preferencesData: (preferencesData ?? []).map((p) => ({
      preference_id: p.preference_id,
      name: p.name,
      value: 0,
    })),
  };
}