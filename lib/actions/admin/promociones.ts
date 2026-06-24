"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Promocion } from "@/lib/types/database";

export type PromocionInput = {
  titulo: string;
  descripcion: string;
  descuento: string;
  imagen_url: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  activa: boolean;
};

export async function crearPromocion(input: PromocionInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("promociones").insert(input);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/promociones");
  revalidatePath("/");
  return { success: true };
}

export async function actualizarPromocion(id: string, input: Partial<PromocionInput>) {
  const supabase = await createClient();
  const { error } = await supabase.from("promociones").update(input).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/promociones");
  revalidatePath("/");
  return { success: true };
}

export async function eliminarPromocion(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("promociones").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/promociones");
  revalidatePath("/");
  return { success: true };
}

export async function reordenarPromociones(orden: { id: string; orden: number }[]) {
  const supabase = await createClient();
  await Promise.all(
    orden.map(({ id, orden: ord }) =>
      supabase.from("promociones").update({ orden: ord }).eq("id", id)
    )
  );
  revalidatePath("/admin/promociones");
  revalidatePath("/");
  return { success: true };
}

export type { Promocion };
