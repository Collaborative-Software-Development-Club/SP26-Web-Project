import { createClient } from "@/lib/supabase/server";

type Preference = {
    name: string,
    value: number
}

type PreferenceWithId = {
    preference_id: string;
    name: string;
    value: number;
}

export interface UserProfile {
    user_id: string;
    is_active: boolean;
    fname: string;
    lname: string;
    gender: string;
    avatar_url: string;
    bio: string;
    major: string;
    year: number;
    created_at: string;
    last_edited_at: string;
    hobbies: string[];
    preferences: Preference[];
}

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
