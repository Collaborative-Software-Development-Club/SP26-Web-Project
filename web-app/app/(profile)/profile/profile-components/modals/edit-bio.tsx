"use client"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function EditBio({bio}:{bio:string}) {
    const [userBio,setBio] = useState(bio);
  return (
    <>
        <Input value={userBio} className="w-2/3 border-2 border-gray-400 bg-gray-50 text-sm text-gray-600 min-h-20 align-top justify-start items-start text-left"/>
    </>
  )
}
