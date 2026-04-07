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

export type SavedHousingRow = {
  housing_id: string | null;
  address: string;
  listing_url: string | null;
};

export async function getSavedHousing(userId: string): Promise<SavedHousingRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_saved_housing", {
    saved_user_id: userId,
  });

  if (error) throw new Error(error.message);

  const raw = data as unknown;
  if (raw == null) return [];
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as SavedHousingRow[];
    } catch {
      return [];
    }
  }
  return raw as SavedHousingRow[];
}

export async function saveHousingListing(housingId: string) {
  const supabase = await createClient();
  const user = await requireAuth();

  // Capture a snapshot of the listing so the saved row can still render even if
  // the housing record is later deleted (housing_id becomes NULL via FK).
  const { data: listing, error: listingError } = await supabase
    .from("housing_property_records")
    .select("address,listing_url")
    .eq("id", housingId)
    .single();

  if (listingError) throw new Error(listingError.message);

  const { error } = await supabase.from("user_saves_housing").upsert(
    {
      user_id: user.id,
      housing_id: housingId,
      address: listing.address,
      listing_url: listing.listing_url ?? null,
    },
    { onConflict: "user_id,address" },
  );

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