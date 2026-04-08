import { getMajorsHobbiesPreferences } from "@/app/(profile)/_actions";
import type {
  HobbyCategoryGroup,
  Major,
  Preference,
} from "@/app/(profile)/types";
import { CreateProfileClient } from "./create-profile-client";
import {
  PREFERENCE_ENTRIES,
  matchPreferenceForKeyword,
} from "./helpers";

export default async function CreateProfilePage() {
  const result = await getMajorsHobbiesPreferences();

  let initialMajors: Major[] = [];
  let initialHobbiesCatalog: HobbyCategoryGroup[] = [];
  let initialPreferences: Preference[] = [];
  let catalogError: string | null = null;

  if ("error" in result) {
    catalogError = result.error;
    initialPreferences = PREFERENCE_ENTRIES.map(([keyword]) => ({
      preference_id: keyword,
      name: keyword,
      value: 0,
    }));
  } else {
    initialHobbiesCatalog = result.hobbiesData;
    initialMajors = result.majorData;
    initialPreferences = PREFERENCE_ENTRIES.map(([keyword], i) => {
      const apiPref = matchPreferenceForKeyword(
        result.preferencesData,
        keyword,
        i,
      );
      if (!apiPref) {
        return { preference_id: keyword, name: keyword, value: 0 };
      }
      return { ...apiPref, value: 0 };
    });
  }

  return (
    <CreateProfileClient
      initialMajors={initialMajors}
      initialHobbiesCatalog={initialHobbiesCatalog}
      initialPreferences={initialPreferences}
      catalogError={catalogError}
    />
  );
}
