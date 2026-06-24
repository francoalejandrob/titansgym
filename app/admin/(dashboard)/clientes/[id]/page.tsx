import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientePerfil } from "@/components/admin/cliente-perfil";
import {
  getClienteById,
  getMedicionesCliente,
  getNotasCliente,
} from "@/lib/data/admin-queries";

export default async function ClientePerfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [cliente, mediciones, notas] = await Promise.all([
    getClienteById(id).catch(() => null),
    getMedicionesCliente(id),
    getNotasCliente(id),
  ]);

  if (!cliente) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          render={<Link href="/admin/clientes" />}
          nativeButton={false}
          variant="ghost"
          size="icon"
          className="cursor-pointer"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight">
            {cliente.nombre}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Perfil nutricional completo
          </p>
        </div>
      </div>

      <ClientePerfil
        cliente={cliente}
        mediciones={mediciones}
        notas={notas}
      />
    </div>
  );
}
