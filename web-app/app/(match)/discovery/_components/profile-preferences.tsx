"use client";

import type { Preference } from "@/app/(profile)/types";
import {
  getPreferenceDisplayLabel,
  getPreferenceIcon,
} from "@/app/(profile)/profile/_components/preference-display";
import { useState } from "react";

export function ProfilePreferences({
  preferences,
  userPreferences,
  maxPrefsToShow = 6,
}: {
  preferences: Preference[];
  userPreferences: Preference[];
  maxPrefsToShow?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

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
      <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
        {preferences
          .slice(0, isExpanded ? preferences.length : maxPrefsToShow)
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
              <span className="text-xs text-foreground capitalize">
                {getPreferenceDisplayLabel(pref)}
              </span>
            </div>
          ))}
      </div>
      {preferences.length > maxPrefsToShow && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 cursor-pointer text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-foreground"
        >
          {isExpanded
            ? "Show Less"
            : `+${preferences.length - maxPrefsToShow} More`}
        </button>
      )}
    </div>
  );
}
