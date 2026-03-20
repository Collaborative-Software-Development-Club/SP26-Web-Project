"use client";

import { useEffect, useState } from "react";
import { DiscoveryProfile, YesNoPreferences } from "../types";
// replace with useContext for signed-in user
import discoveryProfiles from "@/mock/discover_profiles.json";
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

// replace with useContext
const user = discoveryProfiles[0];

const getMatchBorderClass = (
  prefName: string,
  profileValue: number,
): string => {
  const userPref = user.preferences.find((p) => p.name === prefName);
  if (!userPref) return "border-zinc-100 dark:border-zinc-800";

  let diff = Math.abs(userPref.value - profileValue);

  // For yes/no preferences, diff value results in green/red outline
  if (prefName === "Smoker" || prefName === "Pets") diff *= 5;

  if (diff === 0) return "border-green-300 dark:border-green-400";
  if (diff < 3) return "border-yellow-300 dark:border-yellow-400";
  if (diff <= 5) return "border-red-300 dark:border-red-400";

  return "border-zinc-100 dark:border-zinc-800";
};

export function LivingHabits({ profile }: { profile: DiscoveryProfile }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_VISIBLE_PREFS = 4;

  useEffect(() => {
    setTimeout(() => {
      setIsExpanded(false);
    }, 0);
  }, [profile?.user_id]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {profile.preferences
          .slice(
            0,
            isExpanded ? profile.preferences.length : INITIAL_VISIBLE_PREFS,
          )
          .map((pref) => (
            <div
              key={pref.name}
              className={`flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border-2 ${getMatchBorderClass(pref.name, pref.value)}`}
            >
              <div className="p-1.5 rounded-full bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 shadow-sm shrink-0">
                {getPreferenceIcon(pref.name)}
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-zinc-400 uppercase font-semibold truncate">
                  {pref.name}
                </p>
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 capitalize truncate">
                  {YesNoPreferences.includes(pref.name)
                    ? pref.value === 1
                      ? "Yes"
                      : "No"
                    : pref.value}
                </p>
              </div>
            </div>
          ))}
      </div>
      {profile.preferences.length > INITIAL_VISIBLE_PREFS && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
        >
          {isExpanded
            ? "Show Less"
            : `+${profile.preferences.length - INITIAL_VISIBLE_PREFS} More`}
        </button>
      )}
    </div>
  );
}
