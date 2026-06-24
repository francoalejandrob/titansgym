import type { Metadata } from "next";
import { Dumbbell, Flame } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanCard } from "@/components/site/plan-card";
import { ClaseCard } from "@/components/site/clase-card";
import { getConfiguracionSitio, getMembresiasSitio } from "@/lib/data/queries";
import {
  clasesEspeciales,
  planesEspeciales,
  planesGenerales,
} from "@/lib/data/plans";
import type { Membresia } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "Planes y Membresías",
  description:
    "Conoce todas las membresías de Titan's Gym: planes generales, membresías especiales y clases de Taekwondo, Titan Dance y Titan Power.",
};

// Convierte los datos hardcodeados al shape de Membresia para fallback
function planesToMembresia(planes: typeof planesGenerales, categoria: "general" | "especial"): Membresia[] {
  return planes.map((p, i) => ({
    id: p.id,
    nombre: p.nombre,
    precio: p.precio,
    periodo: p.periodo as "mes" | "quincena",
    descripcion: null,
    beneficios: null,
    categoria,
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

function clasesToMembresia(clases: typeof clasesEspeciales): Membresia[] {
  return clases.map((c, i) => ({
    id: c.id,
    nombre: c.nombre,
    precio: c.precio,
    periodo: c.periodo as "mes",
    descripcion: c.descripcion,
    beneficios: null,
    categoria: "clase" as const,
    activa: true,
    visible_en_sitio: true,
    orden: i,
    destacado: false,
    es_clase: true,
    horarios: c.horarios,
    imagen_url: c.imagen,
    precio_diario: c.diario ?? null,
    requisito: null,
    created_at: "",
    updated_at: "",
  }));
}

export default async function PlanesPage() {
  const [config, membresiasDB] = await Promise.all([
    getConfiguracionSitio(),
    getMembresiasSitio(),
  ]);

  // If DB has membresías, use them. Otherwise fallback to hardcoded.
  const generales = membresiasDB.length > 0
    ? membresiasDB.filter((m) => m.categoria === "general")
    : planesToMembresia(planesGenerales, "general");

  const especiales = membresiasDB.length > 0
    ? membresiasDB.filter((m) => m.categoria === "especial")
    : planesToMembresia(planesEspeciales, "especial");

  const clases = membresiasDB.length > 0
    ? membresiasDB.filter((m) => m.categoria === "clase")
    : clasesToMembresia(clasesEspeciales);

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          Membresías
        </span>
        <h1 className="mt-3 font-heading text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
          Planes y Membresías
        </h1>
        <p className="mt-4 text-muted-foreground">
          Elige el plan que mejor se adapte a tu estilo de vida, o suma una
          clase especializada a tu entrenamiento.
        </p>
      </div>

      <Tabs defaultValue="gym" className="mt-14 items-center">
        <TabsList className="h-12 gap-1 rounded-xl p-1.5">
          <TabsTrigger value="gym" className="h-9 gap-2 rounded-lg px-5 text-sm">
            <Dumbbell className="size-4" />
            Membresía Gym
          </TabsTrigger>
          <TabsTrigger value="clases" className="h-9 gap-2 rounded-lg px-5 text-sm">
            <Flame className="size-4" />
            Clases Especializadas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gym" className="w-full">
          {generales.length > 0 && (
            <section className="mt-12">
              <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">
                Planes generales
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {generales.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} phone={config.telefono_whatsapp} />
                ))}
              </div>
            </section>
          )}

          {especiales.length > 0 && (
            <section className="mt-16">
              <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">
                Membresías especiales
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Tarifas preferenciales para estudiantes, personas con
                discapacidad y adultos de la tercera edad.
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {especiales.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} phone={config.telefono_whatsapp} />
                ))}
              </div>
            </section>
          )}
        </TabsContent>

        <TabsContent value="clases" className="w-full">
          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">
              Disciplinas especializadas
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Suma una disciplina a tu rutina: combate, baile fitness o
              fuerza competitiva.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {clases.map((clase) => (
                <ClaseCard
                  key={clase.id}
                  clase={clase}
                  phone={config.telefono_whatsapp}
                />
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
