import { getUserProfiles } from "@/lib/services/profile";
import ProfilePageWrapper from "./wrapper";

export default async function ProfilePageId({ params }: { params: Promise<{ id: string }>}) {
    const { id } = await params;
    
    if (id === undefined) {
        throw new Error("No id provided");
    }

    const profiles = await getUserProfiles([id]);
    if (profiles.length === 0) {
        throw new Error("No user found");
    }

    return <>
        <ProfilePageWrapper profileToDisplay={profiles[0]} />
    </>
}
