import type { ConfiguracionSitio, Horario } from "@/lib/types/database";

const diaSchemaMap: Record<Horario["dia"], string> = {
  lunes: "Monday",
  martes: "Tuesday",
  miercoles: "Wednesday",
  jueves: "Thursday",
  viernes: "Friday",
  sabado: "Saturday",
  domingo: "Sunday",
};

export function buildGymStructuredData(
  config: ConfiguracionSitio,
  horarios: Horario[]
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const openingHours = horarios
    .filter((h) => !h.cerrado && h.abre && h.cierra)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: diaSchemaMap[h.dia],
      opens: h.abre,
      closes: h.cierra,
    }));

  return {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    name: config.nombre_gym,
    description: config.hero_subtitulo,
    url: siteUrl,
    image: `${siteUrl}/images/brand/logo.jpg`,
    telephone: config.telefono_whatsapp,
    email: config.email_contacto,
    priceRange: "$15-$35",
    address: {
      "@type": "PostalAddress",
      streetAddress: config.direccion,
      addressLocality: config.ciudad,
      addressCountry: "EC",
    },
    ...(config.latitud && config.longitud
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: config.latitud,
            longitude: config.longitud,
          },
        }
      : {}),
    openingHoursSpecification: openingHours,
    sameAs: [config.instagram_url, config.facebook_url, config.tiktok_url].filter(
      Boolean
    ),
  };
}
