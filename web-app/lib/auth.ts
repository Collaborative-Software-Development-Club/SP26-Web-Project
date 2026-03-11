import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "@/app/(profile)/types";

export async function requireAuth() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    return user;
  }

export async function requireUser(): Promise<UserProfile> {
    const user = await requireAuth();
    const supabase = await createClient();
    
    const { data, error } = await supabase
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
                preference_id,
                name,
                value
            ),
            user_profile_hobbies (
                name
            )
        `)
        .eq('user_id', user.id)
        .single();
    
    if (error || !data) {
        redirect('/create-profile');
    }
    
    const profile: UserProfile = {
        ...data,
        preferences: data.user_profile_preferences ?? [],
        hobbies: data.user_profile_hobbies?.map((h: {name: string}) => h.name) ?? []
    };
    
    return profile;
}