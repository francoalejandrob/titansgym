"use server";

import { createClient } from "@/lib/supabase/server";
import { contactoSchema } from "@/lib/validations/contacto";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function enviarContacto(
  values: unknown
): Promise<ActionResult> {
  const parsed = contactoSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: "Revisa los datos del formulario." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("contacto").insert({
      nombre: parsed.data.nombre,
      telefono: parsed.data.telefono,
      email: parsed.data.email,
      mensaje: parsed.data.mensaje,
    });

    if (error) {
      return {
        success: false,
        error: "No pudimos enviar tu mensaje. Inténtalo de nuevo.",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "No pudimos enviar tu mensaje. Inténtalo de nuevo.",
    };
  }
}
