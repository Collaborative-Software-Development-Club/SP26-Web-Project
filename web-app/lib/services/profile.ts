import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/app/(profile)/types";

export function normalizeAggregatedProfile(row: Record<string, unknown>): UserProfile {
  const majorsRaw = row.majors ?? row.major;
  const majors = Array.isArray(majorsRaw)
    ? (majorsRaw as UserProfile["majors"])
    : [];
  const rest = { ...row };
  delete rest.major;
  return { ...rest, majors } as UserProfile;
}

export async function getUserProfiles(user_ids: string[]): Promise<UserProfile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_profile_aggregated_view")
    .select("*")
    .in("user_id", user_ids);

  if (error) throw new Error("Error getting user profiles");
  if (!data) throw new Error("No data returned from getUserProfiles");

  return data.map((row) => normalizeAggregatedProfile(row as Record<string, unknown>));
}