"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createMembresia(data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from("membresias").insert(data as never);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/membresias");
  revalidatePath("/planes");
}

export async function updateMembresia(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("membresias")
    .update({ ...data, updated_at: new Date().toISOString() } as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/membresias");
  revalidatePath("/planes");
}

export async function deleteMembresia(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("membresias").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/membresias");
  revalidatePath("/planes");
}

export async function toggleMembresiaVisibilidad(id: string, visible: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("membresias")
    .update({ visible_en_sitio: visible, updated_at: new Date().toISOString() } as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/membresias");
  revalidatePath("/planes");
}

export async function moverMembresia(id: string, direction: "up" | "down", currentOrden: number) {
  const supabase = await createClient();
  const newOrden = direction === "up" ? currentOrden - 1 : currentOrden + 1;
  const { error } = await supabase
    .from("membresias")
    .update({ orden: newOrden, updated_at: new Date().toISOString() } as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/membresias");
}
