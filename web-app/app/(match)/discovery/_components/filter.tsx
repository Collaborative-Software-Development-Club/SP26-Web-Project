import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ImportanceSlider } from "./importance-slider";
import { RoommatePreferenceWithName } from "../types";

//Map option to a value
const yesNoPreferences = ["smoker", "pets"];

export function Filter({
  preferences,
}: {
  preferences: RoommatePreferenceWithName[];
}) {
  const [open, setOpen] = useState(false); //dialog window

  const [tempValues, setValues] =
    useState<RoommatePreferenceWithName[]>(preferences);

  const handleSliderUpdate = (id: string, newVal: number[]) => {
    setValues((prev) =>
      prev.map((p) =>
        p.preference_id === id ? { ...p, importance: newVal[0] } : p,
      ),
    );
  };

  const handleButtonUpdate = (id: string) => {
    setValues((prev) =>
      prev.map((p) =>
        p.preference_id === id
          ? { ...p, importance: p.importance > 0 ? 0 : 1 }
          : p,
      ),
    );
  };

  const handleSave = () => {
    // valuesToSave already has correct values (0 for inactive, >0 for active)
    //save preferences to database (PENDING)
    //...
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="w-full max-w-4xl flex justify-end mb-4">
        <DialogTrigger asChild>
          <ListFilter className="cursor-pointer" />
        </DialogTrigger>
      </div>
      <DialogContent
        className="sm:max-w-[450px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit Your Roommate Preferences</DialogTitle>
          <DialogDescription>
          Set how important each preference is for finding your match. Slide right
          for must-haves (dealbreakers) or turn off if
          you don&apos;t care.
        </DialogDescription>
        </DialogHeader>
        <div className="flex max-h-[60vh] overflow-y-auto pr-2 flex-col gap-1">
          {tempValues.map((pref) => {
            const isActive = pref.importance > 0;
            const isYesNo = yesNoPreferences.includes(pref.preference_id);

            return (
              <div
                key={pref.preference_id}
                className="group flex items-center gap-6"
              >
                {/* Item tile */}
                <Button
                  variant={isActive ? "outline" : "ghost"}
                  className="w-24 min-h-11 shrink-0 rounded-full whitespace-normal"
                  onClick={() => handleButtonUpdate(pref.preference_id)}
                >
                  {pref.name}
                </Button>

                {/* SLIDER */}
                <ImportanceSlider
                  value={pref.importance}
                  isYesNo={isYesNo}
                  onValueChange={(val) =>
                    handleSliderUpdate(pref.preference_id, val)
                  }
                />
              </div>
            );
          })}
        </div>

        {/*SAVE BUTTON */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary text-white cursor-pointer"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
