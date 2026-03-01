import { useState, useEffect} from "react"
import { Button } from "@/components/ui/button"
import { ListFilter } from 'lucide-react';
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "./slider"
import { CachedRouteKind } from "next/dist/server/response-cache";
import { Interface } from "readline";
import { CustomAuthError } from "@supabase/supabase-js";
import { Certificate } from "crypto";



const QUESTION_KEYWORD = [
  { id: "smoker", name: "Somker"},
  { id: "pets", name: "Pets"},
  { id: "guests", name: "Guest" },
  { id: "overnight_guest", name: "Overnight guest" },
  { id: "tidiness", name: "Tidiness level" },
  { id: "noise", name: "Noise levlel" },
  { id: "sharing", name: "Sharing items" },
  { id: "alcohol", name: "Alcohol use" },
  { id: "smoking", name: "Smoking freq" },
  { id: "sleep", name: "Sleep hours"},
  { id: "activity", name: "Daily activity"},
  { id: "workload", name: "Workload"},
  { id: "sleep_schedule", name : "Sleep schedule"}
]

//Map option to a value
const optionToValueMap = {
  "smoker": {
    "yes":1, "no":0
  },
  "pets": {
    "yes":1, "no":0
  },
  "sleep_schedule": {
    "very late": 5, "late": 4, "neutral": 3, "early": 2, "very early": 1, "default":0 
  },
  "default": {
    "always": 5, "often": 4, "sometimes": 3, "occasionally": 2, "never": 1, "default":0 
  }

} as any;

const getScale = (keyword:string,option:string) => {

  //yes/no question
  if(keyword === "pets"||keyword === "smoker"){
    if (option === "yes") {
      return 1;
    }
    else {
      return 0;
    }
  }

  //sleep_schedule question
  if(keyword === "sleep_schedule"){
    const sleepScales = ["very early", "early", "neutral", "late", "very late"];
    const sleepIndex = sleepScales.indexOf(option);
    
    if (sleepIndex !== -1) {
      return sleepIndex + 1;
    }
  }
  
  //other questions
  const scales = ["never", "occasionally", "sometimes", "often", "always"];
  const index = scales.indexOf(option);
  
  if (index !== -1) return index + 1; // Maps 0-4 to 1-5


  //default
  return 0; 
};

//Map value to a option
const valueToOptionMap = {
  0: {
    "smoker":"no", "pets": "no","default":"not applicable"
  },
  1: {
    "smoker":"yes", "pets": "yes","sleep_schedule":"very early", "default":"never"
  },
  2: {
    "sleep_schedule":"early", "default":"occasionally"
  },
  3: {
    "sleep_schedule":"neutral", "default":"sometimes"
  },
  4: {
    "sleep_schedule":"late", "default":"often"
  },
  5: {
    "sleep_schedule":"very late", "default":"always"
  }
} as any;

type Preference = [string, string];
export function Filter({
  preferences,
}:{
  preferences:Preference[]
}) {
  const [open, setOpen] = useState(false);//dialog window

  const [tempValues, setValues] = useState<Record<string, number>>({});//current user preference

  const prefValues: Record<string, number> = {};// keyword : value, e.g Smoker: 1(yes)
  //update when filter opens
  useEffect(()=>{
    if (open) {
      const prefLookup: Record<string, string> = Object.fromEntries(preferences);
      QUESTION_KEYWORD.forEach((cat)=>{
        prefValues[cat.id] = cat.id in prefLookup ? getScale(cat.id,prefLookup[cat.id]) : 0 ;
      })
    }
    setValues(prefValues);
  },[open]);
  
  

  const handleSliderUpdate = (id: string, newVal: number[]) => {
    setValues((prev) => ({ ...prev, [id]: newVal[0] }))
  }
  const handleSave = () => {
    //save preferences to database (PENDING)
    //...
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <div className="w-full max-w-4xl flex justify-end mb-4">
        <DialogTrigger asChild >
          <ListFilter className="cursor-pointer"/>
        </DialogTrigger>
      </div>
      <DialogContent  className="sm:max-w-[450px]" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit Preference</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {QUESTION_KEYWORD.map((cat) => {
            const currentVal = tempValues[cat.id]
            const isDeactive = currentVal === 0
            let sliderStyle = (cat.id === 'smoker'||cat.id === 'pets') 
              ? 1  // Yes/No question
              : 5; // Scale question
            
            let lineScaleStyle;
              if(cat.id === 'smoker' || cat.id === 'pets') {
                lineScaleStyle = ['No','Yes']; //Yes/No question
              }else if (cat.id === 'sleep_schedule'){
                lineScaleStyle = ['N/A', '8-10pm','10-12pm','12-2pm','2-4pm','after 4'];
              }else{
                lineScaleStyle = ["N/A",1,2,3,4,5]; 
              }//Scale question

            return (
              <div key={cat.id} className="group flex items-center gap-6">
                {/* Item tile */}
                <div
                  className={cn(
                    "flex h-10 w-24 shrink-0 items-center justify-center rounded-full border-2 font-bold text-[10px] transition-all duration-200",
                    // Active Styling
                    "bg-primary  text-white shadow-sm",
                    // Deactive Styling (when value is 0)
                    isDeactive && "bg-slate-100 border-dashed border-slate-300 text-slate-400 opacity-50 shadow-none"
                  )}
                >
                  {cat.name}
                </div>

                {/* SLIDER */}
                <div className="flex flex-1 flex-col gap-2">
                  
                  <Slider
                    value={[currentVal]} 
                    max={sliderStyle}
                    step={1}
                    onValueChange={(val) => handleSliderUpdate(cat.id, val)}
                    className="w-full"
                  />
                  
                  
                  <div className="flex justify-between px-1">
                    {lineScaleStyle.map((num) => (
                      <span key={num} className="text-[10px] text-muted-foreground">
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/*SAVE BUTTON */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary text-white cursor-pointer">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
