import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryGrid } from "@/components/site/gallery-grid";
import type { GaleriaItem } from "@/lib/types/database";

export function GaleriaPreview({ items }: { items: GaleriaItem[] }) {
  if (items.length === 0) return null;

  return (
    <section id="galeria" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-14 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          Instalaciones
        </span>
        <h2 className="mt-3 font-heading text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
          Conoce nuestras instalaciones
        </h2>
      </div>

      <div className="mt-14">
        <GalleryGrid items={items.slice(0, 8)} />
      </div>

      <div className="mt-10 text-center">
        <Button
          render={<Link href="/galeria" />}
          nativeButton={false}
          size="lg"
          variant="secondary"
          className="cursor-pointer"
        >
          Ver galería completa
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
