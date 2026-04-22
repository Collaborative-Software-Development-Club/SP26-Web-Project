"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import type { Hobby } from "@/app/(profile)/types";
import { HobbiesFilter } from "./hobbies-filter";
import { useUser } from "@/contexts/UserContext";
import { getPreferenceDisplayLabel } from "@/app/(profile)/profile/_components/preference-display";
import type { Preference } from "@/app/(profile)/types";

export function Filter({
  discoveryFilter,
}: {
  discoveryFilter: DiscoveryFilter;
}) {
  const [open, setOpen] = useState(false);

  const [tempDiscoveryFilter, setTempDiscoveryFilter] =
    useState<DiscoveryFilter>(discoveryFilter);

  useEffect(() => {
    setTempDiscoveryFilter(discoveryFilter);
  }, [discoveryFilter]);

  const { profile } = useUser();
  const router = useRouter();

  const profilePreferenceForFilter = (pref: {
    preference_id: string;
    name: string;
  }): Preference | null => {
    if (!profile?.preferences?.length) return null;
    return (
      profile.preferences.find((p) => p.preference_id === pref.preference_id) ??
      profile.preferences.find(
        (p) => p.name.toLowerCase() === pref.name.toLowerCase(),
      ) ??
      null
    );
  };

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

  const handleSave = async () => {
    try {
      if (await saveDiscoveryFilter(tempDiscoveryFilter)) {
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
      setOpen(false);
      router.refresh();
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
            userHobbies={profile?.hobbies ?? []}
            handleHobbyFilterUpdate={handleHobbyFilterUpdate}
          />
          <div className="flex pr-2 flex-col gap-1">
            <h2 className="text-gray-800 font-medium">Living Habits:</h2>
            {tempDiscoveryFilter?.roommate_preferences.map((pref) => {
              const isActive = pref.importance > 0;
              const isYesNo = YesNoPreferences.includes(pref.name);
              const mine = profilePreferenceForFilter(pref);
              const yours = mine
                ? getPreferenceDisplayLabel(mine)
                : "—";

              return (
                <div
                  key={pref.preference_id}
                  className="flex flex-col gap-1 rounded-md px-2 py-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Label
                      className={cn(
                        "flex-1 cursor-default text-sm capitalize",
                        !isActive && "text-muted-foreground",
                      )}
                    >
                      {pref.name}
                    </Label>
                    <span
                      className="shrink-0 max-w-[55%] text-right text-xs text-muted-foreground"
                      title={yours}
                    >
                      {yours}
                    </span>
                  </div>
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
