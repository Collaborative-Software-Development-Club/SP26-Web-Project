"use client"
/*Create profile header that displays the name, email, bio, pfp of the user. 
Include ways to be able to edit these fields.
*/
//
import SideBar from './side-bar'
import ProfilePage from './profile-page'
import SettingsPage from './settings-page';
import { useState } from 'react';
//type Page = "profile" | "bio" | "settings";
export default function ProfileHeader() {
  const [page,setPage] = useState("profile");

  return (
    <div className="flex flex-row h-[80vh]">
        <SideBar setPage={setPage}/>
        {page === "profile" && <ProfilePage/>}
        {page === "settings" && <SettingsPage/>}
    </div>
  )
}
