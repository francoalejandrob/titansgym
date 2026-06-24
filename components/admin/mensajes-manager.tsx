"use client";

import * as React from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { eliminarMensaje, marcarMensajeLeido } from "@/lib/actions/admin/contenido";
import type { ContactoMensaje } from "@/lib/types/database";
import { cn } from "@/lib/utils";

export function MensajesManager({ mensajes }: { mensajes: ContactoMensaje[] }) {
  const [pending, startTransition] = React.useTransition();

  function toggleLeido(m: ContactoMensaje) {
    startTransition(async () => {
      const result = await marcarMensajeLeido(m.id, !m.leido);
      if (!result.success) toast.error(result.error ?? "Error al actualizar");
    });
  }

  function handleEliminar(m: ContactoMensaje) {
    if (!confirm(`¿Eliminar el mensaje de "${m.nombre}"?`)) return;
    startTransition(async () => {
      const result = await eliminarMensaje(m.id);
      if (result.success) {
        toast.success("Mensaje eliminado");
      } else {
        toast.error(result.error ?? "Error al eliminar");
      }
    });
  }

  if (mensajes.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
        No hay mensajes de contacto todavía.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {mensajes.map((m) => (
        <div
          key={m.id}
          className={cn(
            "rounded-xl border bg-card p-5 transition-colors",
            m.leido ? "border-border" : "border-primary/40 bg-primary/5"
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{m.nombre}</p>
                {!m.leido && (
                  <Badge variant="default" className="text-[10px]">
                    Nuevo
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {m.telefono} · {m.email}
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer"
                disabled={pending}
                onClick={() => toggleLeido(m)}
                aria-label={m.leido ? "Marcar como no leído" : "Marcar como leído"}
              >
                {m.leido ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer text-destructive hover:text-destructive"
                disabled={pending}
                onClick={() => handleEliminar(m)}
                aria-label="Eliminar"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
          <p className="mt-3 text-sm text-foreground/90">{m.mensaje}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            {new Date(m.created_at).toLocaleString("es-EC")}
          </p>
        </div>
      ))}
    </div>
  );
}
