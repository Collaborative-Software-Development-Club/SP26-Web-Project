import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client for server-only operations (e.g. delete user).
 * Never import this into client components. Requires SUPABASE_SERVICE_ROLE_KEY
 * in the server environment (Supabase → Project Settings → API).
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    return null;
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
