import { createBrowserClient } from '@supabase/ssr'

/** Re-export so callers can use Supabase browser client API by name without importing `@supabase/ssr` directly. */
export { createBrowserClient } from '@supabase/ssr'

function getSupabaseBrowserEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!url || !key) {
    throw new Error(
      "Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL and a key (PUBLISHABLE_KEY or ANON_KEY).",
    )
  }
  return { url, key }
}

export function createClient() {
  const { url, key } = getSupabaseBrowserEnv()
  return createBrowserClient(url, key)
}
