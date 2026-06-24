"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/site/animated-counter";

const stats = [
  { value: 15, suffix: "h", label: "Abierto al día, de lunes a viernes" },
  { value: 6, suffix: "", label: "Días de atención a la semana" },
  { value: 10, suffix: "+", label: "Planes y membresías flexibles" },
  { value: 3, suffix: "", label: "Disciplinas: Taekwondo, Dance y Power" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function StatsBar() {
  return (
    <section className="border-y border-border bg-card/40">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4 sm:gap-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={item} className="text-center">
            <p className="font-heading text-4xl font-extrabold text-primary sm:text-5xl">
              <AnimatedCounter to={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
