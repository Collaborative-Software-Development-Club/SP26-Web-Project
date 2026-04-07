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