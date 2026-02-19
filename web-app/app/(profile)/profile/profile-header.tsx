"use client"
/*Create profile header that displays the name, email, bio, pfp of the user. 
Include ways to be able to edit these fields.
*/
//
import SideBar from './profile-components/side-bar'
import ProfilePage from './profile-components/profile-page'
import SettingsPage from './profile-components/settings-page';
import BioPage from './profile-components/bio-page';
import { useState } from 'react';
//type Page = "profile" | "bio" | "settings";
export default function ProfileHeader() {
  const [page,setPage] = useState("profile");

  return (
    <div className="flex flex-row h-175">
        <SideBar setPage={setPage}/>
        {page === "profile" && <ProfilePage/>}
        {page === "bio" && <BioPage/>}
        {page === "settings" && <SettingsPage/>}
    </div>
  )
}
