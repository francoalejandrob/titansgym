"use client";

import * as React from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { diaLabel } from "@/lib/data/site-config";
import { actualizarHorario } from "@/lib/actions/admin/contenido";
import type { Horario } from "@/lib/types/database";

export function HorariosManager({ horarios }: { horarios: Horario[] }) {
  const [data, setData] = React.useState(horarios);
  const [savingDia, setSavingDia] = React.useState<string | null>(null);

  function update(dia: string, patch: Partial<Horario>) {
    setData((prev) => prev.map((h) => (h.dia === dia ? { ...h, ...patch } : h)));
  }

  async function guardar(h: Horario) {
    setSavingDia(h.dia);
    const result = await actualizarHorario(h.dia, {
      abre: h.cerrado ? null : h.abre,
      cierra: h.cerrado ? null : h.cierra,
      cerrado: h.cerrado,
    });
    setSavingDia(null);
    if (result.success) {
      toast.success(`Horario de ${diaLabel[h.dia]} actualizado`);
    } else {
      toast.error(result.error ?? "Error al guardar");
    }
  }

  return (
    <div className="space-y-3">
      {data.map((h) => (
        <div
          key={h.dia}
          className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3 sm:w-40">
            <span className="font-medium">{diaLabel[h.dia]}</span>
          </div>

          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={!h.cerrado}
                onCheckedChange={(v) => update(h.dia, { cerrado: !v })}
              />
              <span className="text-sm text-muted-foreground">
                {h.cerrado ? "Cerrado" : "Abierto"}
              </span>
            </div>

            {!h.cerrado && (
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={h.abre ?? ""}
                  onChange={(e) => update(h.dia, { abre: e.target.value })}
                  className="w-32"
                />
                <span className="text-muted-foreground">—</span>
                <Input
                  type="time"
                  value={h.cierra ?? ""}
                  onChange={(e) => update(h.dia, { cierra: e.target.value })}
                  className="w-32"
                />
              </div>
            )}
          </div>

          <Button
            size="sm"
            variant="secondary"
            className="cursor-pointer"
            disabled={savingDia === h.dia}
            onClick={() => guardar(h)}
          >
            {savingDia === h.dia ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Guardar
          </Button>
        </div>
      ))}
    </div>
  );
}
