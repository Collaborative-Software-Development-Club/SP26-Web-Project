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


export async function getPotentialMatches(preference_ids: string[]): Promise<UserProfile[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    const { data, error } = await supabase
  .rpc("get_potential_matches", {
    preference_ids,
    user_id: user.id
  })
    .select("*");

    if (error) throw new Error("Error getting potential matches");
    if (!data) throw new Error("No data returned from getPotentialMatches");

    return data;
}

export async function getPreferences(preference_ids: string[]): Promise<PreferenceWithId[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("user_preferences")
        .select(`id, name, value`)
        .in("id", preference_ids);

    if (error) throw error;
    if (!data) throw new Error("Preference not found");

    return data.map((p: { id: string; name: string; value: number }) => ({ preference_id: p.id, name: p.name, value: p.value }));
}   