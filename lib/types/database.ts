export type LeadEstado = "nuevo" | "contactado" | "convertido" | "descartado";
export type NivelActividad = "sedentario" | "levemente_activo" | "moderadamente_activo" | "muy_activo";
export type PreferenciaAlimentaria = "omnivoro" | "vegetariano" | "vegano" | "otro";
export type ObjetivoNutricional = "perdida_peso" | "ganancia_muscular" | "mantenimiento" | "medico";
export type MetodoPago = "efectivo" | "transferencia" | "tarjeta" | "otro";
export type CategoriaMem = "general" | "especial" | "clase";
export type PeriodoMem = "mes" | "quincena" | "trimestre" | "anual";
export type GaleriaCategoria = "instalaciones" | "entrenamiento" | "clases";
export type DiaSemana =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";

// Nota: se usan `type` (no `interface`) a propósito. TypeScript no
// considera que una `interface` satisfaga `extends Record<string, unknown>`
// en checks estructurales, lo cual rompe la inferencia de tipos de
// postgrest-js (`GenericTable`/`GenericSchema`) en .insert()/.update().

export type UsuarioAdmin = {
  id: string;
  nombre: string;
  email: string;
  rol: "admin" | "staff";
  created_at: string;
};

export type Lead = {
  id: string;
  nombre: string;
  telefono: string;
  email: string | null;
  plan_interes: string | null;
  mensaje: string | null;
  origen: string;
  estado: LeadEstado;
  notas: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactoMensaje = {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  mensaje: string;
  leido: boolean;
  created_at: string;
};

export type Promocion = {
  id: string;
  titulo: string;
  descripcion: string | null;
  imagen_url: string | null;
  descuento: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  activa: boolean;
  orden: number;
  created_at: string;
  updated_at: string;
};

export type Testimonio = {
  id: string;
  nombre_cliente: string;
  texto: string;
  calificacion: number;
  foto_url: string | null;
  activo: boolean;
  orden: number;
  created_at: string;
};

export type GaleriaItem = {
  id: string;
  titulo: string;
  imagen_url: string;
  categoria: GaleriaCategoria;
  orden: number;
  activo: boolean;
  created_at: string;
};

export type Horario = {
  id: string;
  dia: DiaSemana;
  abre: string | null;
  cierra: string | null;
  cerrado: boolean;
  orden: number;
};

export type ConfiguracionSitio = {
  id: number;
  nombre_gym: string;
  telefono_whatsapp: string;
  email_contacto: string;
  direccion: string;
  ciudad: string;
  google_maps_url: string | null;
  latitud: number | null;
  longitud: number | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  hero_titulo: string;
  hero_subtitulo: string;
  updated_at: string;
};

export type Visita = {
  id: string;
  pagina: string;
  referrer: string | null;
  created_at: string;
};

export type Cliente = {
  id: string;
  nombre: string;
  fecha_nacimiento: string | null;
  sexo: "masculino" | "femenino" | "otro" | null;
  correo: string | null;
  telefono: string | null;
  peso: number | null;
  talla: number | null;
  porcentaje_grasa: number | null;
  masa_muscular: number | null;
  grasa_visceral: number | null;
  circunferencia_cintura: number | null;
  circunferencia_cadera: number | null;
  patologias: string[] | null;
  alergias: string[] | null;
  medicamentos: string | null;
  nivel_actividad: NivelActividad | null;
  preferencia_alimentaria: PreferenciaAlimentaria | null;
  objetivo_nutricional: ObjetivoNutricional | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
};

export type MedicionCliente = {
  id: string;
  cliente_id: string;
  fecha: string;
  peso: number | null;
  porcentaje_grasa: number | null;
  masa_muscular: number | null;
  grasa_visceral: number | null;
  circunferencia_cintura: number | null;
  circunferencia_cadera: number | null;
  created_at: string;
};

export type NotaCliente = {
  id: string;
  cliente_id: string;
  nota: string;
  created_at: string;
};

export type CuentaBancaria = {
  id: string;
  banco: string;
  titular: string;
  numero_cuenta: string;
  tipo_cuenta: "ahorros" | "corriente" | null;
  moneda: string;
  es_principal: boolean;
  activa: boolean;
  created_at: string;
};

export type Pago = {
  id: string;
  cliente_id: string | null;
  nombre_cliente: string;
  monto: number;
  fecha: string;
  metodo_pago: MetodoPago | null;
  membresia: string | null;
  notas: string | null;
  cuenta_bancaria_id: string | null;
  created_at: string;
};

export type Membresia = {
  id: string;
  nombre: string;
  precio: number;
  periodo: PeriodoMem;
  descripcion: string | null;
  beneficios: string[] | null;
  categoria: CategoriaMem;
  activa: boolean;
  visible_en_sitio: boolean;
  orden: number;
  destacado: boolean;
  es_clase: boolean;
  horarios: string[] | null;
  imagen_url: string | null;
  precio_diario: number | null;
  requisito: string | null;
  created_at: string;
  updated_at: string;
};

// postgrest-js exige que cada tabla incluya `Relationships` y que el
// esquema declare `Tables`, `Views` y `Functions` para poder inferir bien
// los tipos de `.from(...).select()/.insert()/.update()`.
type Table<Row, Insert> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      usuarios_admin: Table<
        UsuarioAdmin,
        Partial<UsuarioAdmin> & { id: string; nombre: string; email: string }
      >;
      leads: Table<Lead, Partial<Lead> & { nombre: string; telefono: string }>;
      contacto: Table<
        ContactoMensaje,
        Partial<ContactoMensaje> & {
          nombre: string;
          telefono: string;
          email: string;
          mensaje: string;
        }
      >;
      promociones: Table<Promocion, Partial<Promocion> & { titulo: string }>;
      testimonios: Table<
        Testimonio,
        Partial<Testimonio> & { nombre_cliente: string; texto: string }
      >;
      galeria: Table<
        GaleriaItem,
        Partial<GaleriaItem> & { titulo: string; imagen_url: string }
      >;
      horarios: Table<Horario, Partial<Horario> & { dia: DiaSemana }>;
      configuracion_sitio: Table<
        ConfiguracionSitio,
        Partial<ConfiguracionSitio> & {
          telefono_whatsapp: string;
          email_contacto: string;
          direccion: string;
        }
      >;
      visitas: Table<Visita, Partial<Visita> & { pagina: string }>;
      clientes: Table<Cliente, Partial<Cliente> & { nombre: string }>;
      mediciones_cliente: Table<MedicionCliente, Partial<MedicionCliente> & { cliente_id: string }>;
      notas_cliente: Table<NotaCliente, Partial<NotaCliente> & { cliente_id: string; nota: string }>;
      cuentas_bancarias: Table<CuentaBancaria, Partial<CuentaBancaria> & { banco: string; titular: string; numero_cuenta: string }>;
      pagos: Table<Pago, Partial<Pago> & { nombre_cliente: string; monto: number }>;
      membresias: Table<Membresia, Partial<Membresia> & { nombre: string; precio: number }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
