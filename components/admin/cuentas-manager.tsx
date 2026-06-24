"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import type { CuentaBancaria } from "@/lib/types/database";
import {
  createCuentaBancaria, updateCuentaBancaria,
  deleteCuentaBancaria, setPrincipalCuenta,
} from "@/lib/actions/admin/pagos";

const schema = z.object({
  banco: z.string().min(1, "Requerido"),
  titular: z.string().min(1, "Requerido"),
  numero_cuenta: z.string().min(1, "Requerido"),
  tipo_cuenta: z.enum(["ahorros", "corriente"]).optional(),
  moneda: z.string().min(1, "Requerido"),
});

type FormValues = z.infer<typeof schema>;


function maskCuenta(numero: string) {
  if (numero.length <= 4) return numero;
  return "****" + numero.slice(-4);
}

export function CuentasManager({ cuentas }: { cuentas: CuentaBancaria[] }) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CuentaBancaria | null>(null);
  const [loading, setLoading] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { banco: "", titular: "", numero_cuenta: "", moneda: "USD" },
  });

  function openEdit(c: CuentaBancaria) {
    setEditing(c);
    form.reset({
      banco: c.banco,
      titular: c.titular,
      numero_cuenta: c.numero_cuenta,
      tipo_cuenta: c.tipo_cuenta ?? undefined,
      moneda: c.moneda,
    });
    setSheetOpen(true);
  }

  function openCreate() {
    setEditing(null);
    form.reset({ banco: "", titular: "", numero_cuenta: "", moneda: "USD" });
    setSheetOpen(true);
  }

  async function onSubmit(values: FormValues) {
    setLoading("save");
    try {
      const payload = { ...values, tipo_cuenta: values.tipo_cuenta || null };
      if (editing) {
        await updateCuentaBancaria(editing.id, payload);
        toast.success("Cuenta actualizada");
      } else {
        await createCuentaBancaria(payload);
        toast.success("Cuenta registrada");
      }
      setSheetOpen(false);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setLoading(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta cuenta?")) return;
    setLoading(id);
    try {
      await deleteCuentaBancaria(id);
      router.refresh();
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setLoading(null);
    }
  }

  async function handleSetPrincipal(id: string) {
    setLoading(`main-${id}`);
    try {
      await setPrincipalCuenta(id);
      router.refresh();
    } catch {
      toast.error("Error");
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Cuentas bancarias</CardTitle>
          <Button size="sm" className="cursor-pointer" onClick={openCreate}>
            <Plus className="size-4" />
            Nueva cuenta
          </Button>
        </CardHeader>
        <CardContent>
          {cuentas.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay cuentas registradas.
            </p>
          ) : (
            <div className="space-y-3">
              {cuentas.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl border border-border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{c.banco}</span>
                      {c.es_principal && (
                        <Badge className="gap-1 text-[10px]">
                          <Star className="size-2.5" fill="currentColor" />
                          Principal
                        </Badge>
                      )}
                      {!c.activa && (
                        <Badge variant="secondary" className="text-[10px]">Inactiva</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{c.titular}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {maskCuenta(c.numero_cuenta)} · {c.tipo_cuenta ?? "Cuenta"} · {c.moneda}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!c.es_principal && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer text-xs"
                        onClick={() => handleSetPrincipal(c.id)}
                        disabled={loading === `main-${c.id}`}
                        title="Marcar como principal"
                      >
                        {loading === `main-${c.id}` ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Star className="size-3" />
                        )}
                        Principal
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 cursor-pointer"
                      onClick={() => openEdit(c)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 cursor-pointer text-destructive hover:text-destructive"
                      onClick={() => handleDelete(c.id)}
                      disabled={loading === c.id}
                    >
                      {loading === c.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-heading uppercase">
              {editing ? "Editar cuenta" : "Nueva cuenta bancaria"}
            </SheetTitle>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <FormField control={form.control} name="banco" render={({ field }) => (
                <FormItem><FormLabel>Banco *</FormLabel>
                  <FormControl><Input placeholder="Ej: Banco Pichincha" {...field} /></FormControl>
                  <FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="titular" render={({ field }) => (
                <FormItem><FormLabel>Titular *</FormLabel>
                  <FormControl><Input placeholder="Nombre del titular" {...field} /></FormControl>
                  <FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="numero_cuenta" render={({ field }) => (
                <FormItem><FormLabel>Número de cuenta *</FormLabel>
                  <FormControl><Input placeholder="Ej: 2200123456789" {...field} /></FormControl>
                  <FormMessage /></FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="tipo_cuenta" render={({ field }) => (
                  <FormItem><FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="cursor-pointer"><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="ahorros">Ahorros</SelectItem>
                        <SelectItem value="corriente">Corriente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="moneda" render={({ field }) => (
                  <FormItem><FormLabel>Moneda</FormLabel>
                    <FormControl><Input placeholder="USD" {...field} /></FormControl>
                    <FormMessage /></FormItem>
                )} />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading === "save"} className="flex-1 cursor-pointer">
                  {loading === "save" && <Loader2 className="size-4 animate-spin" />}
                  {editing ? "Guardar" : "Crear cuenta"}
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
