"use client";

import Image from "next/image";
import { Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { registrarInteresPlan } from "@/lib/actions/lead-interes";
import type { Membresia } from "@/lib/types/database";

export function ClaseCard({ clase, phone }: { clase: Membresia; phone: string }) {
  const message = `Hola Titan's Gym, quiero información sobre la clase "${clase.nombre}" ($${clase.precio}/${clase.periodo})`;
  const whatsappHref = buildWhatsappLink(phone, message);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/50">
      {clase.imagen_url && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={clase.imagen_url}
            alt={clase.nombre}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-white">
              {clase.nombre}
            </h3>
          </div>
        </div>
      )}

      {!clase.imagen_url && (
        <div className="p-6 pb-0">
          <h3 className="font-heading text-2xl font-extrabold uppercase tracking-tight">
            {clase.nombre}
          </h3>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline gap-1">
          <span className="font-heading text-3xl font-extrabold text-primary">
            ${clase.precio}
          </span>
          <span className="text-sm text-muted-foreground">/{clase.periodo}</span>
          {clase.precio_diario && (
            <span className="ml-2 text-xs text-muted-foreground">
              (${clase.precio_diario} pase diario)
            </span>
          )}
        </div>

        {clase.descripcion && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {clase.descripcion}
          </p>
        )}

        {clase.horarios && clase.horarios.length > 0 && (
          <div className="mt-4 space-y-1.5">
            {clase.horarios.map((h) => (
              <p
                key={h}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Clock className="size-4 shrink-0 text-primary" />
                {h}
              </p>
            ))}
          </div>
        )}

        <Button
          render={
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" />
          }
          nativeButton={false}
          onClick={() => void registrarInteresPlan(clase.nombre)}
          className="mt-6 w-full cursor-pointer"
        >
          <MessageCircle className="size-4" />
          Inscribirme
        </Button>
      </div>
    </div>
  );
}
