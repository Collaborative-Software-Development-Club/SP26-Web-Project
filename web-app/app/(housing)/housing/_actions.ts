"use server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";

export async function getHousingListings(page: number, pageSize: number) {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from("housing_property_records")
    .select("*", { count: "exact" })
    .order("id", { ascending: true })
    .range(from, to);

  if (error) throw new Error(error.message);
  return { listings: data, total: count ?? 0 };
}

export async function getHousingListing(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("housing_property_records")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function assertCanFavoriteHousing() {
  const user = await requireAuth();
  return { userId: user.id };
}

export async function getSavedHousing(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc("get_saved_housing", { saved_user_id: userId }); // matches the function param

  if (error) throw new Error(error.message);

  // The function returns JSON, usually an array of housing_ids
  return data as string[]; 
}

export async function saveHousingListing(housingId: string) {
  const supabase = await createClient();
  const user = await requireAuth();

  // Use insert so this works even if the DB doesn't yet have the composite unique
  // constraint required for `onConflict: "user_id,housing_id"`.
  const { error } = await supabase.from("user_saves_housing").insert({
    user_id: user.id,
    housing_id: housingId,
  });

  // If you later add a unique constraint, inserts for existing rows will fail with
  // a duplicate key error; treat that as success (already saved).
  if (error) {
    const code = (error as { code?: string }).code;
    if (code === "23505") return { ok: true as const };
    throw new Error(
      JSON.stringify(
        {
          message: error.message,
          code: (error as { code?: string }).code,
          details: (error as { details?: string }).details,
          hint: (error as { hint?: string }).hint,
        },
        null,
        2,
      ),
    );
  }
  return { ok: true as const };
}

export async function unsaveHousingListing(housingId: string) {
  const supabase = await createClient();
  const user = await requireAuth();

  const { error } = await supabase
    .from("user_saves_housing")
    .delete()
    .eq("user_id", user.id)
    .eq("housing_id", housingId);

  if (error) {
    throw new Error(
      JSON.stringify(
        {
          message: error.message,
          code: (error as { code?: string }).code,
          details: (error as { details?: string }).details,
          hint: (error as { hint?: string }).hint,
        },
        null,
        2,
      ),
    );
  }
  return { ok: true as const };
}