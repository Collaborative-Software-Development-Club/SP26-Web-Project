"use client";

import { useState } from "react";
import { YesNoPreferences } from "../types";
import type { Preference } from "@/app/(profile)/types";
import { BookOpen, Cigarette, Cat, Moon, Users } from "lucide-react";

const getPreferenceIcon = (key: string) => {
  switch (key) {
    case "Smoker":
      return <Cigarette className="w-4 h-4" />;
    case "Pets":
      return <Cat className="w-4 h-4" />;
    case "Sleep Schedule":
      return <Moon className="w-4 h-4" />;
    case "Guests":
      return <Users className="w-4 h-4" />;
    default:
      return <BookOpen className="w-4 h-4" />;
  }
};

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
              <div className="text-muted-foreground shrink-0">
                {getPreferenceIcon(pref.name)}
              </div>
              <span className="text-xs text-muted-foreground w-24 shrink-0">
                {pref.name}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${getMatchDotClass(pref.name, pref.value)}`}
              />
              <span className="text-sm text-foreground capitalize">
                {YesNoPreferences.includes(pref.name)
                  ? pref.value === 5
                    ? "Yes"
                    : "No"
                  : pref.value}
              </span>
            </div>
          ))}
      </div>
      {preferences.length > INITIAL_VISIBLE_PREFS && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 cursor-pointer"
        >
          {isExpanded
            ? "Show Less"
            : `+${preferences.length - INITIAL_VISIBLE_PREFS} More`}
        </button>
      )}
    </div>
  );
}
