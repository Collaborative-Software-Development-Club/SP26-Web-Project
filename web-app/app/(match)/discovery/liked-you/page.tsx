import { getLikedYouProfiles } from "../_actions";
import profiles from "@/mock/profiles.json";
import { LikedYouClient } from "./liked-you-client";
import { LikedYouProfile } from "../types";

export default async function LikedYouPage() {
  //const likedYouProfiles = await getLikedYouProfiles();

  return (
    <LikedYouClient
      initialLikedYouProfiles={
        profiles.map((profile) => ({
          ...profile,
          message:
            "I vibe with you! What housing options on campus are you interested in?",
        })) as LikedYouProfile[]
      }
    />
  );
}
