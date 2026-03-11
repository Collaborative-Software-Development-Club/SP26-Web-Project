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

export async function getPreferenceIds(preferences: Preference[]): Promise<Record<string, string>> {
    const supabase = await createClient();
    const preference_names: string[] = preferences.map(p => p.name);

    const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .in("name", preference_names)

    if (error) throw new Error("Error getting preferences");
    if (!data) throw new Error("Could not retrieve preference IDs");

    const preference_ids: Record<string, string> = data.reduce<Record<string,string>>((acc, pref) => {
        acc[pref.name] = pref.value;
        return acc;
    }, {});

    return preference_ids;
}

export async function setPreferences(user_id: string, preferences: Preference[]) {
    const preference_ids: Record<string, string> = await getPreferenceIds(preferences);
    const supabase = await createClient();
    const preferencesWID = preferences.map(p => ({
        preference_id: preference_ids[p.name],
        value: p.value
    }))

    const {error} = await supabase
    .from("user_profile_preferences")
    .insert(preferencesWID);

    if (error) throw new Error("Error updating user preferences");
}
