import type { Metadata } from "next";
import { UserPlus, ShieldCheck, ClipboardList, TrendingUp } from "lucide-react";
import { RegistroForm } from "@/components/site/registro-form";

export const metadata: Metadata = {
  title: "Regístrate | Titan's Gym",
  description:
    "Completa tu perfil de cliente para recibir un plan de entrenamiento y nutrición personalizado en Titan's Gym.",
};

const beneficios = [
  {
    icon: ClipboardList,
    titulo: "Perfil personalizado",
    desc: "Tu entrenador conocerá tu punto de partida para diseñar el plan correcto.",
  },
  {
    icon: TrendingUp,
    titulo: "Seguimiento de progreso",
    desc: "Registramos tus mediciones en el tiempo para que veas tu evolución.",
  },
  {
    icon: ShieldCheck,
    titulo: "Datos confidenciales",
    desc: "Tu información es privada y solo la maneja el equipo de Titan's Gym.",
  },
];

export default function RegistratePage() {
  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Únete
          </span>
          <h1 className="mt-3 font-heading text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
            Registra tu perfil
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Completa el formulario con tus datos y nuestro equipo creará un plan
            de entrenamiento y nutrición adaptado a tus objetivos.
          </p>
        </div>

        {/* Beneficios */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {beneficios.map(({ icon: Icon, titulo, desc }) => (
            <div
              key={titulo}
              className="rounded-xl border border-border bg-card p-5 text-center"
            >
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
              <p className="font-heading text-sm font-bold uppercase">{titulo}</p>
              <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        {/* Formulario */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold uppercase">
                Tus datos
              </h2>
              <p className="text-xs text-muted-foreground">
                Los campos con * son obligatorios
              </p>
            </div>
          </div>
          <RegistroForm />
        </div>
      </div>
    </main>
  );
}
