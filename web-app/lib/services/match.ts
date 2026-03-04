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

/* Internal helper algorithm that returns a single MatchScore object between
   one user's preferences and one roommate's preferences.
   Formula for each preference k:
     distance_k = |user_value_k - roommate_value_k|
     weight_k   = max(user_importance_k, roommate_importance_k)
     match_score_k = distance_k * weight_k
   Overall match_score is the sum of contribution_k across all k.
   
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
