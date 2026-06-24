"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { LeadEstado } from "@/lib/types/database";

export async function actualizarEstadoLead(id: string, estado: LeadEstado) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ estado }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { success: true };
}

export async function actualizarNotasLead(id: string, notas: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ notas }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/leads");
  return { success: true };
}

export async function eliminarLead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { success: true };
}
