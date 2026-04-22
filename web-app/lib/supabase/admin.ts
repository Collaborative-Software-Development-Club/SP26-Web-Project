import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client for server-only operations (e.g. delete user).
 * Never import this into client components. Requires SUPABASE_SERVICE_ROLE_KEY
 * in the server environment (Supabase → Project Settings → API).
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL for Supabase service-role client."
    );
  }

  if (!key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY for Supabase service-role client."
    );
  }

  try {
    new URL(url);
  } catch {
    throw new Error(
      "Invalid NEXT_PUBLIC_SUPABASE_URL for Supabase service-role client."
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
