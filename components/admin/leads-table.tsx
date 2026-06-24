"use client";

import * as React from "react";
import { Search, Trash2, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  actualizarEstadoLead,
  actualizarNotasLead,
  eliminarLead,
} from "@/lib/actions/admin/leads";
import type { Lead, LeadEstado } from "@/lib/types/database";

const estadoOptions: LeadEstado[] = ["nuevo", "contactado", "convertido", "descartado"];
const estadoLabel: Record<LeadEstado, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  convertido: "Convertido",
  descartado: "Descartado",
};
const estadoVariant: Record<LeadEstado, "default" | "secondary" | "outline" | "destructive"> = {
  nuevo: "default",
  contactado: "secondary",
  convertido: "outline",
  descartado: "destructive",
};

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [search, setSearch] = React.useState("");
  const [filtroEstado, setFiltroEstado] = React.useState<LeadEstado | "todos">("todos");
  const [detalle, setDetalle] = React.useState<Lead | null>(null);
  const [notas, setNotas] = React.useState("");
  const [pending, startTransition] = React.useTransition();

  const filtrados = leads.filter((lead) => {
    const matchesSearch =
      search.trim() === "" ||
      [lead.nombre, lead.telefono, lead.email ?? ""].some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      );
    const matchesEstado = filtroEstado === "todos" || lead.estado === filtroEstado;
    return matchesSearch && matchesEstado;
  });

  function handleEstadoChange(lead: Lead, estado: LeadEstado) {
    startTransition(async () => {
      const result = await actualizarEstadoLead(lead.id, estado);
      if (result.success) {
        toast.success("Estado actualizado");
      } else {
        toast.error(result.error ?? "Error al actualizar");
      }
    });
  }

  function openDetalle(lead: Lead) {
    setDetalle(lead);
    setNotas(lead.notas ?? "");
  }

  function guardarNotas() {
    if (!detalle) return;
    startTransition(async () => {
      const result = await actualizarNotasLead(detalle.id, notas);
      if (result.success) {
        toast.success("Notas guardadas");
        setDetalle(null);
      } else {
        toast.error(result.error ?? "Error al guardar");
      }
    });
  }

  function handleEliminar(lead: Lead) {
    if (!confirm(`¿Eliminar el lead de "${lead.nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    startTransition(async () => {
      const result = await eliminarLead(lead.id);
      if (result.success) {
        toast.success("Lead eliminado");
        setDetalle(null);
      } else {
        toast.error(result.error ?? "Error al eliminar");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, teléfono o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={filtroEstado}
          onValueChange={(v) => setFiltroEstado(v as LeadEstado | "todos")}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            {estadoOptions.map((e) => (
              <SelectItem key={e} value={e}>
                {estadoLabel[e]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Origen</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No se encontraron leads.
                </TableCell>
              </TableRow>
            ) : (
              filtrados.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div>{lead.telefono}</div>
                    {lead.email && <div className="text-xs">{lead.email}</div>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.plan_interes ?? "—"}
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {lead.origen}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={lead.estado}
                      onValueChange={(v) => handleEstadoChange(lead, v as LeadEstado)}
                    >
                      <SelectTrigger size="sm" className="w-36">
                        <Badge variant={estadoVariant[lead.estado]} className="mr-1">
                          {estadoLabel[lead.estado]}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {estadoOptions.map((e) => (
                          <SelectItem key={e} value={e}>
                            {estadoLabel[e]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer"
                        onClick={() => openDetalle(lead)}
                        aria-label="Ver detalle"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer text-destructive hover:text-destructive"
                        onClick={() => handleEliminar(lead)}
                        aria-label="Eliminar"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!detalle} onOpenChange={(open) => !open && setDetalle(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{detalle?.nombre}</DialogTitle>
          </DialogHeader>
          {detalle && (
            <div className="space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">Teléfono: </span>
                {detalle.telefono}
              </p>
              {detalle.email && (
                <p>
                  <span className="text-muted-foreground">Email: </span>
                  {detalle.email}
                </p>
              )}
              {detalle.plan_interes && (
                <p>
                  <span className="text-muted-foreground">Plan de interés: </span>
                  {detalle.plan_interes}
                </p>
              )}
              {detalle.mensaje && (
                <p>
                  <span className="text-muted-foreground">Mensaje: </span>
                  {detalle.mensaje}
                </p>
              )}
              <p>
                <span className="text-muted-foreground">Registrado: </span>
                {new Date(detalle.created_at).toLocaleString("es-EC")}
              </p>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Notas internas
                </label>
                <Textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={3}
                  placeholder="Agrega notas de seguimiento..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => detalle && handleEliminar(detalle)}
            >
              <Trash2 className="size-4" />
              Eliminar
            </Button>
            <Button onClick={guardarNotas} disabled={pending} className="cursor-pointer">
              {pending && <Loader2 className="size-4 animate-spin" />}
              Guardar notas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
