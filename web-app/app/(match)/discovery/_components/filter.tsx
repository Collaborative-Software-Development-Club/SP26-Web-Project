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
import { ImportanceControl } from "./importance-slider";
import { RoommatePreference } from "../types";
import { YesNoPreferences } from "../types";

export function Filter({ preferences }: { preferences: RoommatePreference[] }) {
  const [open, setOpen] = useState(false);
  const [tempValues, setValues] = useState<RoommatePreference[]>(preferences);

  const handleUpdate = (id: string, val: number) => {
    setValues((prev) =>
      prev.map((p) => (p.preference_id === id ? { ...p, importance: val } : p)),
    );
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
        className="sm:max-w-[480px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit Your Roommate Preferences</DialogTitle>
          <DialogDescription>
            Turn preferences on to filter your matches. Pick a level (1–5) for
            how much it matters, or &apos;!&apos; for dealbreaker.
          </DialogDescription>
        </DialogHeader>
        <div className="flex max-h-[60vh] overflow-y-auto pr-2 flex-col gap-1">
          {tempValues.map((pref) => {
            const isActive = pref.importance > 0;
            const isYesNo = YesNoPreferences.includes(pref.name);

            return (
              <div
                key={pref.preference_id}
                className="flex flex-col gap-1 py-2 px-2 rounded-md"
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
                  onValueChange={(val) => handleUpdate(pref.preference_id, val)}
                />
              </div>
            );
          })}
        </div>

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
