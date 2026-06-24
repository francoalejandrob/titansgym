-- Titan's Gym — Row Level Security
-- Modelo: no hay registro público de usuarios. El único rol autenticado
-- posible en este proyecto es el administrador, por lo que
-- `auth.role() = 'authenticated'` equivale a "es admin".

alter table public.usuarios_admin enable row level security;
alter table public.leads enable row level security;
alter table public.contacto enable row level security;
alter table public.promociones enable row level security;
alter table public.testimonios enable row level security;
alter table public.galeria enable row level security;
alter table public.horarios enable row level security;
alter table public.configuracion_sitio enable row level security;

-- ---------------------------------------------------------
-- usuarios_admin: cada admin solo ve/edita su propio perfil
-- ---------------------------------------------------------
create policy "admin lee su propio perfil"
  on public.usuarios_admin for select
  using (auth.uid() = id);

create policy "admin actualiza su propio perfil"
  on public.usuarios_admin for update
  using (auth.uid() = id);

-- ---------------------------------------------------------
-- leads: cualquiera puede crear (formularios públicos),
-- solo el admin autenticado puede leer/editar/borrar
-- ---------------------------------------------------------
create policy "publico crea leads"
  on public.leads for insert
  to anon, authenticated
  with check (true);

create policy "admin gestiona leads"
  on public.leads for select
  to authenticated
  using (true);

create policy "admin actualiza leads"
  on public.leads for update
  to authenticated
  using (true);

create policy "admin elimina leads"
  on public.leads for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------
-- contacto: igual que leads
-- ---------------------------------------------------------
create policy "publico crea mensajes de contacto"
  on public.contacto for insert
  to anon, authenticated
  with check (true);

create policy "admin gestiona contacto"
  on public.contacto for select
  to authenticated
  using (true);

create policy "admin actualiza contacto"
  on public.contacto for update
  to authenticated
  using (true);

create policy "admin elimina contacto"
  on public.contacto for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------
-- promociones: lectura pública solo de activas, gestión admin
-- ---------------------------------------------------------
create policy "publico lee promociones activas"
  on public.promociones for select
  to anon, authenticated
  using (activa = true or auth.role() = 'authenticated');

create policy "admin crea promociones"
  on public.promociones for insert
  to authenticated
  with check (true);

create policy "admin actualiza promociones"
  on public.promociones for update
  to authenticated
  using (true);

create policy "admin elimina promociones"
  on public.promociones for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------
-- testimonios: lectura pública solo de activos, gestión admin
-- ---------------------------------------------------------
create policy "publico lee testimonios activos"
  on public.testimonios for select
  to anon, authenticated
  using (activo = true or auth.role() = 'authenticated');

create policy "admin crea testimonios"
  on public.testimonios for insert
  to authenticated
  with check (true);

create policy "admin actualiza testimonios"
  on public.testimonios for update
  to authenticated
  using (true);

create policy "admin elimina testimonios"
  on public.testimonios for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------
-- galeria: lectura pública solo de activas, gestión admin
-- ---------------------------------------------------------
create policy "publico lee galeria activa"
  on public.galeria for select
  to anon, authenticated
  using (activo = true or auth.role() = 'authenticated');

create policy "admin crea galeria"
  on public.galeria for insert
  to authenticated
  with check (true);

create policy "admin actualiza galeria"
  on public.galeria for update
  to authenticated
  using (true);

create policy "admin elimina galeria"
  on public.galeria for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------
-- horarios: lectura pública total, gestión admin
-- ---------------------------------------------------------
create policy "publico lee horarios"
  on public.horarios for select
  to anon, authenticated
  using (true);

create policy "admin gestiona horarios insert"
  on public.horarios for insert
  to authenticated
  with check (true);

create policy "admin gestiona horarios update"
  on public.horarios for update
  to authenticated
  using (true);

create policy "admin gestiona horarios delete"
  on public.horarios for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------
-- configuracion_sitio: lectura pública total, solo admin edita
-- ---------------------------------------------------------
create policy "publico lee configuracion"
  on public.configuracion_sitio for select
  to anon, authenticated
  using (true);

create policy "admin actualiza configuracion"
  on public.configuracion_sitio for update
  to authenticated
  using (true);

create policy "admin inserta configuracion"
  on public.configuracion_sitio for insert
  to authenticated
  with check (true);
