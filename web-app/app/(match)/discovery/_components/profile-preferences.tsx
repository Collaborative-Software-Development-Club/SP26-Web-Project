"use client";

import type { Preference } from "@/app/(profile)/types";
import { preferenceQuestion } from "@/lib/constants/preference-question";
import { BookOpen, Cat, Cigarette, Moon, Users } from "lucide-react";
import { useState } from "react";

const getPreferenceIcon = (key: string) => {
  switch (key) {
    case "smoker":
      return <Cigarette className="h-4 w-4" />;
    case "pets":
      return <Cat className="h-4 w-4" />;
    case "sleep hours":
      return <Moon className="h-4 w-4" />;
    case "guests":
      return <Users className="h-4 w-4" />;
    default:
      return <BookOpen className="h-4 w-4" />;
  }
};


function labelForPreferenceValue(value: number, options: string[]): string {
  if (options.length === 2) {
    for (let i = 0; i < 2; i++) {
      const stored = options[i] === "Yes" ? 5 : 1;
      if (stored === value) return options[i];
    }
    return "—";
  }
  if (value >= 1 && value <= options.length) {
    return options[value - 1] ?? "—";
  }
  return "—";
}

function getPreferenceDisplayLabel(pref: Preference): string {
  const config = preferenceQuestion.get(pref.name);
  if (!config) return String(pref.value);
  return labelForPreferenceValue(pref.value, config.options);
}

export function ProfilePreferences({
  preferences,
  userPreferences,
}: {
  preferences: Preference[];
  userPreferences: Preference[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_VISIBLE_PREFS = 6;

  const getMatchDotClass = (prefName: string, profileValue: number): string => {
    const userPref = userPreferences.find(
      (p: Preference) => p.name === prefName,
    );
    if (!userPref) return "bg-border";
    const diff = Math.abs(userPref.value - profileValue);
    if (diff === 0) return "bg-green-400";
    else if (diff < 3) return "bg-yellow-400";
    else return "bg-red-400";
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {preferences
          .slice(0, isExpanded ? preferences.length : INITIAL_VISIBLE_PREFS)
          .map((pref) => (
            <div key={pref.name} className="flex items-center gap-3">
              <div className="shrink-0 text-muted-foreground">
                {getPreferenceIcon(pref.name)}
              </div>
              <span className="w-24 shrink-0 text-xs text-muted-foreground capitalize">
                {pref.name}
              </span>
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${getMatchDotClass(pref.name, pref.value)}`}
              />
              <span className="text-sm text-foreground capitalize">
                {getPreferenceDisplayLabel(pref)}
              </span>
            </div>
          ))}
      </div>
      {preferences.length > INITIAL_VISIBLE_PREFS && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 cursor-pointer text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-foreground"
        >
          {isExpanded
            ? "Show Less"
            : `+${preferences.length - INITIAL_VISIBLE_PREFS} More`}
        </button>
      )}
    </div>
  );
}
