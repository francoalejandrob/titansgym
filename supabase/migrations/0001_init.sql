-- Titan's Gym — Esquema inicial
-- Convención: snake_case, RLS habilitado en todas las tablas públicas.
-- Único admin (Supabase Auth) gestiona todo el contenido vía panel /admin.

create extension if not exists "pgcrypto";

-- =========================================================
-- usuarios_admin: perfil del/los administradores del panel
-- =========================================================
create table if not exists public.usuarios_admin (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null,
  email text not null,
  rol text not null default 'admin' check (rol in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

-- Crea automáticamente el perfil cuando se registra un usuario en auth.users
create or replace function public.handle_new_admin_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.usuarios_admin (id, nombre, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_admin_user();

-- =========================================================
-- leads: clientes potenciales generados desde CTAs del sitio
-- =========================================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text not null,
  email text,
  plan_interes text,
  mensaje text,
  origen text not null default 'web', -- hero | planes | popup | whatsapp | web
  estado text not null default 'nuevo' check (estado in ('nuevo', 'contactado', 'convertido', 'descartado')),
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- contacto: mensajes enviados desde el formulario de Contacto
-- =========================================================
create table if not exists public.contacto (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text not null,
  email text not null,
  mensaje text not null,
  leido boolean not null default false,
  created_at timestamptz not null default now()
);

-- =========================================================
-- promociones
-- =========================================================
create table if not exists public.promociones (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  imagen_url text,
  descuento text,
  fecha_inicio date,
  fecha_fin date,
  activa boolean not null default true,
  orden int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- testimonios
-- =========================================================
create table if not exists public.testimonios (
  id uuid primary key default gen_random_uuid(),
  nombre_cliente text not null,
  texto text not null,
  calificacion int not null default 5 check (calificacion between 1 and 5),
  foto_url text,
  activo boolean not null default true,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

-- =========================================================
-- galeria
-- =========================================================
create table if not exists public.galeria (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  imagen_url text not null,
  categoria text not null default 'instalaciones' check (categoria in ('instalaciones', 'entrenamiento', 'clases')),
  orden int not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================================================
-- horarios
-- =========================================================
create table if not exists public.horarios (
  id uuid primary key default gen_random_uuid(),
  dia text not null unique check (dia in ('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo')),
  abre time,
  cierra time,
  cerrado boolean not null default false,
  orden int not null default 0
);

-- =========================================================
-- configuracion_sitio: fila única (singleton) con datos globales
-- =========================================================
create table if not exists public.configuracion_sitio (
  id int primary key default 1 check (id = 1),
  nombre_gym text not null default 'Titan''s Gym',
  telefono_whatsapp text not null,
  email_contacto text not null,
  direccion text not null,
  ciudad text not null default 'La Libertad, Santa Elena, Ecuador',
  google_maps_url text,
  latitud double precision,
  longitud double precision,
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  hero_titulo text not null default 'DESPIERTA AL TITÁN QUE LLEVAS DENTRO',
  hero_subtitulo text not null default 'Entrena con constancia. Vive como un titán.',
  updated_at timestamptz not null default now()
);

-- =========================================================
-- Trigger genérico para updated_at
-- =========================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.leads;
create trigger set_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.promociones;
create trigger set_updated_at before update on public.promociones
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.configuracion_sitio;
create trigger set_updated_at before update on public.configuracion_sitio
  for each row execute function public.set_updated_at();

-- =========================================================
-- Índices
-- =========================================================
create index if not exists idx_leads_estado on public.leads (estado);
create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_contacto_leido on public.contacto (leido);
create index if not exists idx_promociones_activa on public.promociones (activa);
create index if not exists idx_testimonios_activo on public.testimonios (activo);
create index if not exists idx_galeria_categoria on public.galeria (categoria);
