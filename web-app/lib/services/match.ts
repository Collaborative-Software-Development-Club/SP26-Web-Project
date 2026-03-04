import { createClient } from "@/lib/supabase/server";

export type RoommatePreference = {
    preference_id: string;
    importance: number;
};

// Service for user profile team to create roommate preference
export async function createRoommatePreference({
    roommate_preferences
  }: {
    roommate_preferences: RoommatePreference[]
  }) {
    const supabase = await createClient();

    if (roommate_preferences.length === 0) {
      throw new Error("No roommate preferences provided");
    }

    if (roommate_preferences.some((preference) => preference.importance < 0 || preference.importance > 5)) {
      throw new Error("Importance must be between 0 and 5");
    }

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();
  
    if (userError || user === null) {
        throw new Error(`Error fetching current user: ${userError?.message}`);
      }
  
    const { data, error } = await supabase
      .from("discovery_roommate_preferences")
      .upsert(
        roommate_preferences.map((preference) => ({
          user_id: user.id,
          preference_id: preference.preference_id,
          importance: preference.importance
        })),
        { onConflict: "user_id,preference_id" }
      );

    if (error) {
      throw new Error(`Error creating roommate preference: ${error.message}`);
    }
}


//Service for the discovery team to match a user to potential roommates
/* Numeric preference value on 1–5 scale (the "rating" for a preference) */
export type PreferenceValue = 1 | 2 | 3 | 4 | 5;

/* One row of data that combines a user's preference value and how important it is to them */
export type UserPreferenceWithImportance = {
  user_id: string;
  preference_id: string;
  value: PreferenceValue; /* the actual preference value (1–5) */
  importance: number; /* how much this user cares about this preference (0–5) */
};

/* The output object we use when returning match scores.
   Lower match_score means a better (closer) match. */
export type MatchScore = {
  user_id: string;
  roommate_id: string;
  match_score: number;
};

/* Object so we can type-cast Supabase rows without running into errors */
type PreferenceValueRow = {
  user_id: string;
  preference_id: string;
  user_preferences: {
    value: number | null;
  } | null;
};

/* Internal helper algorithm that returns a single MatchScore object between
   one user's preferences and one roommate's preferences.
   Formula for each preference k:
     distance_k = |user_value_k - roommate_value_k|
     weight_k   = max(user_importance_k, roommate_importance_k)
     match_score_k = distance_k * weight_k
   Overall match_score is the sum of contribution_k across all k.
   If we do not have preferences or importance assigned the score will default to 0

   Input: User_id, roommate_id, userPrefs, roommatePrefs
   Output: MatchScore object
   */
export function computeMatchScoreForPair(
  user_id: string,
  roommate_id: string,
  userPrefs: UserPreferenceWithImportance[],
  roommatePrefs: UserPreferenceWithImportance[],
): MatchScore {
  const roommateMap = new Map<string, UserPreferenceWithImportance>();

  for (const rp of roommatePrefs) {
    roommateMap.set(rp.preference_id, rp);
  }

  let score = 0;

  for (const up of userPrefs) {
    const roommatePref = roommateMap.get(up.preference_id);
    if (!roommatePref) {
      /* If the roommate has no value for this preference we skip it. */
      continue;
    }

    const userValue = up.value;
    const roommateValue = roommatePref.value;

    const distance = Math.abs(userValue - roommateValue); /* how far apart the values are on the 1–5 scale */
    const weight = Math.max(up.importance ?? 0, roommatePref.importance ?? 0); /* take the max importance between the two users */

    score += distance * weight;
  }

  return {
    user_id,
    roommate_id,
    match_score: score,
  };
}

