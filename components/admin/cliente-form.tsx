"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import type { Cliente } from "@/lib/types/database";
import { createCliente, updateCliente } from "@/lib/actions/admin/clientes";

const schema = z.object({
  nombre: z.string().min(1, "Requerido"),
  fecha_nacimiento: z.string().optional(),
  sexo: z.enum(["masculino", "femenino", "otro"]).optional(),
  correo: z.string().email("Email inválido").optional().or(z.literal("")),
  telefono: z.string().optional(),
  // Numeric fields stored as strings in the form, converted on submit
  peso: z.string().optional(),
  talla: z.string().optional(),
  porcentaje_grasa: z.string().optional(),
  masa_muscular: z.string().optional(),
  grasa_visceral: z.string().optional(),
  circunferencia_cintura: z.string().optional(),
  circunferencia_cadera: z.string().optional(),
  medicamentos: z.string().optional(),
  nivel_actividad: z.enum(["sedentario", "levemente_activo", "moderadamente_activo", "muy_activo"]).optional(),
  preferencia_alimentaria: z.enum(["omnivoro", "vegetariano", "vegano", "otro"]).optional(),
  objetivo_nutricional: z.enum(["perdida_peso", "ganancia_muscular", "mantenimiento", "medico"]).optional(),
});

function parseNum(v: string | undefined): number | null {
  if (!v || v.trim() === "") return null;
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  cliente?: Cliente;
}

