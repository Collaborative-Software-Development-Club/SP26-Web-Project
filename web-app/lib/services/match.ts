import { createClient } from "@/lib/supabase/server";

export type RoommatePreference = {
    preference_id: string;
    importance: number;
};

export const DiscoveryService = {
    createRoommatePreference: async ({ roommate_preference }: { roommate_preference: RoommatePreference[] }) => {
        return await createRoommatePreference({ roommate_preference });
    },
};

// Service for user profile team to create roommate preference
async function createRoommatePreference({
    roommate_preference
  }: {
    roommate_preference: RoommatePreference[]
  }) {
    const supabase = await createClient();
  
    const {
      data: { user }
    } = await supabase.auth.getUser();
  
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }
  
    const { data, error } = await supabase
      .from("discovery_roommate_preferences")
      .insert(
        roommate_preference.map((preference) => ({
          user_id: user.id,
          preference_id: preference.preference_id,
          importance: preference.importance
        }))
      );
  
    if (error) {
      return { success: false, error: error.message };
    }
  
    return { success: true, data };
};