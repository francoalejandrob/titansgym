"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Eye, EyeOff,
  ChevronUp, ChevronDown, Loader2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { Membresia } from "@/lib/types/database";
import {
  createMembresia,
  updateMembresia,
  deleteMembresia,
  toggleMembresiaVisibilidad,
  moverMembresia,
} from "@/lib/actions/admin/membresias";

const schema = z.object({
  nombre: z.string().min(1, "Requerido"),
  precio: z.string().min(1, "Requerido"),
  periodo: z.enum(["mes", "quincena", "trimestre", "anual"]),
  categoria: z.enum(["general", "especial", "clase"]),
  descripcion: z.string().optional(),
  requisito: z.string().optional(),
  imagen_url: z.string().optional(),
  precio_diario: z.string().optional(),
  es_clase: z.boolean(),
  destacado: z.boolean(),
  activa: z.boolean(),
  visible_en_sitio: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const periodoLabel: Record<string, string> = {
  mes: "Mensual",
  quincena: "Quincenal",
  trimestre: "Trimestral",
  anual: "Anual",
};

const categoriaLabel: Record<string, string> = {
  general: "General",
  especial: "Especial",
  clase: "Clase",
};

export function MembresiaManager({ membresias }: { membresias: Membresia[] }) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Membresia | null>(null);
  const [loading, setLoading] = React.useState<string | null>(null);
  const [beneficiosInput, setBeneficiosInput] = React.useState("");
  const [beneficios, setBeneficios] = React.useState<string[]>([]);
  const [horariosInput, setHorariosInput] = React.useState("");
  const [horariosArr, setHorariosArr] = React.useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      precio: "0",
      periodo: "mes",
      categoria: "general",
      descripcion: "",
      requisito: "",
      imagen_url: "",
      precio_diario: "",
      es_clase: false,
      destacado: false,
      activa: true,
      visible_en_sitio: true,
    },
  });

  function openCreate() {
    setEditing(null);
    form.reset({
      nombre: "",
      precio: "0",
      periodo: "mes",
      categoria: "general",
      descripcion: "",
      requisito: "",
      imagen_url: "",
      precio_diario: "",
      es_clase: false,
      destacado: false,
      activa: true,
      visible_en_sitio: true,
    });
    setBeneficios([]);
    setHorariosArr([]);
    setSheetOpen(true);
  }

  function openEdit(m: Membresia) {
    setEditing(m);
    form.reset({
      nombre: m.nombre,
      precio: m.precio.toString(),
      periodo: m.periodo,
      categoria: m.categoria,
      descripcion: m.descripcion ?? "",
      requisito: m.requisito ?? "",
      imagen_url: m.imagen_url ?? "",
      precio_diario: m.precio_diario?.toString() ?? "",
      es_clase: m.es_clase,
      destacado: m.destacado,
      activa: m.activa,
      visible_en_sitio: m.visible_en_sitio,
    });
    setBeneficios(m.beneficios ?? []);
    setHorariosArr(m.horarios ?? []);
    setSheetOpen(true);
  }

  async function onSubmit(values: FormValues) {
    try {
      setLoading("save");
      const payload = {
        nombre: values.nombre,
        precio: parseFloat(values.precio) || 0,
        periodo: values.periodo,
        categoria: values.categoria,
        es_clase: values.es_clase,
        destacado: values.destacado,
        activa: values.activa,
        visible_en_sitio: values.visible_en_sitio,
        descripcion: values.descripcion || null,
        requisito: values.requisito || null,
        imagen_url: values.imagen_url || null,
        precio_diario: values.precio_diario ? parseFloat(values.precio_diario) : null,
        beneficios: beneficios.length > 0 ? beneficios : null,
        horarios: horariosArr.length > 0 ? horariosArr : null,
      };
      if (editing) {
        await updateMembresia(editing.id, payload);
        toast.success("Membresía actualizada");
      } else {
        await createMembresia(payload);
        toast.success("Membresía creada");
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
    if (!confirm("¿Eliminar esta membresía?")) return;
    try {
      setLoading(id);
      await deleteMembresia(id);
      toast.success("Membresía eliminada");
      router.refresh();
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setLoading(null);
    }
  }

  async function handleToggleVisible(m: Membresia) {
    try {
      setLoading(`vis-${m.id}`);
      await toggleMembresiaVisibilidad(m.id, !m.visible_en_sitio);
      router.refresh();
    } catch {
      toast.error("Error al cambiar visibilidad");
    } finally {
      setLoading(null);
    }
  }

  async function handleMover(m: Membresia, dir: "up" | "down") {
    try {
      setLoading(`move-${m.id}`);
      await moverMembresia(m.id, dir, m.orden);
      router.refresh();
    } catch {
      toast.error("Error al reordenar");
    } finally {
      setLoading(null);
    }
  }

  function addBeneficio() {
    const val = beneficiosInput.trim();
    if (val) { setBeneficios((p) => [...p, val]); setBeneficiosInput(""); }
  }

  function addHorario() {
    const val = horariosInput.trim();
    if (val) { setHorariosArr((p) => [...p, val]); setHorariosInput(""); }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Membresías ({membresias.length})</CardTitle>
          <Button onClick={openCreate} size="sm" className="cursor-pointer">
            <Plus className="size-4" />
            Nueva membresía
          </Button>
        </CardHeader>
        <CardContent>
          {membresias.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay membresías. Crea la primera.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Orden</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membresias.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">
                      {m.nombre}
                      {m.destacado && (
                        <Badge className="ml-2 text-[10px]">Popular</Badge>
                      )}
                    </TableCell>
                    <TableCell>${m.precio}</TableCell>
                    <TableCell>{periodoLabel[m.periodo]}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{categoriaLabel[m.categoria]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={m.activa ? "default" : "secondary"}>
                        {m.activa ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{m.orden}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 cursor-pointer"
                          onClick={() => handleMover(m, "up")}
                          disabled={loading === `move-${m.id}`}
                          title="Subir"
                        >
                          <ChevronUp className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 cursor-pointer"
                          onClick={() => handleMover(m, "down")}
                          disabled={loading === `move-${m.id}`}
                          title="Bajar"
                        >
                          <ChevronDown className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 cursor-pointer"
                          onClick={() => handleToggleVisible(m)}
                          disabled={loading === `vis-${m.id}`}
                          title={m.visible_en_sitio ? "Ocultar del sitio" : "Mostrar en sitio"}
                        >
                          {loading === `vis-${m.id}` ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : m.visible_en_sitio ? (
                            <Eye className="size-4 text-primary" />
                          ) : (
                            <EyeOff className="size-4 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 cursor-pointer"
                          onClick={() => openEdit(m)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 cursor-pointer text-destructive hover:text-destructive"
                          onClick={() => handleDelete(m.id)}
                          disabled={loading === m.id}
                        >
                          {loading === m.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle className="font-heading uppercase">
              {editing ? "Editar membresía" : "Nueva membresía"}
            </SheetTitle>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="precio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio ($)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="precio_diario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio diario ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Opcional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="periodo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mes">Mensual</SelectItem>
                          <SelectItem value="quincena">Quincenal</SelectItem>
                          <SelectItem value="trimestre">Trimestral</SelectItem>
                          <SelectItem value="anual">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="especial">Especial</SelectItem>
                          <SelectItem value="clase">Clase</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        rows={3}
                        className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder="Descripción opcional..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requisito"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requisito</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Presentar carnet estudiantil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imagen_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de imagen</FormLabel>
                    <FormControl>
                      <Input placeholder="/images/promo/ejemplo.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Beneficios */}
              <div className="space-y-2">
                <FormLabel>Beneficios</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={beneficiosInput}
                    onChange={(e) => setBeneficiosInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addBeneficio(); } }}
                    placeholder="Escribe un beneficio y presiona Enter"
                  />
                  <Button type="button" variant="outline" onClick={addBeneficio} className="cursor-pointer">
                    <Plus className="size-4" />
                  </Button>
                </div>
                {beneficios.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {beneficios.map((b, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs"
                      >
                        {b}
                        <button
                          type="button"
                          onClick={() => setBeneficios((p) => p.filter((_, j) => j !== i))}
                          className="cursor-pointer text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Horarios (para clases) */}
              <div className="space-y-2">
                <FormLabel>Horarios (para clases)</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={horariosInput}
                    onChange={(e) => setHorariosInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHorario(); } }}
                    placeholder="Ej: Lunes y Miércoles 7:00am - 8:00am"
                  />
                  <Button type="button" variant="outline" onClick={addHorario} className="cursor-pointer">
                    <Plus className="size-4" />
                  </Button>
                </div>
                {horariosArr.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {horariosArr.map((h, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs"
                      >
                        {h}
                        <button
                          type="button"
                          onClick={() => setHorariosArr((p) => p.filter((_, j) => j !== i))}
                          className="cursor-pointer text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "destacado" as const, label: "Marcar como popular" },
                  { name: "es_clase" as const, label: "Es una clase" },
                  { name: "activa" as const, label: "Membresía activa" },
                  { name: "visible_en_sitio" as const, label: "Visible en sitio web" },
                ].map(({ name, label }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value as boolean}
                            onChange={field.onChange}
                            className="cursor-pointer size-4 accent-primary"
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">{label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={loading === "save"}
                  className="flex-1 cursor-pointer"
                >
                  {loading === "save" && <Loader2 className="size-4 animate-spin" />}
                  {editing ? "Guardar cambios" : "Crear membresía"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSheetOpen(false)}
                  className="cursor-pointer"
                >
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
