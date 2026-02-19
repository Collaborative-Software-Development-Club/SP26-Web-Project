"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import EditName from "./modals/edit-name"
import logo from "./assets/pfp.webp"
export default function ProfilePage() {
  const [username,setUser] = useState("Test User")
  const [email,setEmail] = useState("test@gmail.com")
  const [editMode, setMode] = useState(false)
  return (
    <div className="flex-1 mr-20 my-20">
      {editMode && <EditName username={username} setUser={setUser} setMode={setMode}/>}
      <Card className="h-full w-full p-4 rounded-l-none">
        <h2 className="text-2xl font-bold">Account</h2>
        <hr className="bg-gray-200 h-0.5"/>
        <Card className="border-none flex-row max-h-1/2 w-full items-center p-4">
          <img src="/pfp.webp" className="max-w-20 max-h-20 rounded-full flex-1"/>
          <Card className="border-none flex-1 p-4 shadow-none gap-1">
            <h3 className="text-lg">Username</h3>
            <p className="text-sm">{username}</p>
            <Button onClick={()=>setMode(true)} className="w-20 hover:bg-red-400">Edit</Button>
          </Card>
          
        </Card>

        <Card className="p-4 gap-1">
          <h2 className="text-xl font-semibold">Account Details</h2>
          <hr className="bg-gray-200 h-0.5"/>
          <h3 className="text-lg ml-4 mt-4">Email</h3>
          <p className="ml-4 text-sm">{email}</p>
        </Card>
        
        
      </Card>
      
    </div>
  )
}
