# Supabase — Titan's Gym

## 1. Crear el proyecto

1. Ve a [supabase.com](https://supabase.com) → **New project** (usa tu cuenta).
2. Guarda la contraseña de la base de datos en un lugar seguro.
3. Cuando el proyecto esté listo, ve a **Project Settings → API** y copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (¡secreta, nunca la expongas en el cliente!)
4. Pega esos valores en `.env.local` (en la raíz del proyecto).

## 2. Ejecutar las migraciones

**Opción A — SQL Editor (más simple, sin instalar nada):**

En el dashboard de Supabase → **SQL Editor**, ejecuta en este orden:
1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_rls.sql`
3. `supabase/migrations/0003_storage.sql`
4. `supabase/seed.sql`

**Opción B — Supabase CLI:**

```bash
npm install -g supabase
supabase login
supabase link --project-ref TU_PROJECT_REF
supabase db push
psql "$(supabase db remote-commit-url 2>/dev/null)" -f supabase/seed.sql # o pega seed.sql en el SQL Editor
```

## 3. Crear el usuario administrador

Por seguridad, Supabase no permite crear usuarios de Auth directamente por SQL.
Usa el script incluido (usa la Service Role Key, nunca se commitea):

```bash
ADMIN_EMAIL="franco.bracamonte24@gmail.com" ADMIN_PASSWORD="tu-clave-elegida" node scripts/create-admin.mjs
```

Esto crea (o actualiza la contraseña de) el usuario y, gracias al trigger
`on_auth_user_created`, se crea automáticamente su fila en `usuarios_admin`.

> Cambia la contraseña desde el dashboard de Supabase (Authentication → Users)
> en cualquier momento, o vuelve a correr el script con una nueva.

## 4. Storage

La migración `0003_storage.sql` crea el bucket público `site-media` con
políticas para que cualquiera pueda leer, pero solo el admin autenticado
pueda subir/editar/borrar. Las fotos iniciales del sitio (galería, logo,
promociones) viven en `/public/images` del proyecto Next.js — el bucket es
para contenido nuevo que subas después desde el panel `/admin`.

## 5. Variables de entorno en Vercel

Al desplegar, agrega las mismas variables de `.env.local` en
**Vercel → Project Settings → Environment Variables**.
