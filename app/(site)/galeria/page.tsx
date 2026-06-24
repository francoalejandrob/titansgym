import type { Metadata } from "next";
import { GalleryFiltered } from "@/components/site/gallery-filtered";
import { getGaleriaActiva } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Conoce las instalaciones y equipos de Titan's Gym: zona de pesas libres, máquinas, cardio y más.",
};

export default async function GaleriaPage() {
  const items = await getGaleriaActiva();

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          Instalaciones
        </span>
        <h1 className="mt-3 font-heading text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
          Galería
        </h1>
        <p className="mt-4 text-muted-foreground">
          Conoce los equipos e instalaciones donde entrenarás cada día.
        </p>
      </div>

      <div className="mt-14">
        {items.length > 0 ? (
          <GalleryFiltered items={items} />
        ) : (
          <p className="text-center text-muted-foreground">
            Pronto agregaremos más fotos de nuestras instalaciones.
          </p>
        )}
      </div>
    </div>
  );
}
