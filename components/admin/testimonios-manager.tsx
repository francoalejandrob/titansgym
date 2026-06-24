"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  actualizarTestimonio,
  crearTestimonio,
  eliminarTestimonio,
  type TestimonioInput,
} from "@/lib/actions/admin/contenido";
import type { Testimonio } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const emptyForm: TestimonioInput = {
  nombre_cliente: "",
  texto: "",
  calificacion: 5,
  foto_url: null,
  activo: true,
};

export function TestimoniosManager({ items }: { items: Testimonio[] }) {
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Testimonio | null>(null);
  const [form, setForm] = React.useState<TestimonioInput>(emptyForm);
  const [pending, startTransition] = React.useTransition();

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(t: Testimonio) {
    setEditing(t);
    setForm({
      nombre_cliente: t.nombre_cliente,
      texto: t.texto,
      calificacion: t.calificacion,
      foto_url: t.foto_url,
      activo: t.activo,
    });
    setOpen(true);
  }

  function handleSave() {
    if (!form.nombre_cliente.trim() || !form.texto.trim()) {
      toast.error("Nombre y testimonio son obligatorios.");
      return;
    }
    startTransition(async () => {
      const result = editing
        ? await actualizarTestimonio(editing.id, form)
        : await crearTestimonio(form);
      if (result.success) {
        toast.success(editing ? "Testimonio actualizado" : "Testimonio creado");
        setOpen(false);
      } else {
        toast.error(result.error ?? "Error al guardar");
      }
    });
  }

  function handleEliminar(t: Testimonio) {
    if (!confirm(`¿Eliminar el testimonio de "${t.nombre_cliente}"?`)) return;
    startTransition(async () => {
      const result = await eliminarTestimonio(t.id);
      if (result.success) {
        toast.success("Testimonio eliminado");
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
          Nuevo testimonio
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <div key={t.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage src={t.foto_url ?? undefined} />
                  <AvatarFallback className="bg-primary/15 text-primary">
                    {t.nombre_cliente.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{t.nombre_cliente}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-3"
                        fill={i < t.calificacion ? "currentColor" : "none"}
                        color="var(--color-primary)"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <Switch
                checked={t.activo}
                onCheckedChange={() =>
                  startTransition(async () => {
                    const result = await actualizarTestimonio(t.id, { activo: !t.activo });
                    if (!result.success) toast.error(result.error ?? "Error");
                  })
                }
              />
            </div>
            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{t.texto}</p>
            <div className="mt-4 flex justify-end gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer"
                onClick={() => openEdit(t)}
                aria-label="Editar"
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer text-destructive hover:text-destructive"
                onClick={() => handleEliminar(t)}
                aria-label="Eliminar"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar testimonio" : "Nuevo testimonio"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <ImageUpload
              value={form.foto_url}
              onChange={(url) => setForm((f) => ({ ...f, foto_url: url }))}
              folder="testimonios"
            />

            <div className="space-y-1.5">
              <Label>Nombre del cliente</Label>
              <Input
                value={form.nombre_cliente}
                onChange={(e) => setForm((f) => ({ ...f, nombre_cliente: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Testimonio</Label>
              <Textarea
                value={form.texto}
                onChange={(e) => setForm((f) => ({ ...f, texto: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Calificación</Label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, calificacion: i + 1 }))}
                    className="cursor-pointer"
                    aria-label={`${i + 1} estrellas`}
                  >
                    <Star
                      className={cn(
                        "size-6",
                        i < form.calificacion ? "text-primary" : "text-muted-foreground"
                      )}
                      fill={i < form.calificacion ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={form.activo}
                onCheckedChange={(v) => setForm((f) => ({ ...f, activo: v }))}
              />
              <Label>Visible en el sitio</Label>
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
