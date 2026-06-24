-- =====================================================
-- TITANSGYM — Migration para nuevas funcionalidades
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. TRACKER DE VISITAS
CREATE TABLE IF NOT EXISTS visitas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pagina TEXT NOT NULL DEFAULT '/',
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CLIENTES (Perfiles Nutricionales)
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  fecha_nacimiento DATE,
  sexo TEXT CHECK (sexo IN ('masculino','femenino','otro')),
  correo TEXT,
  telefono TEXT,
  peso DECIMAL(5,2),
  talla DECIMAL(5,2),
  porcentaje_grasa DECIMAL(5,2),
  masa_muscular DECIMAL(5,2),
  grasa_visceral DECIMAL(5,2),
  circunferencia_cintura DECIMAL(5,2),
  circunferencia_cadera DECIMAL(5,2),
  patologias TEXT[],
  alergias TEXT[],
  medicamentos TEXT,
  nivel_actividad TEXT CHECK (nivel_actividad IN ('sedentario','levemente_activo','moderadamente_activo','muy_activo')),
  preferencia_alimentaria TEXT CHECK (preferencia_alimentaria IN ('omnivoro','vegetariano','vegano','otro')),
  objetivo_nutricional TEXT CHECK (objetivo_nutricional IN ('perdida_peso','ganancia_muscular','mantenimiento','medico')),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HISTORIAL DE MEDICIONES
CREATE TABLE IF NOT EXISTS mediciones_cliente (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  fecha DATE DEFAULT CURRENT_DATE,
  peso DECIMAL(5,2),
  porcentaje_grasa DECIMAL(5,2),
  masa_muscular DECIMAL(5,2),
  grasa_visceral DECIMAL(5,2),
  circunferencia_cintura DECIMAL(5,2),
  circunferencia_cadera DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. NOTAS DE SEGUIMIENTO
CREATE TABLE IF NOT EXISTS notas_cliente (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  nota TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CUENTAS BANCARIAS
CREATE TABLE IF NOT EXISTS cuentas_bancarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banco TEXT NOT NULL,
  titular TEXT NOT NULL,
  numero_cuenta TEXT NOT NULL,
  tipo_cuenta TEXT CHECK (tipo_cuenta IN ('ahorros','corriente')),
  moneda TEXT DEFAULT 'USD',
  es_principal BOOLEAN DEFAULT FALSE,
  activa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REGISTROS DE PAGO
CREATE TABLE IF NOT EXISTS pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  nombre_cliente TEXT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  fecha DATE DEFAULT CURRENT_DATE,
  metodo_pago TEXT CHECK (metodo_pago IN ('efectivo','transferencia','tarjeta','otro')),
  membresia TEXT,
  notas TEXT,
  cuenta_bancaria_id UUID REFERENCES cuentas_bancarias(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MEMBRESÍAS DINÁMICAS (reemplaza datos hardcodeados)
CREATE TABLE IF NOT EXISTS membresias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  periodo TEXT CHECK (periodo IN ('mes','quincena','trimestre','anual')) DEFAULT 'mes',
  descripcion TEXT,
  beneficios TEXT[],
  categoria TEXT CHECK (categoria IN ('general','especial','clase')) DEFAULT 'general',
  activa BOOLEAN DEFAULT TRUE,
  visible_en_sitio BOOLEAN DEFAULT TRUE,
  orden INTEGER DEFAULT 0,
  destacado BOOLEAN DEFAULT FALSE,
  es_clase BOOLEAN DEFAULT FALSE,
  horarios TEXT[],
  imagen_url TEXT,
  precio_diario DECIMAL(10,2),
  requisito TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SEED: Membresías desde datos existentes
INSERT INTO membresias (nombre, precio, periodo, categoria, activa, visible_en_sitio, orden, destacado) VALUES
  ('Regular', 25, 'mes', 'general', true, true, 0, true),
  ('Modelo Ejecutivo', 20, 'mes', 'general', true, true, 1, false),
  ('Modelo Universitario', 22, 'mes', 'general', true, true, 2, false),
  ('Modelo Estudiantil', 18, 'mes', 'general', true, true, 3, false)
ON CONFLICT DO NOTHING;

INSERT INTO membresias (nombre, precio, periodo, categoria, activa, visible_en_sitio, orden, requisito) VALUES
  ('Personas con Discapacidad', 15, 'mes', 'especial', true, true, 10, 'Presentar carnet de discapacidad'),
  ('3ra Edad', 15, 'mes', 'especial', true, true, 11, 'Presentar cédula'),
  ('Quincena Exclusiva', 17, 'quincena', 'especial', true, true, 12, 'Válida por 15 días dentro del mes')
ON CONFLICT DO NOTHING;

INSERT INTO membresias (nombre, precio, periodo, categoria, activa, visible_en_sitio, orden, es_clase, precio_diario, horarios, imagen_url, descripcion) VALUES
  ('Titan Dance', 29.99, 'mes', 'clase', true, true, 20, true, 1.5,
   ARRAY['Lunes, Miércoles y Viernes', '7:00am - 8:00am', '18:00pm - 19:00pm'],
   '/images/promo/titandance.jpeg',
   'Baile fitness de alta energía para quemar calorías al ritmo de la música.'),
  ('Titan Power', 34.99, 'mes', 'clase', true, true, 21, true, null,
   ARRAY['Lunes, Martes y Viernes', '13:00 - 15:00pm'],
   '/images/promo/titan-power.jpg',
   'Entrenamiento de fuerza y powerlifting guiado para llevar tu potencia al máximo.'),
  ('Fit & Fight (Taekwondo)', 29.99, 'mes', 'clase', true, true, 22, true, null,
   ARRAY['Martes y Jueves: 15:00 - 16:00', 'Viernes'],
   '/images/promo/taekwondo.jpg',
   'Clases de Taekwondo con guía de alimentación, control de peso mensual y acceso ilimitado a máquinas.')
ON CONFLICT DO NOTHING;

-- 9. RLS: habilitar Row Level Security (seguridad básica)
ALTER TABLE visitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mediciones_cliente ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas_cliente ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuentas_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE membresias ENABLE ROW LEVEL SECURITY;

-- Políticas para visitas (inserción pública, lectura solo auth)
CREATE POLICY "visitas_insert" ON visitas FOR INSERT WITH CHECK (true);
CREATE POLICY "visitas_select_auth" ON visitas FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas para membresias (lectura pública, escritura solo auth)
CREATE POLICY "membresias_select_all" ON membresias FOR SELECT USING (true);
CREATE POLICY "membresias_write_auth" ON membresias FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para clientes, pagos, cuentas_bancarias (solo auth)
CREATE POLICY "clientes_all_auth" ON clientes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "mediciones_all_auth" ON mediciones_cliente FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "notas_all_auth" ON notas_cliente FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "cuentas_all_auth" ON cuentas_bancarias FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "pagos_all_auth" ON pagos FOR ALL USING (auth.role() = 'authenticated');
