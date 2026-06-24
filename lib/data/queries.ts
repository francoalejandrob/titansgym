import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  horariosFallback,
  siteConfigFallback,
} from "@/lib/data/site-config";
import type {
  ConfiguracionSitio,
  GaleriaItem,
  Horario,
  Membresia,
  Promocion,
  Testimonio,
} from "@/lib/types/database";

// Todas las queries públicas degradan a datos estáticos de fallback si
// Supabase aún no está configurado (variables de entorno pendientes) o
// la consulta falla, para que el sitio nunca se caiga en producción.
// Envueltas en `cache()` para deduplicar llamadas entre el layout y las
// páginas dentro de la misma request.

export const getConfiguracionSitio = cache(
  async (): Promise<ConfiguracionSitio> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("configuracion_sitio")
        .select("*")
        .eq("id", 1)
        .single();

      if (error || !data) return siteConfigFallback;
      return data;
    } catch {
      return siteConfigFallback;
    }
  }
);

export const getHorarios = cache(async (): Promise<Horario[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("horarios")
      .select("*")
      .order("orden", { ascending: true });

    if (error || !data || data.length === 0) return horariosFallback;
    return data;
  } catch {
    return horariosFallback;
  }
});

export const getPromocionesActivas = cache(async (): Promise<Promocion[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("promociones")
      .select("*")
      .eq("activa", true)
      .order("orden", { ascending: true });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
});

export const getTestimoniosActivos = cache(async (): Promise<Testimonio[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonios")
      .select("*")
      .eq("activo", true)
      .order("orden", { ascending: true });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
});

export const getGaleriaActiva = cache(async (): Promise<GaleriaItem[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("galeria")
      .select("*")
      .eq("activo", true)
      .order("orden", { ascending: true });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
});

export const getMembresiasSitio = cache(async (): Promise<Membresia[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("membresias")
      .select("*")
      .eq("activa", true)
      .eq("visible_en_sitio", true)
      .order("orden", { ascending: true });

    if (error || !data || data.length === 0) return [];
    return data;
  } catch {
    return [];
  }
});
