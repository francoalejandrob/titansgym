"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, ArrowRight } from "lucide-react";
import type { Promocion } from "@/lib/types/database";

export function PromoBanner({ promo }: { promo: Promocion }) {
  const src = promo.imagen_url || "/images/promo/tarjeta-fidelidad.jpg";

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl border border-primary/20"
      >
        {/* Blurred background */}
        <div className="absolute inset-0">
          <Image src={src} alt="" fill className="object-cover object-center opacity-15 blur-sm scale-110" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/70" />
        </div>

        {/* Red left accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary z-10" />

        <div className="relative z-10 grid sm:grid-cols-2 min-h-[420px]">
          {/* Left — flyer image as a contained card */}
          <div className="flex items-center justify-center p-8 sm:p-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, x: -20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative w-full max-w-[300px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl shadow-black/70 ring-1 ring-primary/30"
            >
              <Image src={src} alt={promo.titulo} fill className="object-cover object-center" />
            </motion.div>
          </div>

          {/* Right — content */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="flex flex-col justify-center gap-6 px-6 py-10 sm:px-10 sm:py-12"
          >
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              <Crown className="size-3.5" />
              Promoción activa
            </span>

            <div>
              <h2 className="font-heading text-4xl font-black uppercase leading-tight tracking-tight text-foreground sm:text-5xl">
                {promo.titulo}
              </h2>
              {promo.descuento && (
                <p className="mt-2 font-heading text-2xl font-extrabold uppercase text-primary">
                  {promo.descuento}
                </p>
              )}
            </div>

            <p className="max-w-sm leading-relaxed text-muted-foreground">
              {promo.descripcion}
            </p>

            {/* Mini stats */}
            <div className="flex items-center gap-6 border-t border-white/10 pt-6">
              {[
                { value: "5", label: "Renovaciones" },
                { value: "1", label: "Gratis", accent: true },
                { value: "∞", label: "Beneficios" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col">
                  <span className={`font-heading text-3xl font-black ${s.accent ? "text-primary" : "text-foreground"}`}>
                    {s.value}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/planes"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 h-11 text-sm font-bold font-heading uppercase tracking-wide text-white transition-colors hover:bg-red-500 cursor-pointer"
            >
              Ver planes
              <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
