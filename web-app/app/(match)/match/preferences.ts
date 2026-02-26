"use server";

import { createClient } from "@/lib/supabase/server";

// Gets users preference table
export async function getUserPreference(targetUserId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("discovery_roommate_preferences")
    .select("preference_id");

  if (error) {
    console.error("Error:", error.message);
  } else {
    const preferenceIds = data.map((item) => item.preference_id);
    console.log("List of Preference IDs:", preferenceIds);
  }
}
