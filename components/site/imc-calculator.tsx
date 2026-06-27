"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Clasificacion = {
  label: string;
  rango: string;
  color: string;
  recomendacion: string;
  percent: number;
};

function clasificar(imc: number): Clasificacion {
  if (imc < 18.5)
    return {
      label: "Bajo peso",
      rango: "< 18.5",
      color: "bg-sky-500",
      recomendacion:
        "Te recomendamos un plan de entrenamiento de fuerza junto a nuestra guía de alimentación para ganar masa muscular de forma saludable.",
      percent: Math.max(8, (imc / 18.5) * 25),
    };
  if (imc < 25)
    return {
      label: "Peso normal",
      rango: "18.5 – 24.9",
      color: "bg-success",
      recomendacion:
        "¡Vas muy bien! Mantén tu condición con entrenamiento constante y nuestras clases especializadas como Titan Power o Titan Dance.",
      percent: 25 + ((imc - 18.5) / 6.4) * 25,
    };
  if (imc < 30)
    return {
      label: "Sobrepeso",
      rango: "25 – 29.9",
      color: "bg-amber-500",
      recomendacion:
        "Un plan de entrenamiento regular junto a nuestra guía de alimentación y control de peso mensual puede ayudarte a alcanzar tu peso ideal.",
      percent: 50 + ((imc - 25) / 4.9) * 25,
    };
  return {
    label: "Obesidad",
    rango: "≥ 30",
    color: "bg-destructive",
    recomendacion:
      "Te recomendamos acercarte para diseñar un plan de entrenamiento progresivo junto a nuestra guía de alimentación y seguimiento mensual.",
    percent: Math.min(96, 75 + ((imc - 30) / 10) * 25),
  };
}

export function ImcCalculator({ phone }: { phone: string }) {
  const [peso, setPeso] = React.useState("");
  const [altura, setAltura] = React.useState("");
  const [resultado, setResultado] = React.useState<{
    imc: number;
    clasificacion: Clasificacion;
  } | null>(null);

  function calcular(e: React.FormEvent) {
    e.preventDefault();
    const pesoKg = parseFloat(peso.replace(",", "."));
    const alturaCm = parseFloat(altura.replace(",", "."));
    if (!pesoKg || !alturaCm || pesoKg <= 0 || alturaCm <= 0) return;
    const alturaM = alturaCm / 100;
    const imc = pesoKg / (alturaM * alturaM);
    setResultado({ imc, clasificacion: clasificar(imc) });
  }

  const whatsappHref = resultado
    ? buildWhatsappLink(
        phone,
        `Hola Titan's Gym, calculé mi IMC (${resultado.imc.toFixed(1)} - ${resultado.clasificacion.label}) y quiero asesoría para un plan de entrenamiento.`
      )
    : "#";

  return (
    <section id="imc" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-14 sm:py-24">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid lg:grid-cols-2">
          {/* Form */}
          <div className="flex flex-col justify-center p-6 sm:p-12">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              <Calculator className="size-4" />
              Herramienta gratuita
            </span>
            <h2 className="mt-4 font-heading text-2xl font-extrabold uppercase tracking-tight sm:text-4xl">
              Calcula tu IMC
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Conoce tu Índice de Masa Corporal y recibe una recomendación
              inicial para tu plan de entrenamiento.
            </p>

            <form onSubmit={calcular} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input
                    id="peso"
                    inputMode="decimal"
                    placeholder="70"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="altura">Altura (cm)</Label>
                  <Input
                    id="altura"
                    inputMode="decimal"
                    placeholder="175"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full cursor-pointer">
                Calcular IMC
              </Button>
            </form>

            {/* Result inline on mobile (shows only when there is one) */}
            <AnimatePresence>
              {resultado && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 overflow-hidden lg:hidden"
                >
                  <div className="rounded-xl border border-border bg-background/40 p-5">
                    <p className="text-xs text-muted-foreground">Tu resultado</p>
                    <p className="font-heading text-5xl font-black text-foreground">
                      {resultado.imc.toFixed(1)}
                    </p>
                    <p className={cn("mt-1 inline-block rounded-full px-3 py-1 text-sm font-bold text-white", resultado.clasificacion.color)}>
                      {resultado.clasificacion.label} ({resultado.clasificacion.rango})
                    </p>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${resultado.clasificacion.percent}%` }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className={cn("h-full rounded-full", resultado.clasificacion.color)}
                      />
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {resultado.clasificacion.recomendacion}
                    </p>
                    <Button
                      render={<a href={whatsappHref} target="_blank" rel="noopener noreferrer" />}
                      nativeButton={false}
                      className="mt-4 w-full cursor-pointer"
                    >
                      <MessageCircle className="size-4" />
                      Quiero asesoría personalizada
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Result panel on desktop only */}
          <div className="hidden flex-col justify-center border-l border-border bg-background/40 p-12 lg:flex">
            <AnimatePresence mode="wait">
              {resultado ? (
                <motion.div
                  key="resultado"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-sm text-muted-foreground">Tu resultado</p>
                  <p className="font-heading text-6xl font-black text-foreground">
                    {resultado.imc.toFixed(1)}
                  </p>
                  <p className={cn("mt-1 inline-block rounded-full px-3 py-1 text-sm font-bold text-white", resultado.clasificacion.color)}>
                    {resultado.clasificacion.label} ({resultado.clasificacion.rango})
                  </p>
                  <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${resultado.clasificacion.percent}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className={cn("h-full rounded-full", resultado.clasificacion.color)}
                    />
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    {resultado.clasificacion.recomendacion}
                  </p>
                  <Button
                    render={<a href={whatsappHref} target="_blank" rel="noopener noreferrer" />}
                    nativeButton={false}
                    className="mt-6 w-full cursor-pointer"
                  >
                    <MessageCircle className="size-4" />
                    Quiero asesoría personalizada
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    El IMC es una referencia general y no reemplaza una evaluación profesional.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="vacio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground"
                >
                  <Calculator className="size-10 opacity-40" />
                  <p className="text-sm">
                    Completa tu peso y altura para ver tu resultado aquí.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
