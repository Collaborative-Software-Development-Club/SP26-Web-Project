"use client"
/*Create profile header that displays the name, email, bio, pfp of the user. 
Include ways to be able to edit these fields.
*/
//
import ProfilePage from './profile-page'
import SettingsPage from './settings-page';
import { useState } from 'react';
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
//type Page = "profile" | "bio" | "settings";
export default function ProfileHeader() {
  const [page,setPage] = useState("profile");

  return (
    <div className="flex-1 flex flex-row w-full h-full min-h-0">
        <Card className="bg-gray-300 w-32 flex flex-col gap-0 px-1 py-2 rounded-none">
            <Button className="bg-gray-300 hover:bg-gray-200 w-full justify-start text-gray-500" onClick={()=>setPage("profile")}>Profile</Button>
            <Button className="bg-gray-300 hover:bg-gray-200 w-full justify-start text-gray-500" onClick={()=>setPage("settings")}>Settings</Button>
        </Card>
        {page === "profile" && <ProfilePage/>}
        {page === "settings" && <SettingsPage/>}
    </div>
  )
}
