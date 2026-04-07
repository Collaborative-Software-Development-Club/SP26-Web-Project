import type { HobbyCategoryGroup, UserProfile } from "@/app/(profile)/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { MAX_HOBBIES } from "./helpers";

export function HobbiesStep({
  profile,
  toggleHobby,
  removeHobby,
  isHobbySelected,
  hobbies,
}: {
  profile: UserProfile;
  toggleHobby: (hobby_id: string, name: string) => void;
  removeHobby: (hobby_id: string) => void;
  isHobbySelected: (hobby_id: string) => boolean;
  hobbies: HobbyCategoryGroup[];
}) {
  const atLimit = profile.hobbies.length >= MAX_HOBBIES;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-sm font-medium">Hobbies</Label>
        <span className="text-xs tabular-nums text-muted-foreground">
          {profile.hobbies.length}/{MAX_HOBBIES}
        </span>
      </div>

      {profile.hobbies.length > 0 && (
        <div className="flex max-h-[15vh] min-h-0 flex-col gap-2 overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-3">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable]">
            <div className="flex flex-wrap content-start gap-2">
              {profile.hobbies.map((h) => (
                <span
                  key={h.hobby_id}
                  className="inline-flex max-w-full items-center gap-0.5 rounded-full border border-border bg-card py-0.5 pl-3 pr-0.5 text-sm text-foreground shadow-sm"
                >
                  <span className="max-w-[180px] truncate capitalize">
                    {h.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="shrink-0 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => removeHobby(h.hobby_id)}
                    aria-label={`Remove ${h.name}`}
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </Button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Tap below to add more. Use <span className="whitespace-nowrap">×</span>{" "}
        on a chip to remove.
      </p>

      <div className="max-h-[35vh] space-y-6 overflow-y-auto pr-1">
        {hobbies?.map((data) => (
          <section key={data.category} className="space-y-2">
            <h2 className="text-sm font-semibold capitalize text-foreground">
              {data.category}
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.hobbies.map((h) => {
                const selected = isHobbySelected(h.hobby_id);
                const addBlocked = !selected && atLimit;
                return (
                  <Button
                    key={h.hobby_id}
                    type="button"
                    size="sm"
                    variant={selected ? "default" : "outline"}
                    className="rounded-full text-xs capitalize"
                    onClick={() => toggleHobby(h.hobby_id, h.name)}
                    disabled={addBlocked}
                    title={addBlocked ? `Maximum ${MAX_HOBBIES} hobbies` : undefined}
                  >
                    {h.name}
                  </Button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
