import { getLikedYouProfiles } from "../_actions";
import { LikedYouClient } from "./liked-you-client";

export default async function LikedYouPage() {
  const likedYouProfiles = await getLikedYouProfiles();

  return <LikedYouClient initialLikedYouProfiles={likedYouProfiles} />;
}
