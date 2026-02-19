"use client"
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
export default function EditName({username,setUser,setMode}:
    {username: string, setUser: React.Dispatch<React.SetStateAction<string>>, setMode:React.Dispatch<React.SetStateAction<boolean>>}) {
    function handleSubmit(){
        setMode(false)
    }
  return (
    <div className="absolute justify-self-center my-20 w-1/4">
        <Card className="p-10 min-w-1/4 shadow-xl shadow-gray-300">
            <form onSubmit={handleSubmit} className="flex flex-col">
                <Label className="mb-5 text-xl">Edit Username</Label>
                <Input value={username} onChange={(e)=>setUser(e.target.value)}/>
                <Button type="submit" className="mt-5 max-w-1/3 mx-auto">Confirm</Button>
            </form>
        </Card>
    </div>
  )
}
