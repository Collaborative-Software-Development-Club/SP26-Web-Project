import { getHobbiesAndPreferences } from "@/app/(profile)/_actions";
import type { HobbyCategoryGroup, Preference } from "@/app/(profile)/types";
import { CreateProfileClient } from "./create-profile-client";
import {
  PREFERENCE_ENTRIES,
  matchPreferenceForKeyword,
} from "./helpers";

export default async function CreateProfilePage() {
  const result = await getHobbiesAndPreferences();

  let hobbiesCatalog: HobbyCategoryGroup[] = [];
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
    hobbiesCatalog = result.hobbies;
    initialPreferences = PREFERENCE_ENTRIES.map(([keyword], i) => {
      const apiPref = matchPreferenceForKeyword(
        result.preferences,
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
      initialHobbiesCatalog={hobbiesCatalog}
      initialPreferences={initialPreferences}
      catalogError={catalogError}
    />
  );
}
