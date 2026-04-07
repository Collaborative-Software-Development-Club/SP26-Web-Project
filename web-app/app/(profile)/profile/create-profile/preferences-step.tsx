import type { UserProfile } from "@/app/(profile)/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  PREFERENCE_ENTRIES,
  valueForOptionIndex,
} from "./helpers";

export function PreferencesStep({
  profile,
  prefsLoading,
  prefsError,
  preferenceQuestionIndex,
  isSubmitting,
  updatePreference,
  onPrevQuestion,
  onNextQuestion,
}: {
  profile: UserProfile;
  prefsLoading: boolean;
  prefsError: string | null;
  preferenceQuestionIndex: number;
  isSubmitting: boolean;
  updatePreference: (preference_id: string, value: number) => void;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
}) {
  if (prefsLoading) {
    return (
      <p className="text-sm text-muted-foreground">Loading questions…</p>
    );
  }

  if (prefsError) {
    return (
      <p className="text-sm text-muted-foreground bg-muted/80 border border-border rounded-md px-3 py-2">
        {prefsError}
      </p>
    );
  }

  if (profile.preferences.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No questions available. You can continue.
      </p>
    );
  }

  const safeIndex = Math.min(
    preferenceQuestionIndex,
    profile.preferences.length - 1,
  );
  const entry = PREFERENCE_ENTRIES[safeIndex];
  const pref = profile.preferences[safeIndex];
  if (!entry || !pref) return null;

  const [, data] = entry;
  const isBinaryChoice = data.options.length === 2;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Question {safeIndex + 1} of {profile.preferences.length}
      </p>
      <Label className="text-base font-semibold text-foreground block leading-snug">
        {data.question}
      </Label>
      <div
        className={cn(
          isBinaryChoice ? "grid grid-cols-2 gap-3" : "flex flex-col gap-2.5",
        )}
      >
        {data.options.map((opt, i) => {
          const v = valueForOptionIndex(data.options, i);
          const selected = pref.value === v;
          return (
            <Button
              key={`${pref.preference_id}-${opt}`}
              type="button"
              variant={selected ? "default" : "outline"}
              className="capitalize"
              onClick={() => updatePreference(pref.preference_id, v)}
              disabled={isSubmitting}
            >
              {opt}
            </Button>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPrevQuestion}
          disabled={isSubmitting || safeIndex === 0}
        >
          Back
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onNextQuestion}
          disabled={
            isSubmitting ||
            safeIndex >= profile.preferences.length - 1 ||
            pref.value <= 0
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
