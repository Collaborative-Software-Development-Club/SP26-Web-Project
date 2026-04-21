"use server";

import { getUserProfiles } from "@/lib/services/profile";
import ProfilePageWrapper from "./wrapper";

export default async function ProfilePageSlug({ params }: { params: { slug: string }}) {
    let { slug } = await params;
    
    if (slug === undefined) {
        throw new Error("No slug provided idk");
    }

    const profiles = await getUserProfiles([slug]);
    if (profiles.length === 0) {
        throw new Error("No user found");
    }

    return <>
        <ProfilePageWrapper profileToDisplay={profiles[0]} />
    </>
}
