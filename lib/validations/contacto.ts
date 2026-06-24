import { z } from "zod";

export const contactoSchema = z.object({
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
  email: z.string().trim().email("Ingresa un email válido"),
  mensaje: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más (mínimo 10 caracteres)")
    .max(1000, "Mensaje demasiado largo"),
});

export type ContactoFormValues = z.infer<typeof contactoSchema>;
