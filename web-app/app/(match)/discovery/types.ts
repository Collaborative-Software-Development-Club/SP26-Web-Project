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
    preferences: PreferenceWithName[];
  };

export type LikedYouProfile = UserProfile & {
    message: string;
};

export type RoommatePreferenceWithName = {
    preference_id: string;
    importance: number;
    name: string;
}

export type Preference = {
    preference_id: string;
    value: number;
};

export type PreferenceWithName = {
    preference_id: string;
    name: string;
    value: number;
};