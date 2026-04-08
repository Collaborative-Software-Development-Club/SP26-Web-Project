'use client'
/*Create profile header that displays the name, email, bio, pfp of the user. 
Include ways to be able to edit these fields.
*/
//
import ProfileHeader from "./_components/profile-header";
import type { UserProfile } from "@/app/(profile)/types";
import { useUser } from "@/contexts/UserContext";
export default function Profile() {
  const {user, profile} = useUser();

  return (
    <div className="h-full justify-center bg-zinc-50 font-sans dark:bg-black">
      <ProfileHeader profile={profile} />
    </div>
  );
}
