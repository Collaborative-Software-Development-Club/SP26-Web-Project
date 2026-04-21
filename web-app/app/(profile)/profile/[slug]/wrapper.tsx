"use client";

import { useUser } from "@/contexts/UserContext";
import { ProfilePage } from "../_components/profile-page";
import { ProfileHeader } from "../_components/profile-header";
import { UserProfile } from "../../types";

/**
 * Client-side wrapper of the slugged profile page, so that we can check if the
 * profile to display is the same as the signed in user. If it is, we show edit
 * features and show the full profile.
 */
export default function ProfilePageWrapper({ profileToDisplay }: { profileToDisplay: UserProfile } ) {
    const { user, profile } = useUser();
    
    console.log("Signed in user: " + JSON.stringify(profile));
    console.log("User to display: " + JSON.stringify(profileToDisplay));

    if (profile && profile.user_id === profileToDisplay.user_id) {
        return <ProfileHeader profile={profileToDisplay}/>
    } else {
        return <ProfilePage profile={profileToDisplay} showEditFeatures={false} />
    }

}
