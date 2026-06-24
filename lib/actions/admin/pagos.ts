"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createPago(data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from("pagos").insert(data as never);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pagos");
}

export async function deletePago(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("pagos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pagos");
}

export async function createCuentaBancaria(data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from("cuentas_bancarias").insert(data as never);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pagos");
}

export async function updateCuentaBancaria(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("cuentas_bancarias")
    .update(data as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pagos");
}

export async function deleteCuentaBancaria(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("cuentas_bancarias").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pagos");
}

export async function setPrincipalCuenta(id: string) {
  const supabase = await createClient();
  await supabase.from("cuentas_bancarias").update({ es_principal: false } as never).neq("id", id);
  const { error } = await supabase
    .from("cuentas_bancarias")
    .update({ es_principal: true } as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pagos");
}
