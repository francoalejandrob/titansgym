"use client";

import { motion } from "framer-motion";
import {
  Dumbbell,
  Apple,
  Scale,
  Flame,
  Coffee,
  Crown,
} from "lucide-react";

const beneficios = [
  {
    icon: Dumbbell,
    title: "Acceso ilimitado a máquinas",
    description:
      "Equipos completos para tren superior, inferior y zona de pesas libres, sin restricciones de horario en tu plan.",
  },
  {
    icon: Apple,
    title: "Guía de alimentación",
    description:
      "Recomendaciones nutricionales para acompañar tu entrenamiento y maximizar resultados.",
  },
  {
    icon: Scale,
    title: "Control de peso mensual",
    description:
      "Seguimiento de tu progreso físico mes a mes para que veas tu evolución real.",
  },
  {
    icon: Flame,
    title: "Clases especializadas",
    description:
      "Taekwondo, Titan Dance y Titan Power: disciplinas adicionales para entrenar como un titán.",
  },
  {
    icon: Coffee,
    title: "Barra de batidos y café",
    description:
      "Batido proteico y café gourmet disponibles dentro del gimnasio para recargar energía.",
  },
  {
    icon: Crown,
    title: "Tarjeta de fidelidad",
    description:
      "Acumula 5 renovaciones de tu membresía y la 6ta es completamente gratis.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Beneficios() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          Por qué Titan&apos;s Gym
        </span>
        <h2 className="mt-3 font-heading text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
          Todo lo que necesitas para entrenar en serio
        </h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {beneficios.map((b) => (
          <motion.div
            key={b.title}
            variants={item}
            className="group cursor-pointer rounded-xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg hover:shadow-black/30"
          >
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <b.icon className="size-6" />
            </div>
            <h3 className="mt-5 font-heading text-xl font-bold uppercase tracking-tight">
              {b.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {b.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
