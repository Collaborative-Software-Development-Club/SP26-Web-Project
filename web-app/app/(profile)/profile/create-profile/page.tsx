import { getMajorsHobbiesPreferences } from "@/app/(profile)/_actions";
import type {
  HobbyCategoryGroup,
  Major,
  Preference,
  UserProfile,
} from "@/app/(profile)/types";
import { requireAuth } from "@/lib/auth";
import { getUserProfiles } from "@/lib/services/profile";
import { CreateProfileClient } from "./create-profile-client";
import {
  PREFERENCE_ENTRIES,
  matchPreferenceForKeyword,
} from "./helpers";

function normalizeProfileForForm(
  profile: UserProfile,
  preferences: Preference[],
): UserProfile {
  return {
    ...profile,
    user_id: profile.user_id,
    is_active: profile.is_active ?? true,
    fname: profile.fname ?? "",
    lname: profile.lname ?? "",
    gender: profile.gender ?? "",
    avatar_url: profile.avatar_url ?? "",
    bio: profile.bio ?? "",
    majors: (profile.majors ?? []).map((major) => ({
      ...major,
      major_id: String(major.major_id),
    })),
    year: profile.year ?? 0,
    created_at: profile.created_at ?? "",
    last_edited_at: profile.last_edited_at ?? "",
    hobbies: (profile.hobbies ?? []).map((hobby) => ({
      ...hobby,
      hobby_id: String(hobby.hobby_id),
    })),
    lifestyle_images: (profile.lifestyle_images ?? []),
    preferences,
  };
}

export default async function CreateProfilePage() {
  const user = await requireAuth();
  const existingProfile = (await getUserProfiles([user.id])).at(0) ?? null;
  const result = await getMajorsHobbiesPreferences();

  let initialMajors: Major[] = [];
  let initialHobbiesCatalog: HobbyCategoryGroup[] = [];
  let initialPreferences: Preference[] = [];
  let catalogError: string | null = null;
  let initialProfile: UserProfile | null = null;

  if ("error" in result) {
    catalogError = result.error;
    initialPreferences = PREFERENCE_ENTRIES.map(([keyword], i) => {
      const existingPreference = existingProfile
        ? matchPreferenceForKeyword(existingProfile.preferences ?? [], keyword, i)
        : undefined;

      if (existingPreference) {
        return {
          ...existingPreference,
          preference_id: String(existingPreference.preference_id),
        };
      }

      return {
        preference_id: keyword,
        name: keyword,
        value: 0,
      };
    });
  } else {
    initialHobbiesCatalog = result.hobbiesData;
    initialMajors = result.majorData;
    initialPreferences = PREFERENCE_ENTRIES.map(([keyword], i) => {
      const existingPreference = existingProfile
        ? matchPreferenceForKeyword(existingProfile.preferences ?? [], keyword, i)
        : undefined;
      const apiPref = matchPreferenceForKeyword(
        result.preferencesData,
        keyword,
        i,
      );

      if (apiPref) {
        return {
          ...apiPref,
          value: existingPreference?.value ?? 0,
        };
      }

      if (existingPreference) {
        return {
          ...existingPreference,
          preference_id: String(existingPreference.preference_id),
        };
      }

      return { preference_id: keyword, name: keyword, value: 0 };
    });
  }

  if (existingProfile) {
    initialProfile = normalizeProfileForForm(existingProfile, initialPreferences);
  }

  return (
    <CreateProfileClient
      initialMajors={initialMajors}
      initialHobbiesCatalog={initialHobbiesCatalog}
      initialPreferences={initialPreferences}
      initialProfile={initialProfile}
      catalogError={catalogError}
    />
  );
}
