"use client"
import hobbies from "../data/hobbies.json"
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {updateName} from '../actions/update-actions'
export default function SelectHobbies() {
    const [editMode, setMode] = useState(false)
    function handleSubmit(){
        setMode(false)
    }
    
  return (
    <>
        <Button onClick={()=>setMode(true)} className="w-20 hover:bg-red-400 ml-4 mt-2">Edit</Button>
        {editMode && 
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <Card className="w-full max-w-2xl shadow-xl">
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-1">
                  <Label className="text-xl font-semibold">What are your hobbies?</Label>
                  <p className="text-sm text-muted-foreground">
                    Select any that apply.
                  </p>
                </div>

                <Card className="max-h-[55vh] overflow-auto rounded-lg border p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Object.entries(hobbies).map(([category, list]) => (
                      <section key={category} className="space-y-2">
                        <h2 className="text-sm font-semibold text-muted-foreground">
                          {category}
                        </h2>

                        <div className="space-y-2">
                          {list.map((hobby: string) => (
                            <Label key={hobby} className="flex items-center gap-3 text-sm">
                              <Input type="checkbox" className="h-4 w-4" />
                              {hobby}
                            </Label>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </Card>

                <div className="flex justify-center gap-2">
                  <Button className="w-20 hover:bg-red-400" type="submit">Confirm</Button>
                </div>
              </form>
            </Card>
          </div>
        }
    </>
  )
}