import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import { create } from "domain";
import { userInfo } from "os";

type Preference = {
    name: string,
    value: number
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
    
    const {data, error} = await supabase
        .from('user_profiles')
        .select(`
            user_id,
            is_active,
            fname,
            lname,
            gender,
            avatar_url,
            bio,
            major,
            year,
            created_at,
            last_edited_at,
            user_profile_preferences (
                name,
                value
            ),
            user_profile_hobbies (
                name
            )
        `)
        .in('user_id', user_ids);
    
    if (error) throw error;

    const profiles: UserProfile[] = data.map(row => ({
        ...row,
        preferences: row.user_profile_preferences ?? [],
        hobbies: row.user_profile_hobbies?.map((h: {name: string}) => h.name) ?? []
    }));

    return profiles;
}

export async function GetAllUserProfiles(): Promise<UserProfile[]> {
    const supabase = await createClient();
    
    const {data, error} = await supabase
        .from('user_profiles')
        .select(`
            user_id,
            is_active,
            fname,
            lname,
            gender,
            avatar_url,
            bio,
            major,
            year,
            created_at,
            last_edited_at,
            user_profile_preferences (
                name,
                value
            ),
            user_profile_hobbies (
                name
            )
        `)
    
    if (error) throw error;

    const profiles: UserProfile[] = data.map(row => ({
        ...row,
        preferences: row.user_profile_preferences ?? [],
        hobbies: row.user_profile_hobbies?.map((h: {name: string}) => h.name) ?? []
    }));

    return profiles;
}

export async function getPotentialMatches(): Promise<Preference[]> {
    const supabase = await createClient();

    const {data, error} = await supabase
        .from('user_preferences')
        .select(`name, value`)
        .order('random', { ascending: false })
        .limit(30);

    if (error) throw error;

    return data as Preference[];
}

export async function getPreference(preference_id: string): Promise<Preference> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("user_preferences")
        .select(`name, value`)
        .eq("id", preference_id)
        .single();

    if (error) throw error;
    if (!data) throw new Error("Preference not found");

    return data as Preference;
}

console.log(GetAllUserProfiles());