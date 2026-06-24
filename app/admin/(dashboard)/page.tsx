import Link from "next/link";
import { Users, UserPlus, Mail, Megaphone, ArrowRight, Eye, TrendingUp, UserCircle, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KpiCard } from "@/components/admin/kpi-card";
import { LeadsByEstadoChart, LeadsOverTimeChart } from "@/components/admin/leads-charts";
import {
  getAllContacto, getAllLeads, getAllPromociones,
  getVisitasStats, getAllPagos, getAllClientes,
} from "@/lib/data/admin-queries";
import type { LeadEstado } from "@/lib/types/database";

const estadoVariant: Record<LeadEstado, "default" | "secondary" | "outline" | "destructive"> = {
  nuevo: "default",
  contactado: "secondary",
  convertido: "outline",
  descartado: "destructive",
};

const estadoLabel: Record<LeadEstado, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  convertido: "Convertido",
  descartado: "Descartado",
};

export default async function AdminDashboardPage() {
  const [leads, contacto, promociones, visitas, pagos, clientes] = await Promise.all([
    getAllLeads(),
    getAllContacto(),
    getAllPromociones(),
    getVisitasStats().catch(() => [] as { pagina: string; created_at: string }[]),
    getAllPagos().catch(() => [] as { monto: number; fecha: string }[]),
    getAllClientes().catch(() => [] as unknown[]),
  ]);

  const leadsPorEstado = leads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.estado] = (acc[lead.estado] ?? 0) + 1;
    return acc;
  }, {});

  const mensajesSinLeer = contacto.filter((c) => !c.leido).length;
  const promocionesActivas = promociones.filter((p) => p.activa).length;

  const hoyStr = new Date().toISOString().slice(0, 10);
  const visitasHoy = visitas.filter((v) => v.created_at.slice(0, 10) === hoyStr).length;

  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const ingresosMes = pagos
    .filter((p) => new Date(p.fecha) >= inicioMes)
    .reduce((sum, p) => sum + p.monto, 0);

  const hoy = new Date();
  const last14 = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(hoy);
    d.setDate(d.getDate() - (13 - i));
    return d;
  });
  const leadsPorDia = last14.map((d) => {
    const key = d.toISOString().slice(0, 10);
    const total = leads.filter((l) => l.created_at.slice(0, 10) === key).length;
    return {
      fecha: d.toLocaleDateString("es-EC", { day: "2-digit", month: "2-digit" }),
      total,
    };
  });

  const recientes = leads.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen general de la actividad del gimnasio.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total de leads" value={leads.length} icon={Users} />
        <KpiCard
          label="Leads nuevos"
          value={leadsPorEstado["nuevo"] ?? 0}
          icon={UserPlus}
          accent="success"
        />
        <KpiCard
          label="Mensajes sin leer"
          value={mensajesSinLeer}
          icon={Mail}
          accent={mensajesSinLeer > 0 ? "primary" : "muted"}
        />
        <KpiCard
          label="Promociones activas"
          value={promocionesActivas}
          icon={Megaphone}
          accent="muted"
        />
        <KpiCard label="Visitas hoy" value={visitasHoy} icon={Eye} accent="primary" />
        <KpiCard
          label="Ingresos este mes"
          value={`$${ingresosMes.toFixed(2)}`}
          icon={DollarSign}
          accent="success"
        />
        <KpiCard label="Total clientes" value={clientes.length} icon={UserCircle} accent="muted" />
        <KpiCard label="Todas las visitas" value={visitas.length} icon={TrendingUp} accent="muted" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LeadsOverTimeChart data={leadsPorDia} />
        <LeadsByEstadoChart data={leadsPorEstado} />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Leads recientes</CardTitle>
          <Button render={<Link href="/admin/leads" />} nativeButton={false} variant="secondary" size="sm" className="cursor-pointer">
            Ver todos
            <ArrowRight className="size-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {recientes.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Todavía no hay leads registrados.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Plan de interés</TableHead>
                  <TableHead>Origen</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recientes.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.nombre}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {lead.plan_interes ?? "—"}
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {lead.origen}
                    </TableCell>
                    <TableCell>
                      <Badge variant={estadoVariant[lead.estado]}>
                        {estadoLabel[lead.estado]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
