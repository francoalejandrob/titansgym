"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Trash2, Download, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { CuentaBancaria, Pago } from "@/lib/types/database";
import { createPago, deletePago } from "@/lib/actions/admin/pagos";

const schema = z.object({
  nombre_cliente: z.string().min(1, "Requerido"),
  monto: z.string().min(1, "Requerido"),
  fecha: z.string().min(1, "Requerido"),
  metodo_pago: z.enum(["efectivo", "transferencia", "tarjeta", "otro"]).optional(),
  membresia: z.string().optional(),
  notas: z.string().optional(),
  cuenta_bancaria_id: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const metodoLabel: Record<string, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  tarjeta: "Tarjeta",
  otro: "Otro",
};

function exportarCSV(pagos: Pago[]) {
  const headers = "Fecha,Cliente,Membresía,Monto,Método,Notas";
  const rows = pagos.map((p) =>
    [p.fecha, `"${p.nombre_cliente}"`, `"${p.membresia ?? ""}"`, p.monto, p.metodo_pago ?? "", `"${p.notas ?? ""}"`].join(",")
  );
  const csv = [headers, ...rows].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pagos-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function PagosManager({
  pagos,
  cuentas,
}: {
  pagos: Pago[];
  cuentas: CuentaBancaria[];
}) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [loading, setLoading] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [filtroMetodo, setFiltroMetodo] = React.useState("todos");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre_cliente: "",
      monto: "",
      fecha: new Date().toISOString().slice(0, 10),
      membresia: "",
      notas: "",
    },
  });

  const filtered = pagos.filter((p) => {
    const matchSearch =
      p.nombre_cliente.toLowerCase().includes(search.toLowerCase()) ||
      (p.membresia ?? "").toLowerCase().includes(search.toLowerCase());
    const matchMetodo = filtroMetodo === "todos" || p.metodo_pago === filtroMetodo;
    return matchSearch && matchMetodo;
  });

  async function onSubmit(values: FormValues) {
    setLoading("save");
    try {
      await createPago({
        nombre_cliente: values.nombre_cliente,
        monto: parseFloat(values.monto) || 0,
        fecha: values.fecha,
        metodo_pago: values.metodo_pago || null,
        membresia: values.membresia || null,
        notas: values.notas || null,
        cuenta_bancaria_id: values.cuenta_bancaria_id || null,
      });
      toast.success("Pago registrado");
      setSheetOpen(false);
      form.reset();
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setLoading(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este registro de pago?")) return;
    setLoading(id);
    try {
      await deletePago(id);
      router.refresh();
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <CardTitle>Registros ({filtered.length})</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-44 pl-9"
              />
            </div>
            <Select value={filtroMetodo} onValueChange={(v) => setFiltroMetodo(v ?? "todos")}>
              <SelectTrigger className="w-36 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => exportarCSV(filtered)}
            >
              <Download className="size-4" />
              Exportar CSV
            </Button>
            <Button size="sm" className="cursor-pointer" onClick={() => setSheetOpen(true)}>
              <Plus className="size-4" />
              Registrar pago
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay pagos registrados.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Membresía</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Notas</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(p.fecha + "T00:00:00").toLocaleDateString("es-EC")}
                    </TableCell>
                    <TableCell className="font-medium">{p.nombre_cliente}</TableCell>
                    <TableCell className="text-muted-foreground">{p.membresia ?? "—"}</TableCell>
                    <TableCell className="font-semibold text-primary">
                      ${p.monto.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {p.metodo_pago ? (
                        <Badge variant="outline" className="text-xs">
                          {metodoLabel[p.metodo_pago]}
                        </Badge>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate text-sm text-muted-foreground">
                      {p.notas ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 cursor-pointer text-destructive hover:text-destructive"
                        onClick={() => handleDelete(p.id)}
                        disabled={loading === p.id}
                      >
                        {loading === p.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-heading uppercase">Registrar pago</SheetTitle>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <FormField control={form.control} name="nombre_cliente" render={({ field }) => (
                <FormItem><FormLabel>Nombre del cliente *</FormLabel>
                  <FormControl><Input placeholder="Ej: Juan Pérez" {...field} /></FormControl>
                  <FormMessage /></FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="monto" render={({ field }) => (
                  <FormItem><FormLabel>Monto ($) *</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                    <FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="fecha" render={({ field }) => (
                  <FormItem><FormLabel>Fecha *</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage /></FormItem>
                )} />
              </div>

              <FormField control={form.control} name="membresia" render={({ field }) => (
                <FormItem><FormLabel>Membresía</FormLabel>
                  <FormControl><Input placeholder="Ej: Regular, Titan Dance..." {...field} /></FormControl>
                  <FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="metodo_pago" render={({ field }) => (
                <FormItem><FormLabel>Método de pago</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className="cursor-pointer"><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage /></FormItem>
              )} />

              {cuentas.filter((c) => c.activa).length > 0 && (
                <FormField control={form.control} name="cuenta_bancaria_id" render={({ field }) => (
                  <FormItem><FormLabel>Cuenta receptora</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="cursor-pointer"><SelectValue placeholder="Seleccionar cuenta" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {cuentas.filter((c) => c.activa).map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.banco} — {c.titular} {c.es_principal ? "(Principal)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage /></FormItem>
                )} />
              )}

              <FormField control={form.control} name="notas" render={({ field }) => (
                <FormItem><FormLabel>Notas</FormLabel>
                  <FormControl>
                    <textarea {...field} rows={2}
                      className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Notas opcionales..." />
                  </FormControl>
                  <FormMessage /></FormItem>
              )} />

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading === "save"} className="flex-1 cursor-pointer">
                  {loading === "save" && <Loader2 className="size-4 animate-spin" />}
                  Registrar pago
                </Button>
                <Button type="button" variant="outline" onClick={() => setSheetOpen(false)} className="cursor-pointer">
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}
