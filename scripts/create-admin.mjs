// Crea (o actualiza la contraseña de) el usuario administrador inicial
// usando la Service Role Key de Supabase. No usar en el navegador.
//
// Uso:
//   ADMIN_EMAIL="tu@email.com" ADMIN_PASSWORD="tu-clave" node scripts/create-admin.mjs
//
// Lee NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY desde .env.local

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

function loadEnvLocal() {
  const envPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    ".env.local"
  );
  try {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key && !process.env[key]) {
        process.env[key] = rest.join("=").trim();
      }
    }
  } catch {
    // .env.local no encontrado, se asume que las vars ya están en el entorno
  }
}

loadEnvLocal();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!SUPABASE_URL || SUPABASE_URL.includes("PENDIENTE")) {
  console.error(
    "Falta configurar NEXT_PUBLIC_SUPABASE_URL en .env.local"
  );
  process.exit(1);
}

if (!SERVICE_ROLE_KEY || SERVICE_ROLE_KEY.includes("PENDIENTE")) {
  console.error(
    "Falta configurar SUPABASE_SERVICE_ROLE_KEY en .env.local (Project Settings → API en Supabase)"
  );
  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    'Falta ADMIN_EMAIL / ADMIN_PASSWORD.\nEjemplo: ADMIN_EMAIL="tu@email.com" ADMIN_PASSWORD="tu-clave" node scripts/create-admin.mjs'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: existing } = await supabase.auth.admin.listUsers();
const found = existing?.users?.find((u) => u.email === ADMIN_EMAIL);

if (found) {
  const { error } = await supabase.auth.admin.updateUserById(found.id, {
    password: ADMIN_PASSWORD,
  });
  if (error) {
    console.error("Error actualizando contraseña:", error.message);
    process.exit(1);
  }
  console.log(`Contraseña actualizada para ${ADMIN_EMAIL}.`);
} else {
  const { error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  });
  if (error) {
    console.error("Error creando usuario admin:", error.message);
    process.exit(1);
  }
  console.log(`Usuario admin creado: ${ADMIN_EMAIL}`);
}

console.log("Listo. Ya puedes iniciar sesión en /admin/login");
