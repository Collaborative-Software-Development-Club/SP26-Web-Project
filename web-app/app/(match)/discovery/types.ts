export type UserProfile = {
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
  };

export type DiscoveryProfile = UserProfile & {
    match_score: number;
};

export type LikedYouProfile = UserProfile & {
    message: string;
};

export type RoommatePreference = {
    preference_id: string;
    importance: number;
    name: string;
}

export type Preference = {
    preference_id: string;
    name: string;
    value: number;
};

export const YesNoPreferences = ["Smoker", "Pets"];