import type { HobbyCategoryGroup, UserProfile } from "@/app/(profile)/types";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type HobbiesStepProps = {
  profile: UserProfile;
  toggleHobby: (hobby_id: string, name: string) => void;
  removeHobby: (hobby_id: string) => void;
  isHobbySelected: (hobby_id: string) => boolean;
  hobbies: HobbyCategoryGroup[];
};

export function HobbiesStep({
  profile,
  toggleHobby,
  removeHobby,
  isHobbySelected,
  hobbies,
}: HobbiesStepProps) {
  return (
    <div className="space-y-4">
      {profile.hobbies.length > 0 && (
        <div className="flex max-h-[15vh] min-h-0 flex-col gap-2 overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-3">
          <p className="shrink-0 text-xs font-semibold text-primary uppercase tracking-wide">
            Selected ({profile.hobbies.length})
          </p>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable]">
            <div className="flex flex-wrap content-start gap-2">
              {profile.hobbies.map((h) => (
                <span
                  key={h.hobby_id}
                  className="inline-flex items-center gap-0.5 max-w-full rounded-full border border-border bg-card pl-3 pr-0.5 py-0.5 text-sm text-foreground shadow-sm"
                >
                  <span className="truncate max-w-[180px] capitalize">
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
        Tap below to add more. Selected hobbies also appear above—use{" "}
        <span className="whitespace-nowrap">×</span> to remove.
      </p>

      <div className="space-y-6 max-h-[35vh] overflow-y-auto pr-1">
        {hobbies?.map((data) => (
          <section key={data.category} className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground capitalize">
              {data.category}
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.hobbies.map((h) => {
                const selected = isHobbySelected(h.hobby_id);
                return (
                  <Button
                    key={h.hobby_id}
                    type="button"
                    size="sm"
                    variant={selected ? "default" : "outline"}
                    className="rounded-full text-xs capitalize"
                    onClick={() => toggleHobby(h.hobby_id, h.name)}
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