export function ClienteForm({ open, onClose, cliente }: Props) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [patologiasInput, setPatologiasInput] = React.useState("");
  const [patologias, setPatologias] = React.useState<string[]>([]);
  const [alergiasInput, setAlergiasInput] = React.useState("");
  const [alergias, setAlergias] = React.useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      fecha_nacimiento: "",
      correo: "",
      telefono: "",
      peso: "",
      talla: "",
      porcentaje_grasa: "",
      masa_muscular: "",
      grasa_visceral: "",
      circunferencia_cintura: "",
      circunferencia_cadera: "",
      medicamentos: "",
    },
  });

  React.useEffect(() => {
    if (cliente) {
      form.reset({
        nombre: cliente.nombre,
        fecha_nacimiento: cliente.fecha_nacimiento ?? "",
        sexo: cliente.sexo ?? undefined,
        correo: cliente.correo ?? "",
        telefono: cliente.telefono ?? "",
        peso: cliente.peso?.toString() ?? "",
        talla: cliente.talla?.toString() ?? "",
        porcentaje_grasa: cliente.porcentaje_grasa?.toString() ?? "",
        masa_muscular: cliente.masa_muscular?.toString() ?? "",
        grasa_visceral: cliente.grasa_visceral?.toString() ?? "",
        circunferencia_cintura: cliente.circunferencia_cintura?.toString() ?? "",
        circunferencia_cadera: cliente.circunferencia_cadera?.toString() ?? "",
        medicamentos: cliente.medicamentos ?? "",
        nivel_actividad: cliente.nivel_actividad ?? undefined,
        preferencia_alimentaria: cliente.preferencia_alimentaria ?? undefined,
        objetivo_nutricional: cliente.objetivo_nutricional ?? undefined,
      });
      setPatologias(cliente.patologias ?? []);
      setAlergias(cliente.alergias ?? []);
    } else {
      form.reset();
      setPatologias([]);
      setAlergias([]);
    }
  }, [cliente, form]);

  function addTag(
    input: string,
    setInput: (v: string) => void,
    arr: string[],
    setArr: (v: string[]) => void
  ) {
    const val = input.trim();
    if (val && !arr.includes(val)) setArr([...arr, val]);
    setInput("");
  }

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const payload = {
        nombre: values.nombre,
        fecha_nacimiento: values.fecha_nacimiento || null,
        sexo: values.sexo || null,
        correo: values.correo || null,
        telefono: values.telefono || null,
        medicamentos: values.medicamentos || null,
        nivel_actividad: values.nivel_actividad || null,
        preferencia_alimentaria: values.preferencia_alimentaria || null,
        objetivo_nutricional: values.objetivo_nutricional || null,
        peso: parseNum(values.peso),
        talla: parseNum(values.talla),
        porcentaje_grasa: parseNum(values.porcentaje_grasa),
        masa_muscular: parseNum(values.masa_muscular),
        grasa_visceral: parseNum(values.grasa_visceral),
        circunferencia_cintura: parseNum(values.circunferencia_cintura),
        circunferencia_cadera: parseNum(values.circunferencia_cadera),
        patologias: patologias.length > 0 ? patologias : null,
        alergias: alergias.length > 0 ? alergias : null,
      };
      if (cliente) {
        await updateCliente(cliente.id, payload);
        toast.success("Cliente actualizado");
      } else {
        await createCliente(payload);
        toast.success("Cliente creado");
      }
      onClose();
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="font-heading uppercase">
            {cliente ? "Editar cliente" : "Nuevo cliente"}
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
            {/* Datos personales */}
            <div className="space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Datos personales
              </h3>

              <FormField control={form.control} name="nombre" render={({ field }) => (
                <FormItem><FormLabel>Nombre completo *</FormLabel>
                  <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="fecha_nacimiento" render={({ field }) => (
                  <FormItem><FormLabel>Fecha de nacimiento</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sexo" render={({ field }) => (
                  <FormItem><FormLabel>Sexo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="cursor-pointer"><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="correo" render={({ field }) => (
                  <FormItem><FormLabel>Correo</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="telefono" render={({ field }) => (
                  <FormItem><FormLabel>Teléfono</FormLabel>
                    <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>

            {/* Datos antropométricos */}
            <div className="space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Datos antropométricos
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "peso" as const, label: "Peso (kg)" },
                  { name: "talla" as const, label: "Talla (cm)" },
                  { name: "porcentaje_grasa" as const, label: "% Grasa corporal" },
                  { name: "masa_muscular" as const, label: "Masa muscular (kg)" },
                  { name: "grasa_visceral" as const, label: "Índice grasa visceral" },
                  { name: "circunferencia_cintura" as const, label: "Cintura (cm)" },
                  { name: "circunferencia_cadera" as const, label: "Cadera (cm)" },
                ].map(({ name, label }) => (
                  <FormField key={name} control={form.control} name={name} render={({ field }) => (
                    <FormItem><FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} value={field.value ?? ""} />
                      </FormControl><FormMessage /></FormItem>
                  )} />
                ))}
              </div>
            </div>

            {/* Datos clínicos / nutricionales */}
            <div className="space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Datos clínicos y nutricionales
              </h3>

              {/* Patologías */}
              <div className="space-y-2">
                <FormLabel>Patologías / condiciones</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={patologiasInput}
                    onChange={(e) => setPatologiasInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(patologiasInput, setPatologiasInput, patologias, setPatologias); } }}
                    placeholder="Ej: Diabetes, hipertensión..."
                  />
                  <Button type="button" variant="outline" className="cursor-pointer"
                    onClick={() => addTag(patologiasInput, setPatologiasInput, patologias, setPatologias)}>
                    <Plus className="size-4" />
                  </Button>
                </div>
                <TagList tags={patologias} onRemove={(i) => setPatologias(patologias.filter((_, j) => j !== i))} />
              </div>

              {/* Alergias */}
              <div className="space-y-2">
                <FormLabel>Alergias e intolerancias</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={alergiasInput}
                    onChange={(e) => setAlergiasInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(alergiasInput, setAlergiasInput, alergias, setAlergias); } }}
                    placeholder="Ej: Gluten, lactosa..."
                  />
                  <Button type="button" variant="outline" className="cursor-pointer"
                    onClick={() => addTag(alergiasInput, setAlergiasInput, alergias, setAlergias)}>
                    <Plus className="size-4" />
                  </Button>
                </div>
                <TagList tags={alergias} onRemove={(i) => setAlergias(alergias.filter((_, j) => j !== i))} />
              </div>

              <FormField control={form.control} name="medicamentos" render={({ field }) => (
                <FormItem><FormLabel>Medicamentos actuales</FormLabel>
                  <FormControl>
                    <textarea {...field} rows={2}
                      className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Ej: Metformina 500mg..." />
                  </FormControl><FormMessage /></FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="nivel_actividad" render={({ field }) => (
                  <FormItem><FormLabel>Nivel de actividad</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="cursor-pointer"><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="sedentario">Sedentario</SelectItem>
                        <SelectItem value="levemente_activo">Levemente activo</SelectItem>
                        <SelectItem value="moderadamente_activo">Moderadamente activo</SelectItem>
                        <SelectItem value="muy_activo">Muy activo</SelectItem>
                      </SelectContent>
                    </Select><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="preferencia_alimentaria" render={({ field }) => (
                  <FormItem><FormLabel>Preferencia alimentaria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="cursor-pointer"><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="omnivoro">Omnívoro</SelectItem>
                        <SelectItem value="vegetariano">Vegetariano</SelectItem>
                        <SelectItem value="vegano">Vegano</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="objetivo_nutricional" render={({ field }) => (
                  <FormItem className="col-span-2"><FormLabel>Objetivo nutricional</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="cursor-pointer"><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="perdida_peso">Pérdida de peso</SelectItem>
                        <SelectItem value="ganancia_muscular">Ganancia muscular</SelectItem>
                        <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                        <SelectItem value="medico">Seguimiento médico</SelectItem>
                      </SelectContent>
                    </Select><FormMessage /></FormItem>
                )} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="flex-1 cursor-pointer">
                {loading && <Loader2 className="size-4 animate-spin" />}
                {cliente ? "Guardar cambios" : "Crear cliente"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

function TagList({ tags, onRemove }: { tags: string[]; onRemove: (i: number) => void }) {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t, i) => (
        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs">
          {t}
          <button type="button" onClick={() => onRemove(i)} className="cursor-pointer text-muted-foreground hover:text-foreground">
            <X className="size-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
