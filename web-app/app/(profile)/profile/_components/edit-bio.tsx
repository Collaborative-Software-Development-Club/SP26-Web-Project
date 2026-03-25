"use client"
import { Button } from "@/components/ui/button";
import { useState } from "react"
import { UserField } from "../../types";
import { setUserProfile } from "../../_actions";
import { useRouter } from "next/navigation";
export default function EditBio({bio}:{bio:string}) {
    const [userBio,setBio] = useState(bio);
    const [error,setError] = useState<string|null>(null);
    const router = useRouter();
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) =>{
      e.preventDefault();
      const bioData:UserField = {
          field:"bio",
          value:userBio
      }
      try {
        setUserProfile(bioData)
        router.refresh()
      } catch (err) {
        setError("An unexpected error occured")
        setBio(bio)
      }
      
    }
  return (
    <>
        <form onSubmit={(e)=>(handleSubmit(e))} className="flex items-center">
          <textarea value={userBio} onChange={(e)=>(setBio(e.target.value))} className="w-2/3 border-2 border-gray-400 bg-gray-50 text-sm text-gray-600 min-h-20 rounded-md shadow-sm shadow-gray-400"/>
          {bio!==userBio && <Button className="w-20 hover:bg-red-400 ml-4">Confirm</Button>}
        </form>
        {}
    </>
  )
}
