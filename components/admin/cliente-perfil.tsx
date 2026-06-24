"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Pencil, Trash2, Plus, Loader2, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ClienteForm } from "@/components/admin/cliente-form";
import type { Cliente, MedicionCliente, NotaCliente } from "@/lib/types/database";
import {
  calcularEdad, calcularIMC, categoriaIMC, colorIMC,
  calcularTDEE, relacionCinturaCandera,
} from "@/lib/utils/nutricional";
import {
  deleteCliente, addMedicion, deleteMedicion, addNota, deleteNota,
} from "@/lib/actions/admin/clientes";

const nivelLabel: Record<string, string> = {
  sedentario: "Sedentario",
  levemente_activo: "Levemente activo",
  moderadamente_activo: "Moderadamente activo",
  muy_activo: "Muy activo",
};

const objetivoLabel: Record<string, string> = {
  perdida_peso: "Pérdida de peso",
  ganancia_muscular: "Ganancia muscular",
  mantenimiento: "Mantenimiento",
  medico: "Seguimiento médico",
};

export function ClientePerfil({
  cliente,
  mediciones,
  notas,
}: {
  cliente: Cliente;
  mediciones: MedicionCliente[];
  notas: NotaCliente[];
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = React.useState(false);
  const [loading, setLoading] = React.useState<string | null>(null);
  const [notaInput, setNotaInput] = React.useState("");
  const [medicionForm, setMedicionForm] = React.useState(false);
  const [medData, setMedData] = React.useState({
    fecha: new Date().toISOString().slice(0, 10),
    peso: "", porcentaje_grasa: "", masa_muscular: "",
    grasa_visceral: "", circunferencia_cintura: "", circunferencia_cadera: "",
  });

  const edad = cliente.fecha_nacimiento ? calcularEdad(cliente.fecha_nacimiento) : null;
  const imc = cliente.peso && cliente.talla ? calcularIMC(cliente.peso, cliente.talla) : null;
  const catImc = imc ? categoriaIMC(imc) : null;
  const colorImc = imc ? colorIMC(imc) : "";
  const tdee = cliente.peso && cliente.talla && edad && cliente.sexo && cliente.nivel_actividad
    ? calcularTDEE(cliente.peso, cliente.talla, edad, cliente.sexo, cliente.nivel_actividad)
    : null;
  const rcca = cliente.circunferencia_cintura && cliente.circunferencia_cadera
    ? relacionCinturaCandera(cliente.circunferencia_cintura, cliente.circunferencia_cadera)
    : null;

  async function handleDelete() {
    if (!confirm(`¿Eliminar el cliente ${cliente.nombre}?`)) return;
    setLoading("delete");
    try {
      await deleteCliente(cliente.id);
      toast.success("Cliente eliminado");
      router.push("/admin/clientes");
    } catch {
      toast.error("Error al eliminar");
      setLoading(null);
    }
  }

  async function handleAddMedicion(e: React.FormEvent) {
    e.preventDefault();
    setLoading("medicion");
    try {
      const payload = Object.fromEntries(
        Object.entries(medData).map(([k, v]) => [k, v === "" ? null : k === "fecha" ? v : Number(v)])
      );
      await addMedicion(cliente.id, payload);
      toast.success("Medición registrada");
      setMedicionForm(false);
      setMedData({ fecha: new Date().toISOString().slice(0, 10), peso: "", porcentaje_grasa: "", masa_muscular: "", grasa_visceral: "", circunferencia_cintura: "", circunferencia_cadera: "" });
      router.refresh();
    } catch {
      toast.error("Error al registrar medición");
    } finally {
      setLoading(null);
    }
  }

  async function handleDeleteMedicion(id: string) {
    setLoading(`med-${id}`);
    try {
      await deleteMedicion(id, cliente.id);
      router.refresh();
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setLoading(null);
    }
  }

  async function handleAddNota(e: React.FormEvent) {
    e.preventDefault();
    if (!notaInput.trim()) return;
    setLoading("nota");
    try {
      await addNota(cliente.id, notaInput.trim());
      setNotaInput("");
      router.refresh();
    } catch {
      toast.error("Error al guardar nota");
    } finally {
      setLoading(null);
    }
  }

  async function handleDeleteNota(id: string) {
    setLoading(`nota-${id}`);
    try {
      await deleteNota(id, cliente.id);
      router.refresh();
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: datos + clínicos */}
        <div className="space-y-6 lg:col-span-2">
          {/* Datos personales */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Datos personales</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="cursor-pointer" onClick={() => setEditOpen(true)}>
                  <Pencil className="size-4" /> Editar
                </Button>
                <Button size="sm" variant="outline" className="cursor-pointer text-destructive hover:text-destructive"
                  onClick={handleDelete} disabled={loading === "delete"}>
                  {loading === "delete" ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                <DataItem label="Nombre" value={cliente.nombre} />
                <DataItem label="Fecha de nacimiento" value={cliente.fecha_nacimiento ? new Date(cliente.fecha_nacimiento + "T00:00:00").toLocaleDateString("es-EC") : null} />
                <DataItem label="Edad" value={edad !== null ? `${edad} años` : null} />
                <DataItem label="Sexo" value={cliente.sexo ? cliente.sexo.charAt(0).toUpperCase() + cliente.sexo.slice(1) : null} />
                <DataItem label="Correo" value={cliente.correo} />
                <DataItem label="Teléfono" value={cliente.telefono} />
              </dl>
            </CardContent>
          </Card>

          {/* Métricas calculadas */}
          {(imc || tdee || rcca) && (
            <Card>
              <CardHeader><CardTitle>Métricas calculadas</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {imc && (
                    <MetricBox
                      label="IMC"
                      value={imc.toFixed(1)}
                      sub={catImc ?? ""}
                      valueClass={colorImc}
                    />
                  )}
                  {tdee && (
                    <MetricBox label="TDEE" value={`${tdee}`} sub="kcal/día" />
                  )}
                  {rcca && (
                    <MetricBox label="Relación C/C" value={rcca} sub="cintura/cadera" />
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Datos antropométricos */}
          <Card>
            <CardHeader><CardTitle>Datos antropométricos actuales</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                <DataItem label="Peso" value={cliente.peso ? `${cliente.peso} kg` : null} />
                <DataItem label="Talla" value={cliente.talla ? `${cliente.talla} cm` : null} />
                <DataItem label="% Grasa" value={cliente.porcentaje_grasa ? `${cliente.porcentaje_grasa}%` : null} />
                <DataItem label="Masa muscular" value={cliente.masa_muscular ? `${cliente.masa_muscular} kg` : null} />
                <DataItem label="Grasa visceral" value={cliente.grasa_visceral ? `${cliente.grasa_visceral}` : null} />
                <DataItem label="Cintura" value={cliente.circunferencia_cintura ? `${cliente.circunferencia_cintura} cm` : null} />
                <DataItem label="Cadera" value={cliente.circunferencia_cadera ? `${cliente.circunferencia_cadera} cm` : null} />
              </dl>
            </CardContent>
          </Card>

          {/* Historial de mediciones */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Historial de mediciones</CardTitle>
              <Button size="sm" variant="outline" className="cursor-pointer" onClick={() => setMedicionForm((v) => !v)}>
                <Plus className="size-4" /> Nueva medición
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {medicionForm && (
                <form onSubmit={handleAddMedicion} className="rounded-lg border border-border p-4 space-y-3">
                  <h4 className="text-sm font-semibold">Registrar medición</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-xs text-muted-foreground">Fecha</label>
                      <Input type="date" value={medData.fecha} onChange={(e) => setMedData((p) => ({ ...p, fecha: e.target.value }))} />
                    </div>
                    {[
                      { key: "peso", label: "Peso (kg)" },
                      { key: "porcentaje_grasa", label: "% Grasa" },
                      { key: "masa_muscular", label: "Masa muscular (kg)" },
                      { key: "grasa_visceral", label: "Grasa visceral" },
                      { key: "circunferencia_cintura", label: "Cintura (cm)" },
                      { key: "circunferencia_cadera", label: "Cadera (cm)" },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="text-xs text-muted-foreground">{label}</label>
                        <Input type="number" step="0.01" placeholder="—"
                          value={(medData as Record<string, string>)[key]}
                          onChange={(e) => setMedData((p) => ({ ...p, [key]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={loading === "medicion"} className="cursor-pointer">
                      {loading === "medicion" && <Loader2 className="size-4 animate-spin" />}
                      Guardar
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="cursor-pointer" onClick={() => setMedicionForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}

              {mediciones.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">Sin mediciones registradas.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Peso</TableHead>
                      <TableHead>% Grasa</TableHead>
                      <TableHead>Músculo</TableHead>
                      <TableHead>Cintura</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mediciones.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="text-sm">{new Date(m.fecha + "T00:00:00").toLocaleDateString("es-EC")}</TableCell>
                        <TableCell>{m.peso ? `${m.peso} kg` : "—"}</TableCell>
                        <TableCell>{m.porcentaje_grasa ? `${m.porcentaje_grasa}%` : "—"}</TableCell>
                        <TableCell>{m.masa_muscular ? `${m.masa_muscular} kg` : "—"}</TableCell>
                        <TableCell>{m.circunferencia_cintura ? `${m.circunferencia_cintura} cm` : "—"}</TableCell>
                        <TableCell className="text-right">
                          <Button size="icon" variant="ghost" className="size-7 cursor-pointer text-destructive hover:text-destructive"
                            onClick={() => handleDeleteMedicion(m.id)} disabled={loading === `med-${m.id}`}>
                            {loading === `med-${m.id}` ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: clínico + notas */}
        <div className="space-y-6">
          {/* Datos clínicos */}
          <Card>
            <CardHeader><CardTitle>Datos clínicos</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <DataItem label="Nivel de actividad"
                value={cliente.nivel_actividad ? nivelLabel[cliente.nivel_actividad] : null} />
              <DataItem label="Objetivo"
                value={cliente.objetivo_nutricional ? objetivoLabel[cliente.objetivo_nutricional] : null} />
              <DataItem label="Preferencia alimentaria"
                value={cliente.preferencia_alimentaria ? cliente.preferencia_alimentaria.charAt(0).toUpperCase() + cliente.preferencia_alimentaria.slice(1) : null} />

              {cliente.patologias && cliente.patologias.length > 0 && (
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">Patologías</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cliente.patologias.map((p) => (
                      <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {cliente.alergias && cliente.alergias.length > 0 && (
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">Alergias e intolerancias</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cliente.alergias.map((a) => (
                      <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {cliente.medicamentos && (
                <DataItem label="Medicamentos" value={cliente.medicamentos} />
              )}
            </CardContent>
          </Card>

          {/* Notas de seguimiento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="size-4" />
                Notas de seguimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAddNota} className="flex gap-2">
                <Input
                  placeholder="Agregar nota..."
                  value={notaInput}
                  onChange={(e) => setNotaInput(e.target.value)}
                />
                <Button type="submit" size="sm" disabled={loading === "nota"} className="cursor-pointer">
                  {loading === "nota" ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                </Button>
              </form>

              {notas.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">Sin notas.</p>
              ) : (
                <div className="space-y-2">
                  {notas.map((n) => (
                    <div key={n.id} className="group flex items-start justify-between gap-2 rounded-lg border border-border p-3">
                      <div>
                        <p className="text-sm">{n.nota}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(n.created_at).toLocaleDateString("es-EC", {
                            day: "2-digit", month: "2-digit", year: "numeric",
                          })}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7 shrink-0 cursor-pointer text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => handleDeleteNota(n.id)}
                        disabled={loading === `nota-${n.id}`}
                      >
                        {loading === `nota-${n.id}` ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Trash2 className="size-3" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ClienteForm open={editOpen} onClose={() => setEditOpen(false)} cliente={cliente} />
    </>
  );
}

function DataItem({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value ?? "—"}</dd>
    </div>
  );
}

function MetricBox({ label, value, sub, valueClass }: { label: string; value: string; sub: string; valueClass?: string }) {
  return (
    <div className="rounded-xl border border-border p-4 text-center">
      <p className={`font-heading text-2xl font-extrabold ${valueClass ?? "text-foreground"}`}>{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
