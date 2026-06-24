import { MembresiaManager } from "@/components/admin/membresias-manager";
import { getAllMembresias } from "@/lib/data/admin-queries";

export default async function AdminMembresíasPage() {
  const membresias = await getAllMembresias();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight">
          Membresías
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administra los planes y membresías que se muestran en el sitio web.
          Los cambios se reflejan de inmediato en la página pública.
        </p>
      </div>

      <MembresiaManager membresias={membresias} />
    </div>
  );
}
