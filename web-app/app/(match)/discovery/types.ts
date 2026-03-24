import type { UserProfile } from "@/app/(profile)/types";

export type DiscoveryProfile = UserProfile & {
    match_score: number;
};

export type LikedYouProfile = UserProfile & {
    message: string;
};

export type HistoryProfile = UserProfile & {
    action: string;
    message: string;
    created_at: string;
    matched: boolean;
};

export type RoommatePreference = {
    preference_id: string;
    importance: number;
    name: string;
}

export const YesNoPreferences = ["Smoker", "Pets"];