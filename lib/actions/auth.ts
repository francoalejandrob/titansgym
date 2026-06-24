"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations/auth";

export interface LoginResult {
  success: boolean;
  error?: string;
}

export async function login(values: unknown): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: "Revisa tu email y contraseña." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: "Credenciales incorrectas." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
