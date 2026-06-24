import { Eye, TrendingUp, CalendarDays, Calendar } from "lucide-react";
import { KpiCard } from "@/components/admin/kpi-card";
import { VisitasOverTimeChart } from "@/components/admin/visitas-chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getVisitasStats } from "@/lib/data/admin-queries";

export default async function AdminVisitasPage() {
  const visitas = await getVisitasStats();

  const now = new Date();
  const hoyStr = now.toISOString().slice(0, 10);
  const inicioSemana = new Date(now);
  inicioSemana.setDate(now.getDate() - 6);
  const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);

  const total = visitas.length;
  const hoy = visitas.filter((v) => v.created_at.slice(0, 10) === hoyStr).length;
  const semana = visitas.filter(
    (v) => new Date(v.created_at) >= inicioSemana
  ).length;
  const mes = visitas.filter(
    (v) => new Date(v.created_at) >= inicioMes
  ).length;

  // Last 30 days chart
  const last30 = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().slice(0, 10);
    return {
      fecha: d.toLocaleDateString("es-EC", { day: "2-digit", month: "2-digit" }),
      total: visitas.filter((v) => v.created_at.slice(0, 10) === key).length,
    };
  });

  // Top pages
  const pageCount = visitas.reduce<Record<string, number>>((acc, v) => {
    acc[v.pagina] = (acc[v.pagina] ?? 0) + 1;
    return acc;
  }, {});
  const topPages = Object.entries(pageCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight">
          Visitas al sitio
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Análisis de tráfico del sitio web público.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total de visitas" value={total} icon={Eye} />
        <KpiCard label="Hoy" value={hoy} icon={TrendingUp} accent="success" />
        <KpiCard label="Esta semana" value={semana} icon={CalendarDays} accent="primary" />
        <KpiCard label="Este mes" value={mes} icon={Calendar} accent="muted" />
      </div>

      <VisitasOverTimeChart data={last30} />

      <Card>
        <CardHeader>
          <CardTitle>Páginas más visitadas</CardTitle>
        </CardHeader>
        <CardContent>
          {topPages.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No hay visitas registradas aún.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Página</TableHead>
                  <TableHead className="text-right">Visitas</TableHead>
                  <TableHead className="text-right">% del total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPages.map(([pagina, count]) => (
                  <TableRow key={pagina}>
                    <TableCell className="font-mono text-sm">{pagina}</TableCell>
                    <TableCell className="text-right font-medium">{count}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {total > 0 ? ((count / total) * 100).toFixed(1) : "0"}%
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
