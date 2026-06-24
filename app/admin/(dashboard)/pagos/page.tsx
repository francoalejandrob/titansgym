import { DollarSign, TrendingUp, CreditCard, Receipt } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCard } from "@/components/admin/kpi-card";
import { PagosManager } from "@/components/admin/pagos-manager";
import { CuentasManager } from "@/components/admin/cuentas-manager";
import { getAllPagos, getAllCuentasBancarias } from "@/lib/data/admin-queries";

export default async function AdminPagosPage() {
  const [pagos, cuentas] = await Promise.all([
    getAllPagos(),
    getAllCuentasBancarias(),
  ]);

  const now = new Date();
  const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
  const pagosMes = pagos.filter((p) => new Date(p.fecha) >= inicioMes);
  const ingresosMes = pagosMes.reduce((sum, p) => sum + p.monto, 0);
  const ingresosTotal = pagos.reduce((sum, p) => sum + p.monto, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight">
          Pagos y Finanzas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registros de pagos y gestión de cuentas bancarias.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Ingresos este mes"
          value={`$${ingresosMes.toFixed(2)}`}
          icon={TrendingUp}
          accent="success"
        />
        <KpiCard
          label="Pagos este mes"
          value={pagosMes.length}
          icon={Receipt}
          accent="primary"
        />
        <KpiCard
          label="Ingresos totales"
          value={`$${ingresosTotal.toFixed(2)}`}
          icon={DollarSign}
          accent="muted"
        />
        <KpiCard
          label="Cuentas bancarias"
          value={cuentas.filter((c) => c.activa).length}
          icon={CreditCard}
          accent="muted"
        />
      </div>

      <Tabs defaultValue="pagos">
        <TabsList className="h-11 gap-1 rounded-xl p-1.5">
          <TabsTrigger value="pagos" className="h-8 gap-1.5 rounded-lg px-4 text-sm">
            <Receipt className="size-4" />
            Registros de pago
          </TabsTrigger>
          <TabsTrigger value="cuentas" className="h-8 gap-1.5 rounded-lg px-4 text-sm">
            <CreditCard className="size-4" />
            Cuentas bancarias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pagos" className="mt-6">
          <PagosManager pagos={pagos} cuentas={cuentas} />
        </TabsContent>
        <TabsContent value="cuentas" className="mt-6">
          <CuentasManager cuentas={cuentas} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
