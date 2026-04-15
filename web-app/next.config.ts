import type { NextConfig } from "next";

function supabaseImageHostname(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return undefined;
  try {
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
}

const supabaseHost = supabaseImageHostname();

const supabaseStoragePatterns = [
  {
    protocol: "https" as const,
    hostname: "*.supabase.co",
    pathname: "/storage/v1/object/public/**",
  },
  ...(supabaseHost
    ? [
        {
          protocol: "https" as const,
          hostname: supabaseHost,
          pathname: "/storage/v1/object/public/**",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseStoragePatterns,
  },
};

export default nextConfig;
