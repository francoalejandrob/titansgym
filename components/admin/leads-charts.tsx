"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const estadoLabels: Record<string, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  convertido: "Convertido",
  descartado: "Descartado",
};

export function LeadsByEstadoChart({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(estadoLabels).map(([key, label]) => ({
    estado: label,
    total: data[key] ?? 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads por estado</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="estado"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Bar dataKey="total" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function LeadsOverTimeChart({
  data,
}: {
  data: { fecha: string; total: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads últimos 14 días</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="fecha"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
