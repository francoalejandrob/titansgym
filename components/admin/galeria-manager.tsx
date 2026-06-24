"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  actualizarGaleriaItem,
  crearGaleriaItem,
  eliminarGaleriaItem,
  type GaleriaInput,
} from "@/lib/actions/admin/contenido";
import type { GaleriaCategoria, GaleriaItem } from "@/lib/types/database";

const categoriaLabel: Record<GaleriaCategoria, string> = {
  instalaciones: "Instalaciones",
  entrenamiento: "Entrenamiento",
  clases: "Clases",
};

const emptyForm: GaleriaInput = {
  titulo: "",
  imagen_url: "",
  categoria: "instalaciones",
  activo: true,
};

export function GaleriaManager({ items }: { items: GaleriaItem[] }) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<GaleriaInput>(emptyForm);
  const [pending, startTransition] = React.useTransition();

  function handleCrear() {
    if (!form.titulo.trim() || !form.imagen_url) {
      toast.error("Título e imagen son obligatorios.");
      return;
    }
    startTransition(async () => {
      const result = await crearGaleriaItem(form);
      if (result.success) {
        toast.success("Foto agregada a la galería");
        setForm(emptyForm);
        setOpen(false);
      } else {
        toast.error(result.error ?? "Error al guardar");
      }
    });
  }

  function handleToggle(item: GaleriaItem) {
    startTransition(async () => {
      const result = await actualizarGaleriaItem(item.id, { activo: !item.activo });
      if (!result.success) toast.error(result.error ?? "Error al actualizar");
    });
  }

  function handleEliminar(item: GaleriaItem) {
    if (!confirm(`¿Eliminar "${item.titulo}" de la galería?`)) return;
    startTransition(async () => {
      const result = await eliminarGaleriaItem(item.id);
      if (result.success) {
        toast.success("Foto eliminada");
      } else {
        toast.error(result.error ?? "Error al eliminar");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)} className="cursor-pointer">
          <Plus className="size-4" />
          Agregar foto
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="relative aspect-square w-full">
              <Image src={item.imagen_url} alt={item.titulo} fill className="object-cover" />
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-medium">{item.titulo}</p>
              <p className="text-xs text-muted-foreground">{categoriaLabel[item.categoria]}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Switch
                    checked={item.activo}
                    onCheckedChange={() => handleToggle(item)}
                  />
                  <span className="text-xs text-muted-foreground">Visible</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="cursor-pointer text-destructive hover:text-destructive"
                  onClick={() => handleEliminar(item)}
                  aria-label="Eliminar"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar foto a la galería</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <ImageUpload
              value={form.imagen_url || null}
              onChange={(url) => setForm((f) => ({ ...f, imagen_url: url ?? "" }))}
              folder="galeria"
            />

            <div className="space-y-1.5">
              <Label>Título</Label>
              <Input
                value={form.titulo}
                onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                placeholder="Ej: Zona de cardio"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Categoría</Label>
              <Select
                value={form.categoria}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, categoria: v as GaleriaCategoria }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(categoriaLabel) as GaleriaCategoria[]).map((c) => (
                    <SelectItem key={c} value={c}>
                      {categoriaLabel[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" className="cursor-pointer" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCrear} disabled={pending} className="cursor-pointer">
              {pending && <Loader2 className="size-4 animate-spin" />}
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
