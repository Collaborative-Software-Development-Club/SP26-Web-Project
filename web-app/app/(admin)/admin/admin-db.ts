"use server";

import { getAdminStatus, requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

//Requires admin check before calling
export async function deleteHousingListing(id: string) {
  const supabase = await createClient();
  const user = await requireAuth();
  const isAdmin = await getAdminStatus(user);
  if (!isAdmin) {
    redirect("/housing");
  }

  const { error } = await supabase
    .from("housing_property_records")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/housing");
  return { ok: true as const };
}