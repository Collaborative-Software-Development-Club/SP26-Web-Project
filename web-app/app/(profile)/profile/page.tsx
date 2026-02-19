import { requireAuth } from "@/lib/auth";
/*Create profile header that displays the name, email, bio, pfp of the user. 
Include ways to be able to edit these fields.
*/
//
import SideBar from './profile-components/side-bar'
import ProfilePage from './profile-components/profile-page'
import ProfileHeader from "./profile-header";
export default async function Profile() {
  const user = await requireAuth();

  return (
    <div className="min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <ProfileHeader/>
    </div>
  );
}
