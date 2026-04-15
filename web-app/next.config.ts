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

const nextConfig: NextConfig = {
  ...(supabaseHost && {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: supabaseHost,
          pathname: "/storage/v1/object/public/**",
        },
      ],
    },
  }),
};

export default nextConfig;
