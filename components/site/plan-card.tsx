"use client";

import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { registrarInteresPlan } from "@/lib/actions/lead-interes";
import type { Membresia } from "@/lib/types/database";

export function PlanCard({
  plan,
  phone,
}: {
  plan: Membresia;
  phone: string;
}) {
  const message = `Hola Titan's Gym, quiero información sobre el plan "${plan.nombre}" ($${plan.precio}/${plan.periodo})`;
  const whatsappHref = buildWhatsappLink(phone, message);

  return (
    <div
      className={cn(
        "relative flex h-full cursor-pointer flex-col rounded-xl border bg-card p-7 transition-all hover:-translate-y-1",
        plan.destacado
          ? "border-primary shadow-lg shadow-primary/20"
          : "border-border hover:border-primary/50"
      )}
    >
      {plan.destacado && (
        <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
          <Star className="size-3.5" fill="currentColor" />
          Más popular
        </span>
      )}

      <h3 className="font-heading text-xl font-bold uppercase tracking-tight">
        {plan.nombre}
      </h3>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-heading text-4xl font-extrabold text-primary">
          ${plan.precio}
        </span>
        <span className="text-sm text-muted-foreground">
          /{plan.periodo === "mes" ? "mes" : plan.periodo}
        </span>
      </div>

      {plan.precio_diario && (
        <p className="mt-1 text-xs text-muted-foreground">
          o ${plan.precio_diario} pase diario
        </p>
      )}

      <div className="mt-5 flex-1 space-y-2.5">
        {plan.requisito && (
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            {plan.requisito}
          </p>
        )}
        {plan.beneficios?.map((f) => (
          <p key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            {f}
          </p>
        ))}
        {!plan.requisito && !plan.beneficios?.length && (
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            Sin restricciones de horario
          </p>
        )}
      </div>

      <Button
        render={<a href={whatsappHref} target="_blank" rel="noopener noreferrer" />}
        nativeButton={false}
        onClick={() => void registrarInteresPlan(plan.nombre)}
        className="mt-6 w-full cursor-pointer"
        variant={plan.destacado ? "default" : "secondary"}
      >
        Inscribirme
      </Button>
    </div>
  );
}
