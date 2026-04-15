import type { Preference } from "@/app/(profile)/types";
import { preferenceQuestion } from "@/lib/constants/preference-question";
import {
  BookOpen,
  Cat,
  Cigarette,
  Clock,
  Footprints,
  Home,
  Moon,
  Share2,
  Sparkles,
  Users,
  Volume2,
  Wine,
} from "lucide-react";

const iconClass = "h-4 w-4 shrink-0";

export function getPreferenceIcon(key: string) {
  switch (key.trim().toLowerCase()) {
    case "smoking":
      return <Cigarette className={iconClass} />;
    case "pets":
      return <Cat className={iconClass} />;
    case "sleep hours":
      return <Moon className={iconClass} />;
    case "guests":
      return <Users className={iconClass} />;
    case "overnight guests":
      return <Home className={iconClass} />;
    case "tidiness":
      return <Sparkles className={iconClass} />;
    case "noisiness":
      return <Volume2 className={iconClass} />;
    case "sharing items":
      return <Share2 className={iconClass} />;
    case "alcohol consumption":
      return <Wine className={iconClass} />;
    case "schoolwork load":
      return <BookOpen className={iconClass} />;
    case "movement frequency":
      return <Footprints className={iconClass} />;
    case "bedtime":
      return <Clock className={iconClass} />;
    default:
      return <BookOpen className={iconClass} />;
  }
}

export function labelForPreferenceValue(
  value: number,
  options: string[],
): string {
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

export function getPreferenceDisplayLabel(pref: Preference): string {
  const config = preferenceQuestion.get(pref.name);
  if (!config) return String(pref.value);
  return labelForPreferenceValue(pref.value, config.options);
}
