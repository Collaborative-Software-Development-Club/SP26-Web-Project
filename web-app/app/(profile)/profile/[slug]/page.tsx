"use server";

import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import { ProfilePage } from "../_components/profile-page";
import { getUserProfiles } from "@/lib/services/profile";

export default async function ProfilePageSlug({ params }: { params: { slug: string }}) {
    let { slug } = await params;
    if (slug === undefined) {
        throw new Error("No slug provided idk");
    }
    const profiles = await getUserProfiles([slug]);
    if (profiles.length === 0) {
        throw new Error("No user found");
    }
    return (
            <ProfilePage profile={profiles[0]}/>
    );
}
