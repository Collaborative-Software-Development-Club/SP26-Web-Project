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
import { cn } from "@/lib/utils";
import { ImportanceSlider } from "./importance-slider";
import {
  saveUserProfileFilters,
  saveUserRoommatePreferences,
} from "../_actions";
import { ProfileFilter, RoommatePreference, YesNoPreferences } from "../types";

export function Filter({
  profileFilters,
  roommatePreferences,
}: {
  profileFilters: ProfileFilter;
  roommatePreferences: RoommatePreference[];
}) {
  const [open, setOpen] = useState(false); //dialog window

  const [tempRoommatePreferences, setTempRoommatePreferences] =
    useState<RoommatePreference[]>(roommatePreferences);

  const [tempProfileFilters, setTempProfileFilters] =
    useState<ProfileFilter>(profileFilters);

  const handleRoommatePreferenceSliderUpdate = (
    id: string,
    newVal: number[],
  ) => {
    setTempRoommatePreferences((prev) =>
      prev.map((p) =>
        p.preference_id === id ? { ...p, importance: newVal[0] } : p,
      ),
    );
  };

  const handleRoommatePreferenceButtonUpdate = (id: string) => {
    setTempRoommatePreferences((prev) =>
      prev.map((p) =>
        p.preference_id === id
          ? { ...p, importance: p.importance > 0 ? 0 : 1 }
          : p,
      ),
    );
  };

  const handleProfileButtonUpdate = (filter: string) => {
    setTempProfileFilters((prev) => ({
      ...prev,
      [filter as keyof ProfileFilter]: !prev[filter as keyof ProfileFilter],
    }));
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
        className="sm:max-w-[475px] max-h-[70vh] flex flex-col p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="shrink-0 px-6 pt-6">
          <DialogTitle>Edit Your Roommate Filters</DialogTitle>
          <DialogDescription>
            Set how important each filter is for finding your match. Slide right
            for must-haves (dealbreakers) or turn off if you don&apos;t care.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col overflow-y-auto px-6 pb-2 gap-2">
          <div className="flex flex-row items-center justify-between pt-2">
            <h2 className="text-gray-800 font-medium">Profile:</h2>
            <div className="flex flex-row items-center gap-4">
              <Button
                variant={tempProfileFilters.use_major ? "default" : "outline"}
                className="w-20 shrink-0 rounded-full whitespace-normal"
                onClick={() => handleProfileButtonUpdate("use_major")}
              >
                Major
              </Button>
              <Button
                variant={tempProfileFilters.use_year ? "default" : "outline"}
                className="w-20 shrink-0 rounded-full whitespace-normal"
                onClick={() => handleProfileButtonUpdate("use_year")}
              >
                Year
              </Button>
              <Button
                variant={tempProfileFilters.use_gender ? "default" : "outline"}
                className="w-20 shrink-0 rounded-full whitespace-normal"
                onClick={() => handleProfileButtonUpdate("use_gender")}
              >
                Gender
              </Button>
            </div>
          </div>
          <div className="flex pr-2 flex-col gap-1">
            <h2 className="text-gray-800 mb-2">Living Habits:</h2>
            {tempRoommatePreferences.map((pref) => {
              const isActive = pref.importance > 0;
              const isYesNo = YesNoPreferences.includes(pref.name);

              return (
                <div
                  key={pref.preference_id}
                  className="group flex items-center gap-6"
                >
                  {/* Item tile */}
                  <Button
                    variant={isActive ? "default" : "outline"}
                    className="w-20 shrink-0 rounded-full whitespace-normal text-[12px]"
                    onClick={() =>
                      handleRoommatePreferenceButtonUpdate(pref.preference_id)
                    }
                  >
                    {pref.name}
                  </Button>

                  {/* SLIDER */}
                  <ImportanceSlider
                    value={pref.importance}
                    isYesNo={isYesNo}
                    onValueChange={(val) =>
                      handleRoommatePreferenceSliderUpdate(
                        pref.preference_id,
                        val,
                      )
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/*SAVE BUTTON */}
        <DialogFooter className="shrink-0 px-6 pb-6 pt-4 border-t">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            className="bg-primary text-white cursor-pointer"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
