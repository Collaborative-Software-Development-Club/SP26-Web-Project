"use client"
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {updateName} from '../actions/update-actions'
export default function EditName({fname,lname,id}:{fname:string,lname:string,id:string}) {
    const [first,setFirst] = useState(fname)
    const [last,setLast] = useState(lname)
    const [editMode, setMode] = useState(false)
    function handleSubmit(){
        updateName(first,last,id);
        setMode(false)
    }
    
  return (
    <>
        <Button onClick={()=>setMode(true)} className="w-20 hover:bg-red-400">Edit</Button>
        {editMode && 
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                <Card className="p-10 w-full max-w-lg">
                    <Label className="text-2xl mx-auto">Edit Name</Label>
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <Label className="text-lg mb-2 font-normal">First name</Label>
                        <Input value={first} onChange={(e)=>setFirst(e.target.value)}/>
                        <Label className="text-lg mt-4 mb-2 font-normal">Last name</Label>
                        <Input value={last} onChange={(e)=>setLast(e.target.value)}/>
                        <Button type="submit" className="mt-5 max-w-1/3 mx-auto hover:bg-red-400">Confirm</Button>
                    </form>
                </Card>
            </div>
        }
    </>
    
  )
}
