"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
  "use server";
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
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (data.session) {
    redirect("/profile");
  }

  redirect(
    "/signup?message=" +
      encodeURIComponent("Check your email to confirm your account."),
  );
}