/* Internal Helper Function that returns a list of Match Score objects for all specificed roommmates
   Input: User_id, allPreferences, roommate_ids
   
   **allPreferences: a List of all UserPreferenceWithImportance objects for all users (specific user + potential roommates)
   Output: MatchScore[] - Ordered List of MatchScore Objects sorted from lowest match score to highest
*/
export function computeMatchScoresForRoommates(
  user_id: string,
  allPreferences: UserPreferenceWithImportance[],
  roommate_ids: string[],
): MatchScore[] {
  const byUser = new Map<string, UserPreferenceWithImportance[]>();

  for (const pref of allPreferences) {
    if (!byUser.has(pref.user_id)) {
      byUser.set(pref.user_id, []);
    }
    byUser.get(pref.user_id)!.push(pref);
  }

  const userPrefs = byUser.get(user_id) ?? [];

  const results: MatchScore[] = [];

  for (const roommate_id of roommate_ids) {
    if (roommate_id === user_id) {
      continue;
    }

    const roommatePrefs = byUser.get(roommate_id) ?? [];

    const matchScore = computeMatchScoreForPair(
      user_id,
      roommate_id,
      userPrefs,
      roommatePrefs,
    );

    results.push(matchScore);
  }

  return results.sort((a, b) => a.match_score - b.match_score);
}

/* 
  Function gets all active user profiles and then takes a user_id to return a sorted list of match score objects
  Matches a user with all active users in the database based on the distance in preferences
  If we do not have preferences or importance assigned the score will default to 0
  
  TO NOTE: This function does not write to discovery_matches. We need to alter the Supabase to store MatchScore Values */
export async function getMatchScoresForUser(
  user_id: string,
): Promise<MatchScore[]> {
  const supabase = await createClient();

  /* 1) Fetching all active users from the Supabase Relation - user_profiles
    TEMPORARY: Queries all active users. Future implementation can break this function up to filter.
    Gets all user ids (user_id + potential roommate ids) to use ComputeMatchScoresForRoommates
  */
  const { data: profiles, error: profilesError } = await supabase
    .from("user_profiles")
    .select("user_id, is_active")
    .neq("user_id", user_id)
    .eq("is_active", true);

  if (profilesError) {
    throw new Error(
      `Failed to fetch roommate candidates: ${profilesError.message}`,
    );
  }

  const roommateIds = (profiles ?? []).map((p) => p.user_id as string);

  if (roommateIds.length === 0) {
    return [];
  }

  const allUserIds = [user_id, ...roommateIds];

  /*2)  Fetch preference id and the value for that preference for all users */
  const { data: valueRows, error: valueError } = await supabase
    .from("user_profile_preferences")
    .select("user_id, preference_id, user_preferences(value)")
    .in("user_id", allUserIds);

  if (valueError) {
    throw new Error(
      `Failed to fetch preference values: ${valueError.message}`,
    );
  }

  /* 3) Fetch importance values for all relevant users from user_roommate_preferences */
  const { data: importanceRows, error: importanceError } = await supabase
    .from("user_roommate_preferences")
    .select("user_id, preference_id, importance")
    .in("user_id", allUserIds);

  if (importanceError) {
    throw new Error(
      `Failed to fetch roommate importance: ${importanceError.message}`,
    );
  }

  // Map for "{user_id}:{preference_id}"" -> importance value */
  const importanceMap = new Map<string, number>();

  for (const row of importanceRows ?? []) {
    const key = `${row.user_id}:${row.preference_id}`;
    importanceMap.set(key, row.importance ?? 0);
  }

  /* 4) Building the UserPreferenceWithImportance[] to pass to our helper function */
  const allPreferences: UserPreferenceWithImportance[] = [];
  const typedValueRows = (valueRows ?? []) as unknown as PreferenceValueRow[];

  for (const row of typedValueRows) {
    //Grab the value for the nested user_preferences object 
    const rawValue = row.user_preferences?.value;
    //Check if that value is missing/not found
    if (rawValue === null || rawValue === undefined) {
      continue;
    }

    const value = Number(rawValue) as PreferenceValue;

    const key = `${row.user_id}:${row.preference_id}`;
    const importance = importanceMap.get(key) ?? 0;

    allPreferences.push({
      user_id: row.user_id as string,
      preference_id: row.preference_id as string,
      value,
      importance,
    });
  }

  /* 5) Use the helper to compute and sort scores */
  return computeMatchScoresForRoommates(user_id, allPreferences, roommateIds);
}

