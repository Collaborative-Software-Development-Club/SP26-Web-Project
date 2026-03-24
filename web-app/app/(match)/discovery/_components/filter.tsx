"use client";

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
import { saveDiscoveryFilter } from "../_actions";
import { DiscoveryFilter, ProfileFilter, YesNoPreferences } from "../types";
import { HobbiesFilter } from "./hobbies-filter";

// TODO: replace with user context
import profiles from "@/mock/profiles.json";
import { Hobby } from "@/app/(profile)/types";
const user = profiles[0];

export function Filter({
  discoveryFilter,
}: {
  discoveryFilter: DiscoveryFilter;
}) {
  const [open, setOpen] = useState(false);

  const [tempDiscoveryFilter, setTempDiscoveryFilter] =
    useState<DiscoveryFilter>(discoveryFilter);

  const handlePreferenceUpdate = (id: string, val: number) => {
    setTempDiscoveryFilter((prev) => ({
      ...prev,
      roommate_preferences: prev.roommate_preferences.map((preference) =>
        preference.preference_id === id
          ? { ...preference, importance: val }
          : preference,
      ),
    }));
  };

  const handleProfileFilterUpdate = (filter: string) => {
    setTempDiscoveryFilter((prev) => ({
      ...prev,
      profile_filters: {
        ...prev.profile_filters,
        [filter as keyof ProfileFilter]:
          !prev.profile_filters[filter as keyof ProfileFilter],
      },
    }));
  };

  const handleHobbyFilterUpdate = (hobby: Hobby) => {
    setTempDiscoveryFilter((prev) => ({
      ...prev,
      hobby_filters: prev.hobby_filters.includes(hobby.hobby_id)
        ? prev.hobby_filters.filter((h) => h !== hobby.hobby_id)
        : [...prev.hobby_filters, hobby.hobby_id],
    }));
  };

  const handleSave = () => {
    // TODO: save preferences to database (PENDING)
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
            Turn preferences on to filter your matches. For profile and hobbies,
            turn on the filters that you want to use. For living habits, pick a
            level (0–4) for how much it matters, or 5 for dealbreaker.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col overflow-y-auto px-6 gap-3">
          <div className="flex flex-col">
            <h2 className="text-gray-800 font-medium">Profile:</h2>
            <div className="flex flex-row items-center w-full gap-2 p-2">
              <Button
                variant={
                  tempDiscoveryFilter?.profile_filters?.use_major
                    ? "default"
                    : "outline"
                }
                size="sm"
                className="flex-1"
                onClick={() => handleProfileFilterUpdate("use_major")}
              >
                Major
              </Button>
              <Button
                variant={
                  tempDiscoveryFilter?.profile_filters?.use_year
                    ? "default"
                    : "outline"
                }
                size="sm"
                className="flex-1"
                onClick={() => handleProfileFilterUpdate("use_year")}
              >
                Year
              </Button>
              <Button
                variant={
                  tempDiscoveryFilter?.profile_filters?.use_gender
                    ? "default"
                    : "outline"
                }
                size="sm"
                className="flex-1"
                onClick={() => handleProfileFilterUpdate("use_gender")}
              >
                Gender
              </Button>
            </div>
          </div>
          <HobbiesFilter
            selectedHobbies={tempDiscoveryFilter?.hobby_filters}
            userHobbies={user.hobbies}
            handleHobbyFilterUpdate={handleHobbyFilterUpdate}
          />
          <div className="flex pr-2 flex-col gap-1">
            <h2 className="text-gray-800 font-medium">Living Habits:</h2>
            {tempDiscoveryFilter?.roommate_preferences.map((pref) => {
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
                      handlePreferenceUpdate(pref.preference_id, val)
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
