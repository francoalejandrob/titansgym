"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  ConfiguracionSitio,
  DiaSemana,
  GaleriaCategoria,
} from "@/lib/types/database";

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/planes");
  revalidatePath("/galeria");
}

// ---------- Horarios ----------

export async function actualizarHorario(
  dia: DiaSemana,
  data: { abre: string | null; cierra: string | null; cerrado: boolean }
) {
  const supabase = await createClient();
  const { error } = await supabase.from("horarios").update(data).eq("dia", dia);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/contenido");
  revalidateSite();
  return { success: true };
}

// ---------- Galería ----------

export type GaleriaInput = {
  titulo: string;
  imagen_url: string;
  categoria: GaleriaCategoria;
  activo: boolean;
};

export async function crearGaleriaItem(input: GaleriaInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("galeria").insert(input);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/contenido");
  revalidateSite();
  return { success: true };
}

export async function actualizarGaleriaItem(id: string, input: Partial<GaleriaInput>) {
  const supabase = await createClient();
  const { error } = await supabase.from("galeria").update(input).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/contenido");
  revalidateSite();
  return { success: true };
}

export async function eliminarGaleriaItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("galeria").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/contenido");
  revalidateSite();
  return { success: true };
}

// ---------- Testimonios ----------

export type TestimonioInput = {
  nombre_cliente: string;
  texto: string;
  calificacion: number;
  foto_url: string | null;
  activo: boolean;
};

export async function crearTestimonio(input: TestimonioInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonios").insert(input);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/contenido");
  revalidateSite();
  return { success: true };
}

export async function actualizarTestimonio(id: string, input: Partial<TestimonioInput>) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonios").update(input).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/contenido");
  revalidateSite();
  return { success: true };
}

export async function eliminarTestimonio(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonios").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/contenido");
  revalidateSite();
  return { success: true };
}

// ---------- Mensajes de contacto ----------

export async function marcarMensajeLeido(id: string, leido: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("contacto").update({ leido }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/contenido");
  revalidatePath("/admin");
  return { success: true };
}

export async function eliminarMensaje(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("contacto").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/contenido");
  revalidatePath("/admin");
  return { success: true };
}

// ---------- Configuración del sitio ----------

export async function actualizarConfiguracionSitio(
  input: Partial<Omit<ConfiguracionSitio, "id" | "updated_at">>
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("configuracion_sitio")
    .update(input)
    .eq("id", 1);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/contenido");
  revalidateSite();
  return { success: true };
}
