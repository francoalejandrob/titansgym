"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlanCard } from "@/components/site/plan-card";
import { planesGenerales } from "@/lib/data/plans";
import type { Membresia } from "@/lib/types/database";

function getFallbackPlanes(): Membresia[] {
  return planesGenerales.map((p, i) => ({
    id: p.id,
    nombre: p.nombre,
    precio: p.precio,
    periodo: p.periodo as "mes" | "quincena",
    descripcion: null,
    beneficios: null,
    categoria: "general" as const,
    activa: true,
    visible_en_sitio: true,
    orden: i,
    destacado: "destacado" in p ? (p.destacado ?? false) : false,
    es_clase: false,
    horarios: null,
    imagen_url: null,
    precio_diario: null,
    requisito: "requisito" in p ? (p.requisito ?? null) : null,
    created_at: "",
    updated_at: "",
  }));
}

export function PlanesPreview({ phone, planes = [] }: { phone: string; planes?: Membresia[] }) {
  const generales = planes.length > 0
    ? planes.filter((m) => m.categoria === "general").slice(0, 4)
    : getFallbackPlanes();

  return (
    <section id="planes" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-14 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          Membresías
        </span>
        <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
          Elige tu plan
        </h2>
        <p className="mt-4 text-muted-foreground">
          Membresías flexibles para cada estilo de vida, con un plan sin
          restricciones recomendado para la mayoría.
        </p>
      </motion.div>

      {/* Mobile: snap scroll horizontal */}
      <div className="mt-10 sm:hidden">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pt-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {generales.map((plan) => (
            <div key={plan.id} className="w-[80vw] shrink-0 snap-start">
              <PlanCard plan={plan} phone={phone} />
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Desliza para ver más planes →
        </p>
      </div>

      {/* Desktop: grid */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        className="mt-14 hidden grid-cols-2 gap-6 sm:grid lg:grid-cols-4"
      >
        {generales.map((plan) => (
          <motion.div
            key={plan.id}
            variants={{
              hidden: { opacity: 0, y: 32 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
          >
            <PlanCard plan={plan} phone={phone} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 text-center"
      >
        <Button
          render={<Link href="/planes" />}
          nativeButton={false}
          size="lg"
          variant="secondary"
          className="cursor-pointer"
        >
          Ver todos los planes y clases especializadas
          <ArrowRight className="size-4" />
        </Button>
      </motion.div>
    </section>
  );
}
