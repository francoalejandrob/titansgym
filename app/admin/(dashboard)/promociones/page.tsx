import { PromocionesManager } from "@/components/admin/promociones-manager";
import { getAllPromociones } from "@/lib/data/admin-queries";

export default async function AdminPromocionesPage() {
  const promociones = await getAllPromociones();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight">
          Promociones
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Crea y administra las promociones y descuentos activos del sitio.
        </p>
      </div>

      <PromocionesManager promociones={promociones} />
    </div>
  );
}
