import { requireAuth } from "@/lib/auth";
/*Create profile header that displays the name, email, bio, pfp of the user. 
Include ways to be able to edit these fields.
*/
//
import ProfileHeader from "./profile-components/profile-header";
export default async function Profile() {
  const user = await requireAuth();

  return (
    <div className="h-full justify-center bg-zinc-50 font-sans dark:bg-black">
      <ProfileHeader/>
    </div>
  );
}
