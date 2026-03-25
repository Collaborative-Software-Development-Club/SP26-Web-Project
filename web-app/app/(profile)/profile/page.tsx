import { requireAuth, requireUser } from "@/lib/auth";
/*Create profile header that displays the name, email, bio, pfp of the user. 
Include ways to be able to edit these fields.
*/
//
import type { UserProfile } from "@/app/(profile)/types";
import SideBar from "./dashboard/sidebar";
export default async function Profile() {
  const user: UserProfile = await requireUser();

  return (
    <div className="h-full justify-center bg-zinc-50 font-sans dark:bg-black">
      <SideBar profile={user} />
    </div>
  );
}
