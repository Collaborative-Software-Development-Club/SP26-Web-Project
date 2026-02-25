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
