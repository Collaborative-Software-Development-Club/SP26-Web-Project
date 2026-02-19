"use client";
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
export default function SideBar({setPage}:{setPage:React.Dispatch<React.SetStateAction<string>>}) {
  return (
    <>
        <Card className="bg-gray-300 w-32 my-20 ml-20 flex flex-col gap-0 px-1 py-2 rounded-r-none">
            <Button className="bg-gray-300 hover:bg-gray-200 w-full justify-start text-gray-500" onClick={()=>setPage("profile")}>Profile</Button>
            <Button className="bg-gray-300 hover:bg-gray-200 w-full justify-start text-gray-500" onClick={()=>setPage("bio")}>Bio</Button>
            <Button className="bg-gray-300 hover:bg-gray-200 w-full justify-start text-gray-500" onClick={()=>setPage("settings")}>Settings</Button>
        </Card>
    </>
  )
}
