"use server";

import { createClient } from "@/lib/supabase/server";
import { leadSchema } from "@/lib/validations/lead";
import type { ActionResult } from "@/lib/actions/contacto";

export async function crearLead(values: unknown): Promise<ActionResult> {
  const parsed = leadSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: "Revisa los datos del formulario." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("leads").insert({
      nombre: parsed.data.nombre,
      telefono: parsed.data.telefono,
      email: parsed.data.email || null,
      plan_interes: parsed.data.plan_interes || null,
      mensaje: parsed.data.mensaje || null,
      origen: parsed.data.origen,
    });

    if (error) {
      return {
        success: false,
        error: "No pudimos registrar tu solicitud. Inténtalo de nuevo.",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "No pudimos registrar tu solicitud. Inténtalo de nuevo.",
    };
  }
}
