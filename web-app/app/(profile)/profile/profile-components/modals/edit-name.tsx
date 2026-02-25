"use client"
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {updateName} from '../actions/update-name'
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
            <div className="absolute justify-self-center my-20 w-1/4">
                <Card className="p-10 min-w-1/4 shadow-xl shadow-gray-300">
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <Label className="mb-5 text-xl">Edit Username</Label>
                        <Input value={first} onChange={(e)=>setFirst(e.target.value)}/>
                        <Input value={last} onChange={(e)=>setLast(e.target.value)}/>
                        <Button type="submit" className="mt-5 max-w-1/3 mx-auto">Confirm</Button>
                    </form>
                </Card>
            </div>
        }
    </>
    
  )
}
