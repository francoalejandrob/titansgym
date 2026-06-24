import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
  } catch {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="font-heading text-lg font-bold uppercase tracking-tight text-destructive">
            Supabase no configurado
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Completa las variables de entorno en <code>.env.local</code> y
            ejecuta las migraciones antes de usar el panel admin. Revisa{" "}
            <code>supabase/README.md</code> para los pasos.
          </p>
        </div>
      </div>
    );
  }

  if (!userEmail) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar adminEmail={userEmail} />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
