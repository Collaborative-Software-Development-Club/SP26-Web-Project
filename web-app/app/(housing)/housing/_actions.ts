"use server";
import { createClient } from "@/lib/supabase/server";

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