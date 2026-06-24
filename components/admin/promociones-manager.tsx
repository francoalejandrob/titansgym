"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  actualizarPromocion,
  crearPromocion,
  eliminarPromocion,
  type PromocionInput,
} from "@/lib/actions/admin/promociones";
import type { Promocion } from "@/lib/types/database";

const emptyForm: PromocionInput = {
  titulo: "",
  descripcion: "",
  descuento: "",
  imagen_url: null,
  fecha_inicio: null,
  fecha_fin: null,
  activa: true,
};

export function PromocionesManager({ promociones }: { promociones: Promocion[] }) {
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Promocion | null>(null);
  const [form, setForm] = React.useState<PromocionInput>(emptyForm);
  const [pending, startTransition] = React.useTransition();

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(promo: Promocion) {
    setEditing(promo);
    setForm({
      titulo: promo.titulo,
      descripcion: promo.descripcion ?? "",
      descuento: promo.descuento ?? "",
      imagen_url: promo.imagen_url,
      fecha_inicio: promo.fecha_inicio,
      fecha_fin: promo.fecha_fin,
      activa: promo.activa,
    });
    setOpen(true);
  }

  function handleSave() {
    if (!form.titulo.trim()) {
      toast.error("El título es obligatorio.");
      return;
    }
    startTransition(async () => {
      const result = editing
        ? await actualizarPromocion(editing.id, form)
        : await crearPromocion(form);

      if (result.success) {
        toast.success(editing ? "Promoción actualizada" : "Promoción creada");
        setOpen(false);
      } else {
        toast.error(result.error ?? "Error al guardar");
      }
    });
  }

  function handleToggleActiva(promo: Promocion) {
    startTransition(async () => {
      const result = await actualizarPromocion(promo.id, { activa: !promo.activa });
      if (result.success) {
        toast.success(promo.activa ? "Promoción desactivada" : "Promoción activada");
      } else {
        toast.error(result.error ?? "Error al actualizar");
      }
    });
  }

  function handleDelete(promo: Promocion) {
    if (!confirm(`¿Eliminar la promoción "${promo.titulo}"?`)) return;
    startTransition(async () => {
      const result = await eliminarPromocion(promo.id);
      if (result.success) {
        toast.success("Promoción eliminada");
      } else {
        toast.error(result.error ?? "Error al eliminar");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openNew} className="cursor-pointer">
          <Plus className="size-4" />
          Nueva promoción
        </Button>
      </div>

      {promociones.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          No hay promociones todavía. Crea la primera.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promociones.map((promo) => (
            <div
              key={promo.id}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative aspect-video w-full bg-muted">
                {promo.imagen_url && (
                  <Image
                    src={promo.imagen_url}
                    alt={promo.titulo}
                    fill
                    className="object-cover"
                  />
                )}
                <Badge
                  variant={promo.activa ? "default" : "secondary"}
                  className="absolute left-2 top-2"
                >
                  {promo.activa ? "Activa" : "Inactiva"}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-heading text-base font-bold uppercase tracking-tight">
                  {promo.titulo}
                </h3>
                {promo.descuento && (
                  <p className="mt-1 text-sm font-semibold text-primary">{promo.descuento}</p>
                )}
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {promo.descripcion}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={promo.activa}
                      onCheckedChange={() => handleToggleActiva(promo)}
                    />
                    <span className="text-xs text-muted-foreground">Activa</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="cursor-pointer"
                      onClick={() => openEdit(promo)}
                      aria-label="Editar"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="cursor-pointer text-destructive hover:text-destructive"
                      onClick={() => handleDelete(promo)}
                      aria-label="Eliminar"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar promoción" : "Nueva promoción"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <ImageUpload
              value={form.imagen_url}
              onChange={(url) => setForm((f) => ({ ...f, imagen_url: url }))}
              folder="promociones"
            />

            <div className="space-y-1.5">
              <Label>Título</Label>
              <Input
                value={form.titulo}
                onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                placeholder="Ej: 2x1 en inscripciones"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Textarea
                value={form.descripcion}
                onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Texto de descuento (ej: &quot;20% OFF&quot;)</Label>
              <Input
                value={form.descuento}
                onChange={(e) => setForm((f) => ({ ...f, descuento: e.target.value }))}
                placeholder="6ta renovación GRATIS"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Fecha inicio</Label>
                <Input
                  type="date"
                  value={form.fecha_inicio ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fecha_inicio: e.target.value || null }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Fecha fin</Label>
                <Input
                  type="date"
                  value={form.fecha_fin ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fecha_fin: e.target.value || null }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={form.activa}
                onCheckedChange={(v) => setForm((f) => ({ ...f, activa: v }))}
              />
              <Label>Promoción activa</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" className="cursor-pointer" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={pending} className="cursor-pointer">
              {pending && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
