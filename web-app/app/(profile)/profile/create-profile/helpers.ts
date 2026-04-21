import type { Preference, UserProfile } from "@/app/(profile)/types";
import { preferenceQuestion } from "@/lib/constants/preference-question";

export const PREFERENCE_ENTRIES = Array.from(preferenceQuestion.entries());

export const MAX_MAJORS = 4;

export const MAX_HOBBIES = 5;

export const STEPS = [
  { title: "About you", description: "Basic info and bio" },
  { title: "Hobbies", description: "What do you enjoy?" },
  { title: "Questionnaires", description: "Your living habits" },
  { title: "Profile picture", description: "Add a profile picture" },
] as const;

export function emptyProfile(): UserProfile {
  return {
    user_id: "",
    is_active: true,
    fname: "",
    lname: "",
    gender: "",
    avatar_url: null,
    bio: "",
    majors: [],
    year: 0,
    created_at: "",
    last_edited_at: "",
    hobbies: [],
    preferences: [],
    lifestyle_images: [],
  };
}

export function validateAboutStep(p: UserProfile): string | null {
  if (!p.fname?.trim() || !p.lname?.trim()) {
    return "Please enter your first and last name.";
  }
  if (!p.gender) return "Please select a gender.";
  if (!p.majors?.length) return "Please choose at least one major.";
  if (p.majors.length > MAX_MAJORS) {
    return `You can choose at most ${MAX_MAJORS} majors.`;
  }
  if (!p.year || p.year < 1 || p.year > 5) return "Please select your year.";
  if (!p.bio?.trim()) return "Please write a short bio.";
  return null;
}

export function validateHobbiesStep(p: UserProfile): string | null {
  if (p.hobbies.length > MAX_HOBBIES) {
    return `You can choose at most ${MAX_HOBBIES} hobbies.`;
  }
  return null;
}

export function isYesNoOptions(options: string[]): boolean {
  return options.length === 2;
}

/** Yes → 5, No → 1; otherwise option index + 1 */
export function valueForOptionIndex(
  options: string[],
  optionIndex: number,
): number {
  if (isYesNoOptions(options)) {
    return options[optionIndex] === "Yes" ? 5 : 1;
  }
  return optionIndex + 1;
}

export function matchPreferenceForKeyword(
  prefs: Preference[],
  keyword: string,
  index: number,
): Preference | undefined {
  const k = keyword.toLowerCase();
  const byName = prefs.find(
    (p) => p.name.toLowerCase().replace(/\s+/g, " ") === k,
  );
  return byName ?? prefs[index];
}
