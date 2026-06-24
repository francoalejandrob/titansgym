"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { GaleriaItem } from "@/lib/types/database";

const aspectPattern = [
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
];

export function GalleryGrid({ items }: { items: GaleriaItem[] }) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const close = () => setActiveIndex(null);
  const prev = React.useCallback(
    () =>
      setActiveIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length)),
    [items.length]
  );
  const next = React.useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length]
  );

  React.useEffect(() => {
    if (activeIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, prev, next]);

  const active = activeIndex !== null ? items[activeIndex] : null;

  return (
    <>
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
            className={cn(
              "group relative block w-full cursor-pointer overflow-hidden rounded-lg break-inside-avoid",
              aspectPattern[i % aspectPattern.length]
            )}
          >
            <Image
              src={item.imagen_url}
              alt={item.titulo}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="gallery-treatment object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/0 to-black/0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex items-center gap-1.5 text-sm font-medium text-white">
                <Expand className="size-4" />
                {item.titulo}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <Dialog open={activeIndex !== null} onOpenChange={(open) => !open && close()}>
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl sm:max-w-4xl border-none bg-transparent p-0 shadow-none"
        >
          <DialogTitle className="sr-only">{active?.titulo}</DialogTitle>
          {active && (
            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black">
                <Image
                  src={active.imagen_url}
                  alt={active.titulo}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-3 text-center text-sm font-medium text-foreground">
                {active.titulo}
              </p>

              <button
                onClick={close}
                aria-label="Cerrar"
                className="absolute -top-3 -right-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-card text-foreground shadow-lg"
              >
                <X className="size-4" />
              </button>
              <button
                onClick={prev}
                aria-label="Anterior"
                className="absolute left-2 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={next}
                aria-label="Siguiente"
                className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
