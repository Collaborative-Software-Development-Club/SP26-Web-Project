import type { UserProfile } from "@/app/(profile)/types";

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

export type ProfileFilter = {
    use_major: boolean;
    use_year: boolean;
    use_gender: boolean;
}

export type DiscoveryFilter = {
    roommate_preferences: RoommatePreference[];
    profile_filters: ProfileFilter;
    hobby_filters: string[];
}

export const YesNoPreferences = ["Smoker", "Pets"];