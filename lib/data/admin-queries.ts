import { createClient } from "@/lib/supabase/server";

// Queries del panel admin: a diferencia de lib/data/queries.ts, aquí no
// degradamos a fallback estático — si Supabase falla, el admin debe verlo.

export async function getAllLeads() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllContacto() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacto")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllPromociones() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("promociones")
    .select("*")
    .order("orden", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAllTestimonios() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonios")
    .select("*")
    .order("orden", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAllGaleria() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("galeria")
    .select("*")
    .order("orden", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAllHorarios() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("horarios")
    .select("*")
    .order("orden", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getSiteConfig() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("configuracion_sitio")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data;
}

export async function getAllMembresias() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("membresias")
    .select("*")
    .order("orden", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAllClientes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("activo", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getClienteById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function getMedicionesCliente(clienteId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mediciones_cliente")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("fecha", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getNotasCliente(clienteId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notas_cliente")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getVisitasStats() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visitas")
    .select("pagina, created_at")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getAllPagos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pagos")
    .select("*")
    .order("fecha", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllCuentasBancarias() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cuentas_bancarias")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}
