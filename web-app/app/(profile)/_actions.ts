"use server";

import { revalidatePath } from "next/cache";
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
    await supabase.auth.signOut();
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (data.session) {
    redirect("/profile");
  }
  
  console.log("signup user id:", data.user?.id);
  console.log("signup session exists:", !!data.session);
  console.log("email confirmed at:", data.user?.email_confirmed_at);

  redirect(
    `/confirm?message=${encodeURIComponent(
      "Check your email and click the confirmation link to finish signing up.",
    )}&email=${encodeURIComponent(email)}`,
  );
}

export async function verifyAction(token: string, email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    email: email,
    token: token,
    type: "signup",
  });
  if(error) {
    await supabase.auth.signOut();
    redirect(`/confirm?error=${encodeURIComponent(error.message)}&email=${encodeURIComponent(email)}`);
  }
}
/**
 * Saves a profile for the signed-in user. `avatar_url` should match storage if the user set a photo from the client.
 */
export async function saveProfileAction(profile: UserProfile) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error: profileError } = await supabase.from("user_profiles").upsert([
    {
      user_id: user.id,
      is_active: true,
      bio: profile.bio,
      year: profile.year,
      avatar_url: profile.avatar_url || null,
      fname: profile.fname,
      lname: profile.lname,
      gender: profile.gender,
    },
  ]);

  if (profileError) {
    return { error: "Failed to save profile: " + profileError.message };
  }

  const { error: clearMajorsError } = await supabase
    .from("user_profile_majors")
    .delete()
    .eq("user_id", user.id);

  if (clearMajorsError) {
    return {
      error: "Failed to update majors: " + clearMajorsError.message,
    };
  }

  const { error: majorsError } =
    profile.majors.length > 0
      ? await supabase.from("user_profile_majors").insert(
          profile.majors.map((m) => ({
            user_id: user.id,
            major_id: m.major_id,
          })),
        )
      : { error: null };

  if (majorsError) {
    return { error: "Failed to save majors: " + majorsError.message };
  }

  const { error: clearHobbiesError } = await supabase
    .from("user_profile_hobbies")
    .delete()
    .eq("user_id", user.id);

  if (clearHobbiesError) {
    return {
      error: "Failed to update hobbies: " + clearHobbiesError.message,
    };
  }

  const { error: hobbiesError } =
    profile.hobbies.length > 0
      ? await supabase.from("user_profile_hobbies").insert(
          profile.hobbies.map((h) => ({
            user_id: user.id,
            hobby_id: h.hobby_id,
          })),
        )
      : { error: null };

  if (hobbiesError) {
    return { error: "Failed to save hobbies: " + hobbiesError.message };
  }

  const { error: clearPreferencesError } = await supabase
    .from("user_profile_preferences")
    .delete()
    .eq("user_id", user.id);

  if (clearPreferencesError) {
    return {
      error: "Failed to update preferences: " + clearPreferencesError.message,
    };
  }

  const { error: preferencesError } =
    profile.preferences.length > 0
      ? await supabase.from("user_profile_preferences").insert(
          profile.preferences.map((p) => ({
            user_id: user.id,
            preference_id: p.preference_id,
            value: p.value,
          })),
        )
      : { error: null };

  if (preferencesError) {
    return { error: "Failed to save preferences: " + preferencesError.message };
  }

  const { error: filterError } = await supabase
    .from("discovery_profile_filters")
    .upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true });

  if (filterError) {
    return { error: "Failed to save filters: " + filterError.message };
  }

  const { error: preferenceFilterError } =
    profile.preferences.length > 0
      ? await supabase
          .from("discovery_roommate_preferences")
          .upsert(
            profile.preferences.map((p) => ({
              user_id: user.id,
              preference_id: p.preference_id,
              importance: 3,
            })),
            { onConflict: "user_id,preference_id", ignoreDuplicates: true },
          )
      : { error: null };
      
  if (preferenceFilterError) {  
    return { error: "Failed to save preferences: " + preferenceFilterError.message };
  }

  revalidatePath("/profile");
  revalidatePath("/profile/create-profile");

  return { error: null };
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
  | {
      majorData: Major[];
      hobbiesData: HobbyCategoryGroup[];
      preferencesData: Preference[];
    }
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

  const { data: hobbiesData, error: hobbiesError } = await supabase.from(
    "user_hobbies",
  ).select(`
    hobby_id,
    name,
    user_hobby_categories(name)
  `);

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

export async function updateProfile(profile: UserProfile) {
  const result = await saveProfileAction(profile);
  if (result.error) {
    throw new Error(result.error);
  }
}
