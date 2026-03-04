"use server";
//Checking if this triggers the CodeOwner review

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GetAllUserProfiles } from "@/lib/services/profile";

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

export async function createProfileAction(formData: FormData) {
  const fname = formData.get("fname") as string;
  const lname = formData.get("lname") as string;
  const gender = formData.get("gender") as string;
  const bio = formData.get("bio") as string;
  const major = formData.get("major") as string;
  const year = formData.get("year") as string;

  if (!fname || !lname || !gender || !bio || !major || !year) {
    return { error: "All fields are required" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("user_profiles")
    .insert([
      {
        user_id: user.id,
        is_active: true,
        fname,
        lname,
        gender,
        bio,
        major,
        year: parseInt(year),
        avatar_url: "",
        created_at: now,
        last_edited_at: now,
      },
    ]);

  if (error) {
    return { error: error.message };
  }
  
  redirect("/profile");
}