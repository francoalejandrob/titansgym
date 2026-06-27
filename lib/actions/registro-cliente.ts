"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitRegistroCliente(data: {
  nombre: string;
  correo: string;
  telefono?: string;
  fecha_nacimiento?: string;
  sexo?: "masculino" | "femenino" | "otro";
  peso?: number | null;
  talla?: number | null;
  objetivo_nutricional?: "perdida_peso" | "ganancia_muscular" | "mantenimiento" | "medico" | null;
  nivel_actividad?: "sedentario" | "levemente_activo" | "moderadamente_activo" | "muy_activo" | null;
  preferencia_alimentaria?: "omnivoro" | "vegetariano" | "vegano" | "otro" | null;
  medicamentos?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("clientes").insert({
    nombre: data.nombre.trim(),
    correo: data.correo.trim() || null,
    telefono: data.telefono || null,
    fecha_nacimiento: data.fecha_nacimiento || null,
    sexo: data.sexo || null,
    peso: data.peso ?? null,
    talla: data.talla ?? null,
    objetivo_nutricional: data.objetivo_nutricional ?? null,
    nivel_actividad: data.nivel_actividad ?? null,
    preferencia_alimentaria: data.preferencia_alimentaria ?? null,
    medicamentos: data.medicamentos || null,
    activo: true,
  });
  if (error) throw new Error("No se pudo guardar el registro");
}
