"use client";

import { useUser } from "@/contexts/UserContext";
import { ProfilePage } from "../_components/profile-page";
import { UserProfile } from "../../types";
import { redirect } from "next/navigation";

/**
 * Client-side wrapper of the slugged profile page, so that we can check if the
 * profile to display is the same as the signed in user. If it is, we show edit
 * features and show the full profile.
 */
export default function ProfilePageWrapper({ profileToDisplay }: { profileToDisplay: UserProfile } ) {
    const { profile } = useUser();

    if (profile && profile.user_id === profileToDisplay.user_id) {
        redirect("/profile");
    } else {
        return <ProfilePage profile={profileToDisplay} showEditFeatures={false} />
    }

}
