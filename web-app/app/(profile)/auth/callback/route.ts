import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNextPath(next: string | null) {
  if (!next) return "/profile";
  // Disallow backslashes to avoid ambiguous URL parsing across environments.
  if (next.includes("\\")) return "/profile";
  // Require an absolute path within this origin and disallow protocol-relative-style prefixes.
  if (!next.startsWith("/") || /^\/{2,}/.test(next)) return "/profile";
  return next;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
  }

  return NextResponse.redirect(
    new URL(
      `/login?error=${encodeURIComponent(
        "Could not confirm your email. Please try again or request a new link.",
      )}`,
      url.origin,
    ),
  );
}

