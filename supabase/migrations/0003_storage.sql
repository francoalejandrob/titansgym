-- Titan's Gym — Storage bucket para imágenes subidas desde el panel admin
-- (galería, promociones, testimonios). Las fotos estáticas iniciales viven
-- en /public/images del proyecto Next.js; este bucket es para contenido
-- nuevo que el admin suba después del lanzamiento.

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

create policy "lectura publica de site-media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-media');

create policy "admin sube a site-media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-media');

create policy "admin actualiza site-media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-media');

create policy "admin elimina site-media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-media');
