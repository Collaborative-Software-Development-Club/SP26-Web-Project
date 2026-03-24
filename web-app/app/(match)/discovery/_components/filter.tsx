import { useState } from "react";
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { ImportanceControl } from "./importance-control";
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

  const handleUpdate = (id: string, val: number) => {
    setTempRoommatePreferences((prev) =>
      prev.map((p) => (p.preference_id === id ? { ...p, importance: val } : p)),
    );
  };

  const handleProfileButtonUpdate = (filter: string) => {
    setTempProfileFilters((prev) => ({
      ...prev,
      [filter as keyof ProfileFilter]: !prev[filter as keyof ProfileFilter],
    }));
  };

  const handleSave = () => {
    // save preferences to database (PENDING)
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
        className="sm:max-w-[480px] max-h-[70vh] flex flex-col p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="shrink-0 px-6 pt-6">
          <DialogTitle>Edit Your Roommate Filters</DialogTitle>
          <DialogDescription>
            Turn preferences on to filter your matches. Pick a level (1–5) for
            how much it matters, or &apos;!&apos; for dealbreaker.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col overflow-y-auto px-6 pb-2 gap-4">
          <div className="flex flex-col">
            <h2 className="text-gray-800 font-medium">Profile:</h2>
            <div className="flex flex-row items-center w-full gap-2 p-2">
              <Button
                variant={tempProfileFilters.use_major ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => handleProfileButtonUpdate("use_major")}
              >
                Major
              </Button>
              <Button
                variant={tempProfileFilters.use_year ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => handleProfileButtonUpdate("use_year")}
              >
                Year
              </Button>
              <Button
                variant={tempProfileFilters.use_gender ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => handleProfileButtonUpdate("use_gender")}
              >
                Gender
              </Button>
            </div>
          </div>
          <div className="flex pr-2 flex-col gap-1">
            <h2 className="text-gray-800 font-medium">Living Habits:</h2>
            {tempRoommatePreferences.map((pref) => {
              const isActive = pref.importance > 0;
              const isYesNo = YesNoPreferences.includes(pref.name);

              return (
                <div
                  key={pref.preference_id}
                  className="flex flex-col gap-1 py-1 px-2 rounded-md"
                >
                  <Label
                    className={cn(
                      "text-sm cursor-default",
                      !isActive && "text-muted-foreground",
                    )}
                  >
                    {pref.name}
                  </Label>
                  <ImportanceControl
                    value={pref.importance}
                    isYesNo={isYesNo}
                    onValueChange={(val) =>
                      handleUpdate(pref.preference_id, val)
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
