"use client";

import * as React from "react";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GaleriaCategoria, GaleriaItem } from "@/lib/types/database";

const categorias: { value: GaleriaCategoria | "todas"; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "instalaciones", label: "Instalaciones" },
  { value: "entrenamiento", label: "Entrenamiento" },
  { value: "clases", label: "Clases" },
];

export function GalleryFiltered({ items }: { items: GaleriaItem[] }) {
  const [filtro, setFiltro] = React.useState<GaleriaCategoria | "todas">("todas");

  const disponibles = new Set(items.map((i) => i.categoria));
  const tabs = categorias.filter(
    (c) => c.value === "todas" || disponibles.has(c.value)
  );

  const filtrados =
    filtro === "todas" ? items : items.filter((i) => i.categoria === filtro);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {tabs.map((c) => (
          <Button
            key={c.value}
            onClick={() => setFiltro(c.value)}
            variant={filtro === c.value ? "default" : "secondary"}
            size="sm"
            className={cn("cursor-pointer rounded-full")}
          >
            {c.label}
          </Button>
        ))}
      </div>

      <div className="mt-10">
        <GalleryGrid items={filtrados} />
      </div>
    </div>
  );
}
