# Titan's Gym

Plataforma web para Titan's Gym (La Libertad, Santa Elena, Ecuador): landing page de alta conversión + panel administrativo. Construido con Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion y Supabase.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (Base UI)
- **Framer Motion** — animaciones
- **Supabase** — Auth, Postgres, Storage
- **React Hook Form** + **Zod** — formularios y validación
- **Recharts** — gráficos del dashboard admin

## Arquitectura

```
app/
  (site)/            Sitio público (navbar + footer + WhatsApp flotante)
    page.tsx          Home: hero, stats, beneficios, promo, planes, galería, IMC, testimonios, ubicación, contacto
    planes/            Página completa de planes y clases especializadas
    galeria/           Galería completa con filtros por categoría
  admin/
    (auth)/login/      Login del panel admin (sin sidebar)
    (dashboard)/       Panel admin protegido (con sidebar)
      page.tsx          Dashboard con KPIs y gráficos
      leads/             Gestión de leads (CRUD, filtros, búsqueda)
      promociones/       Gestión de promociones (CRUD + imágenes)
      contenido/         Horarios, galería, testimonios, mensajes, config. del sitio
  sitemap.ts / robots.ts / opengraph-image.tsx

components/
  site/               Componentes del sitio público
  admin/              Componentes del panel admin
  ui/                 Componentes shadcn/ui

lib/
  actions/            Server Actions (formularios públicos + CRUD admin)
  data/               Queries a Supabase (con fallback estático en el sitio público) + datos estáticos de planes
  supabase/           Clientes de Supabase (browser, server, middleware)
  types/database.ts   Tipos TypeScript del esquema de Supabase
  validations/        Esquemas Zod

supabase/
  migrations/         SQL de creación de tablas, RLS y Storage
  seed.sql            Datos iniciales (horarios, config, promo, galería)
  README.md           Guía paso a paso de Supabase

design-system/        Sistema de diseño generado con la skill ui-ux-pro-max (paleta, tipografía, componentes)
```

## Primeros pasos

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

Sigue **[supabase/README.md](supabase/README.md)** paso a paso:
1. Crear proyecto en Supabase
2. Copiar credenciales a `.env.local`
3. Ejecutar las migraciones (`supabase/migrations/*.sql`) y el seed (`supabase/seed.sql`)
4. Crear el usuario administrador con `scripts/create-admin.mjs`

Mientras `.env.local` tenga los valores `PENDIENTE_REEMPLAZAR`, el sitio público funciona igual (usa datos estáticos de respaldo en `lib/data/site-config.ts`), pero el panel `/admin` mostrará un aviso de "Supabase no configurado" hasta completar este paso.

### 3. Levantar el entorno de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### 4. Build de producción

```bash
npm run build
npm run start
```

## Variables de entorno

Ver `.env.local.example`. Configúralas también en Vercel (Project Settings → Environment Variables) antes de desplegar.

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública (anon) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo para `scripts/create-admin.mjs`, nunca se expone al cliente) |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (usada en SEO: sitemap, OG, metadata) |

## Despliegue en Vercel

1. Sube el proyecto a un repositorio Git (GitHub/GitLab/Bitbucket) o despliega directo desde local con `vercel` CLI.
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio (framework detectado automáticamente: Next.js).
3. Agrega las variables de entorno de `.env.local` en la configuración del proyecto en Vercel.
4. Despliega. Vercel ejecuta `npm run build` automáticamente.
5. Actualiza `NEXT_PUBLIC_SITE_URL` con el dominio final de Vercel (o tu dominio propio) y vuelve a desplegar para que el sitemap/OG/SEO usen la URL correcta.

### Dominio propio

En Vercel → Project Settings → Domains, agrega tu dominio y sigue las instrucciones DNS. Recuerda actualizar `NEXT_PUBLIC_SITE_URL`.

### Transferir el proyecto a otra cuenta de Vercel

Project Settings → General → **Transfer Project**. La cuenta destino debe aceptar la transferencia; los dominios conectados se transfieren junto con el proyecto.

## Panel administrativo

- URL: `/admin/login`
- Un solo rol de administrador (sin niveles de permisos)
- Módulos: Dashboard (KPIs + gráficos), Leads, Promociones, Contenido (horarios, galería, testimonios, mensajes de contacto, configuración general del sitio)
- Las imágenes que subas desde el panel (galería, promociones, testimonios) se guardan en el bucket público `site-media` de Supabase Storage

## Notas de diseño

El sistema de diseño (paleta negro/rojo/plata, tipografía Barlow Condensed + Barlow, componentes) está documentado en `design-system/titan's-gym/MASTER.md`, generado y ajustado con la skill `ui-ux-pro-max` para coincidir con la identidad de marca ya existente (logo, tarjeta de fidelidad, flyers promocionales).
