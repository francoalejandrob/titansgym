"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitTestimonio(data: {
  nombre_cliente: string;
  texto: string;
  calificacion: number;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonios").insert({
    nombre_cliente: data.nombre_cliente.trim(),
    texto: data.texto.trim(),
    calificacion: data.calificacion,
    activo: false, // pending admin approval
  });
  if (error) throw new Error("No se pudo enviar la reseña");
}
