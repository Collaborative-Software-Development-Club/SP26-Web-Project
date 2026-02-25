import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import { create } from "domain";
import { userInfo } from "os";

type Preference = {
    name: string,
    value: number
}

export interface UserProfile {
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
            preferences (
                name,
                value
            ),
            hobbies (
                name
            )
        `)
        .in('user_id', user_ids);
    
    if (error) throw error;

    const profiles: UserProfile[] = data.map(row => ({
        ...row,
        preferences: row.preferences ?? [],
        hobbies: row.hobbies?.map((h: {name: string}) => h.name) ?? []
    }));

    return profiles;
}

export async function GetAllUserProfiles() {
    const supabase = await createClient();
    
    const {data, error} = await supabase
        .from('user_profiles')
        .select(`
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
            preferences (
                name,
                value
            ),
            hobbies (
                name
            )
        `)
    
    if (error) throw error;

    const profiles: UserProfile[] = data.map(row => ({
        ...row,
        preferences: row.preferences ?? [],
        hobbies: row.hobbies?.map((h: {name: string}) => h.name) ?? []
    }));

    return profiles;
}

export async function getPotentialMatches(user_id: string) {
    const userData: UserProfile[] = await GetAllUserProfiles();

}

export async function getPreferences(preference_id: string): Promise<Preference> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("preferences")
        .select(`name, value`)
        .eq("id", preference_id)
        .single();

    if (error) throw error;
    if (!data) throw new Error("Preference not found");

    return data as Preference;
}