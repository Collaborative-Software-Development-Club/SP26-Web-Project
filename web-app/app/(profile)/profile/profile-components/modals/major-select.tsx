"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import majors from "../data/majors.json"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { UserField } from "@/app/(profile)/types"
import { setUserProfile } from "@/app/(profile)/_actions"
import { useRouter } from "next/navigation"
export default function MajorSelect() {
    const [editMode,setMode] = useState(false);
    const [error,setError] = useState<string|null>(null);
    const router = useRouter();
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        
        const formData = new FormData(e.currentTarget);
        const major = formData.get("major") as string;
        const majorData:UserField = {
            field:"major",
            value:major
        }
        
        try {
            await setUserProfile(majorData);
            setMode(false);
            router.refresh();
        } catch (error) {
            setError("Unexpected error occured");
            setMode(true);
        }


        
    }
  return (
    <>
        <Button onClick={()=>setMode(true)} className="w-20 hover:bg-red-400 ml-4">Edit</Button>
        {editMode &&
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <Card className="w-full max-w-2xl rounded-2xl border border-gray-200 shadow-xl">
                    <form onSubmit={(e)=> handleSubmit(e)} className="flex flex-col">
                    
                    {/* Header */}
                    <div className="border-b px-6 py-4">
                        <h2 className="text-xl font-semibold text-gray-900">Select Your Major</h2>
                        <p className="mt-1 text-sm text-gray-500">
                        Choose the major that best matches your field of study.
                        </p>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}
                    </div>
                    
                    {/* Scrollable content */}
                    <div className="max-h-[55vh] overflow-auto px-6 py-4">
                        <div className="space-y-2">
                        {majors.Majors.map((major) => (
                            <Label
                            key={major}
                            className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-4 py-3 transition hover:bg-gray-50"
                            >
                                <span className="text-sm font-medium text-gray-800">{major}</span>
                                <Input
                                    type="radio"
                                    name="major"
                                    id={major}
                                    value={major}
                                    className="h-4 w-4 accent-red-500"
                                />
                            </Label>
                        ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t px-6 py-4">
                        <Button
                        type="submit"
                        className="bg-red-500 px-6 text-white hover:bg-red-400"
                        >
                        Confirm
                        </Button>
                    </div>
                    </form>
                </Card>
            </div>
            
        }
        
    </>
  )
}
