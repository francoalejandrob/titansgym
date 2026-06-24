-- Titan's Gym — Datos iniciales
-- Ejecutar después de las migraciones (0001_init.sql, 0002_rls.sql).
-- El usuario administrador NO se crea aquí (Supabase Auth no permite
-- insertar directamente en auth.users de forma segura por SQL).
-- Ver supabase/README.md para crear el admin inicial.

-- ---------------------------------------------------------
-- configuracion_sitio (fila única)
-- ---------------------------------------------------------
insert into public.configuracion_sitio (
  id, nombre_gym, telefono_whatsapp, email_contacto, direccion, ciudad,
  google_maps_url, latitud, longitud, instagram_url,
  hero_titulo, hero_subtitulo
) values (
  1,
  'Titan''s Gym',
  '+593963662370',
  'rosalespitac@gmail.com',
  'Av. Eleodoro Solórzano y Calle 48',
  'La Libertad, Santa Elena, Ecuador',
  'https://www.google.com/maps/place/TITAN%C2%B4S+GYM/@-2.230826,-80.8843887,721m/data=!3m2!1e3!4b1!4m6!3m5!1s0x902e097daab780af:0x7794a5de5c3dbec7!8m2!3d-2.230826!4d-80.8843887!16s%2Fg%2F11ybxdl3nh',
  -2.230826,
  -80.8843887,
  'https://instagram.com/titansgymec',
  'DESPIERTA AL TITÁN QUE LLEVAS DENTRO',
  'Entrena con constancia. Vive como un titán.'
)
on conflict (id) do update set
  telefono_whatsapp = excluded.telefono_whatsapp,
  email_contacto = excluded.email_contacto,
  direccion = excluded.direccion,
  ciudad = excluded.ciudad,
  google_maps_url = excluded.google_maps_url,
  latitud = excluded.latitud,
  longitud = excluded.longitud,
  instagram_url = excluded.instagram_url;

-- ---------------------------------------------------------
-- horarios
-- ---------------------------------------------------------
insert into public.horarios (dia, abre, cierra, cerrado, orden) values
  ('lunes', '06:00', '21:00', false, 1),
  ('martes', '06:00', '21:00', false, 2),
  ('miercoles', '06:00', '21:00', false, 3),
  ('jueves', '06:00', '21:00', false, 4),
  ('viernes', '06:00', '21:00', false, 5),
  ('sabado', '06:00', '17:00', false, 6),
  ('domingo', null, null, true, 7)
on conflict (dia) do update set
  abre = excluded.abre,
  cierra = excluded.cierra,
  cerrado = excluded.cerrado,
  orden = excluded.orden;

-- ---------------------------------------------------------
-- promociones — la tarjeta de fidelidad como promo destacada
-- ---------------------------------------------------------
insert into public.promociones (titulo, descripcion, imagen_url, descuento, activa, orden) values
  (
    'Tarjeta de Fidelidad',
    'Tu constancia tiene recompensa: acumula 5 renovaciones de membresía y la 6ta es completamente gratis.',
    '/images/promo/tarjeta-fidelidad.jpg',
    '6ta renovación GRATIS',
    true,
    1
  );

-- ---------------------------------------------------------
-- galeria — fotos de instalaciones y equipos ya disponibles
-- ---------------------------------------------------------
insert into public.galeria (titulo, imagen_url, categoria, orden) values
  ('Zona de pesas libres', '/images/gallery/banco-pesas.jpg', 'instalaciones', 1),
  ('Bicicletas elípticas', '/images/gallery/bicicletas-elipticas.jpg', 'instalaciones', 2),
  ('Caminadoras', '/images/gallery/caminadora.jpg', 'instalaciones', 3),
  ('Extensión de cuádriceps', '/images/gallery/extension-cuadriceps.jpg', 'instalaciones', 4),
  ('Femoral acostado', '/images/gallery/femoral-acostado.jpg', 'instalaciones', 5),
  ('Peso muerto asistido', '/images/gallery/peso-muerto-asistido.jpg', 'entrenamiento', 6),
  ('Polea variada', '/images/gallery/polea-variada.jpg', 'instalaciones', 7),
  ('Estación de polea', '/images/gallery/polea.jpg', 'instalaciones', 8),
  ('Prensa de piernas', '/images/gallery/prensa.jpg', 'instalaciones', 9),
  ('Press asistido', '/images/gallery/press-asistido.jpg', 'instalaciones', 10),
  ('Press de banca', '/images/gallery/press-banca.jpg', 'entrenamiento', 11),
  ('Sentadilla libre', '/images/gallery/sentadilla-libre.jpg', 'entrenamiento', 12),
  ('Barra de café', '/images/gallery/cafe-bar.jpg', 'instalaciones', 13)
on conflict do nothing;

-- ---------------------------------------------------------
-- testimonios — placeholders editables desde el panel admin
-- ---------------------------------------------------------
insert into public.testimonios (nombre_cliente, texto, calificacion, activo, orden) values
  ('Cliente de Titan''s Gym', 'Edita este testimonio desde el panel admin con la opinión real de tus clientes.', 5, true, 1),
  ('Cliente de Titan''s Gym', 'Edita este testimonio desde el panel admin con la opinión real de tus clientes.', 5, true, 2),
  ('Cliente de Titan''s Gym', 'Edita este testimonio desde el panel admin con la opinión real de tus clientes.', 5, true, 3)
on conflict do nothing;
