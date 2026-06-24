import { ClientesTable } from "@/components/admin/clientes-table";
import { getAllClientes } from "@/lib/data/admin-queries";

export default async function AdminClientesPage() {
  const clientes = await getAllClientes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight">
          Clientes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Perfiles nutricionales y seguimiento de clientes del gimnasio.
        </p>
      </div>
      <ClientesTable clientes={clientes} />
    </div>
  );
}
