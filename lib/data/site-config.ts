import type { ConfiguracionSitio, Horario } from "@/lib/types/database";

// Fallback estático: se usa si Supabase aún no está configurado/alcanzable
// o mientras no haya datos en `configuracion_sitio`. Una vez conectado
// Supabase, el admin puede editar todo esto desde el panel.
export const siteConfigFallback: ConfiguracionSitio = {
  id: 1,
  nombre_gym: "Titan's Gym",
  telefono_whatsapp: "+593963662370",
  email_contacto: "rosalespitac@gmail.com",
  direccion: "Av. Eleodoro Solórzano y Calle 48",
  ciudad: "La Libertad, Santa Elena, Ecuador",
  google_maps_url:
    "https://www.google.com/maps/place/TITAN%C2%B4S+GYM/@-2.230826,-80.8843887,721m/data=!3m2!1e3!4b1!4m6!3m5!1s0x902e097daab780af:0x7794a5de5c3dbec7!8m2!3d-2.230826!4d-80.8843887!16s%2Fg%2F11ybxdl3nh",
  latitud: -2.230826,
  longitud: -80.8843887,
  instagram_url: "https://instagram.com/titansgymec",
  facebook_url: null,
  tiktok_url: null,
  hero_titulo: "DESPIERTA AL TITÁN QUE LLEVAS DENTRO",
  hero_subtitulo: "Entrena con constancia. Vive como un titán.",
  updated_at: new Date().toISOString(),
};

export const horariosFallback: Horario[] = [
  { id: "1", dia: "lunes", abre: "06:00", cierra: "21:00", cerrado: false, orden: 1 },
  { id: "2", dia: "martes", abre: "06:00", cierra: "21:00", cerrado: false, orden: 2 },
  { id: "3", dia: "miercoles", abre: "06:00", cierra: "21:00", cerrado: false, orden: 3 },
  { id: "4", dia: "jueves", abre: "06:00", cierra: "21:00", cerrado: false, orden: 4 },
  { id: "5", dia: "viernes", abre: "06:00", cierra: "21:00", cerrado: false, orden: 5 },
  { id: "6", dia: "sabado", abre: "06:00", cierra: "17:00", cerrado: false, orden: 6 },
  { id: "7", dia: "domingo", abre: null, cierra: null, cerrado: true, orden: 7 },
];

export const diaLabel: Record<Horario["dia"], string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};
