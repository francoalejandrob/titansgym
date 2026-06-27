"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitRegistroCliente } from "@/lib/actions/registro-cliente";

function parseNum(v: string): number | null {
  if (!v.trim()) return null;
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

export function RegistroForm() {
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const [nombre, setNombre] = React.useState("");
  const [correo, setCorreo] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [fechaNacimiento, setFechaNacimiento] = React.useState("");
  const [sexo, setSexo] = React.useState("");
  const [peso, setPeso] = React.useState("");
  const [talla, setTalla] = React.useState("");
  const [objetivo, setObjetivo] = React.useState("");
  const [nivelActividad, setNivelActividad] = React.useState("");
  const [preferencia, setPreferencia] = React.useState("");
  const [medicamentos, setMedicamentos] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !correo.trim()) {
      toast.error("Nombre y correo son obligatorios.");
      return;
    }
    setLoading(true);
    try {
      await submitRegistroCliente({
        nombre,
        correo,
        telefono: telefono || undefined,
        fecha_nacimiento: fechaNacimiento || undefined,
        sexo: (sexo as "masculino" | "femenino" | "otro") || undefined,
        peso: parseNum(peso),
        talla: parseNum(talla),
        objetivo_nutricional: (objetivo as "perdida_peso" | "ganancia_muscular" | "mantenimiento" | "medico") || null,
        nivel_actividad: (nivelActividad as "sedentario" | "levemente_activo" | "moderadamente_activo" | "muy_activo") || null,
        preferencia_alimentaria: (preferencia as "omnivoro" | "vegetariano" | "vegano" | "otro") || null,
        medicamentos: medicamentos || undefined,
      });
      setSent(true);
    } catch {
      toast.error("Hubo un error. Por favor inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-12 text-center"
      >
        <CheckCircle className="size-14 text-primary" />
        <h3 className="font-heading text-2xl font-bold uppercase">
          ¡Registro exitoso!
        </h3>
        <p className="max-w-sm text-muted-foreground">
          Tus datos fueron enviados. Nuestro equipo se pondrá en contacto contigo pronto para comenzar tu plan personalizado.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Datos personales */}
      <div className="space-y-4">
        <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
          Datos personales
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Nombre completo *</label>
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre completo"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Correo electrónico *</label>
            <Input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Teléfono</label>
            <Input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+593 99 999 9999"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Fecha de nacimiento</label>
            <Input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Sexo</label>
            <Select value={sexo} onValueChange={(v) => setSexo(v ?? "")}>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="femenino">Femenino</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Datos físicos */}
      <div className="space-y-4">
        <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
          Datos físicos
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Peso (kg)</label>
            <Input
              type="number"
              step="0.1"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="Ej: 70.5"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Talla (cm)</label>
            <Input
              type="number"
              step="0.1"
              value={talla}
              onChange={(e) => setTalla(e.target.value)}
              placeholder="Ej: 170"
            />
          </div>
        </div>
      </div>

      {/* Objetivos y hábitos */}
      <div className="space-y-4">
        <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
          Objetivos y hábitos
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Objetivo principal</label>
            <Select value={objetivo} onValueChange={(v) => setObjetivo(v ?? "")}>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="perdida_peso">Pérdida de peso</SelectItem>
                <SelectItem value="ganancia_muscular">Ganancia muscular</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                <SelectItem value="medico">Seguimiento médico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Nivel de actividad actual</label>
            <Select value={nivelActividad} onValueChange={(v) => setNivelActividad(v ?? "")}>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentario">Sedentario</SelectItem>
                <SelectItem value="levemente_activo">Levemente activo</SelectItem>
                <SelectItem value="moderadamente_activo">Moderadamente activo</SelectItem>
                <SelectItem value="muy_activo">Muy activo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Preferencia alimentaria</label>
            <Select value={preferencia} onValueChange={(v) => setPreferencia(v ?? "")}>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="omnivoro">Omnívoro</SelectItem>
                <SelectItem value="vegetariano">Vegetariano</SelectItem>
                <SelectItem value="vegano">Vegano</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Condiciones médicas o medicamentos actuales{" "}
            <span className="text-muted-foreground">(opcional)</span>
          </label>
          <textarea
            value={medicamentos}
            onChange={(e) => setMedicamentos(e.target.value)}
            rows={3}
            placeholder="Ej: Diabetes tipo 2, tomo Metformina 500mg..."
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} size="lg" className="w-full cursor-pointer">
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <UserPlus className="size-5" />
        )}
        Enviar mis datos
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Tus datos son confidenciales y solo serán utilizados por el equipo de Titan&apos;s Gym para personalizar tu plan.
      </p>
    </form>
  );
}
