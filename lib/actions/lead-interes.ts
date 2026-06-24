"use server";

import { createClient } from "@/lib/supabase/server";

// Registra una señal de interés (clic en "Inscribirme" → WhatsApp) sin
// exigir teléfono/email, a diferencia de crearLead (formularios reales).
// Best-effort: si falla, no debe romper la navegación a WhatsApp.
export async function registrarInteresPlan(planNombre: string) {
  try {
    const supabase = await createClient();
    await supabase.from("leads").insert({
      nombre: `Interés en ${planNombre} (vía WhatsApp)`,
      telefono: "N/D",
      plan_interes: planNombre,
      origen: "planes",
      estado: "nuevo",
    });
  } catch {
    // silencioso: esto es solo telemetría de interés, no bloquea al usuario
  }
}
