"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createCliente(data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from("clientes").insert(data as never);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/clientes");
}

export async function updateCliente(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("clientes")
    .update({ ...data, updated_at: new Date().toISOString() } as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/clientes");
  revalidatePath(`/admin/clientes/${id}`);
}

export async function deleteCliente(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("clientes")
    .update({ activo: false, updated_at: new Date().toISOString() } as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/clientes");
}

export async function addMedicion(clienteId: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("mediciones_cliente")
    .insert({ ...data, cliente_id: clienteId } as never);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/clientes/${clienteId}`);
}

export async function deleteMedicion(id: string, clienteId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("mediciones_cliente").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/clientes/${clienteId}`);
}

export async function addNota(clienteId: string, nota: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notas_cliente")
    .insert({ cliente_id: clienteId, nota } as never);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/clientes/${clienteId}`);
}

export async function deleteNota(id: string, clienteId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("notas_cliente").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/clientes/${clienteId}`);
}
