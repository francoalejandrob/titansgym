"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Testimonio } from "@/lib/types/database";

export function TestimoniosCarousel({ items }: { items: Testimonio[] }) {
  const trackRef = React.useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  function scroll(direction: "left" | "right") {
    const node = trackRef.current;
    if (!node) return;
    const cardWidth = node.firstElementChild?.clientWidth ?? 320;
    node.scrollBy({
      left: direction === "left" ? -cardWidth - 24 : cardWidth + 24,
      behavior: "smooth",
    });
  }

  return (
    <section
      id="testimonios"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24"
    >
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
        <div className="text-center sm:text-left">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Testimonios
          </span>
          <h2 className="mt-3 font-heading text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
            Lo que dicen nuestros titanes
          </h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <Button
            variant="secondary"
            size="icon"
            className="cursor-pointer"
            onClick={() => scroll("left")}
            aria-label="Anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="cursor-pointer"
            onClick={() => scroll("right")}
            aria-label="Siguiente"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <motion.div
        ref={trackRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className="flex w-[85%] shrink-0 snap-start flex-col rounded-xl border border-border bg-card p-7 sm:w-[380px]"
          >
            <Quote className="size-8 text-primary/40" />
            <div className="mt-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-4"
                  fill={i < t.calificacion ? "currentColor" : "none"}
                  strokeWidth={1.5}
                  color="var(--color-primary)"
                />
              ))}
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              &ldquo;{t.texto}&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage src={t.foto_url ?? undefined} alt={t.nombre_cliente} />
                <AvatarFallback className="bg-primary/15 text-primary">
                  {t.nombre_cliente.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <p className="font-semibold text-foreground">{t.nombre_cliente}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
