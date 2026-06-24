import { z } from "zod";

export const leadSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "Ingresa tu nombre completo")
    .max(100, "Nombre demasiado largo"),
  telefono: z
    .string()
    .trim()
    .min(7, "Ingresa un teléfono válido")
    .max(20, "Teléfono demasiado largo")
    .regex(/^[\d+\s()-]+$/, "Solo números, espacios y + ( ) -"),
  email: z.string().trim().email("Ingresa un email válido").optional().or(z.literal("")),
  plan_interes: z.string().trim().max(100).optional(),
  mensaje: z.string().trim().max(500).optional(),
  origen: z.string().default("web"),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
