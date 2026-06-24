import { LeadsTable } from "@/components/admin/leads-table";
import { getAllLeads } from "@/lib/data/admin-queries";

export default async function AdminLeadsPage() {
  const leads = await getAllLeads();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight">
          Leads
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestiona los clientes potenciales generados desde el sitio web.
        </p>
      </div>

      <LeadsTable leads={leads} />
    </div>
  );
}
