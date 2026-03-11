import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/app/(profile)/types";

export async function getUserProfiles(user_ids: string[]): Promise<UserProfile[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
  .from("user_profile_aggregated_view")
  .select("*")  
  .in("user_id", user_ids);
    
    if (error) throw new Error("Error getting user profiles");
    if (!data) throw new Error("No data returned from getUserProfiles");

    return data;
}