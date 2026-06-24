export interface Plan {
  id: string;
  nombre: string;
  precio: number;
  periodo: "mes" | "quincena";
  requisito?: string;
  horario?: string;
  destacado?: boolean;
  diario?: number;
}

export interface ClasePlan extends Plan {
  horarios: string[];
  imagen: string;
  descripcion: string;
}

// Membresías generales del gimnasio
export const planesGenerales: Plan[] = [
  {
    id: "regular",
    nombre: "Regular",
    precio: 25,
    periodo: "mes",
    destacado: true,
  },
  {
    id: "ejecutivo",
    nombre: "Modelo Ejecutivo",
    precio: 20,
    periodo: "mes",
    horario: "6:00am a 10:00am",
  },
  {
    id: "universitario",
    nombre: "Modelo Universitario",
    precio: 22,
    periodo: "mes",
    requisito: "Presentar carnet estudiantil actualizado",
  },
  {
    id: "estudiantil",
    nombre: "Modelo Estudiantil",
    precio: 18,
    periodo: "mes",
    requisito: "Presentar carnet estudiantil actualizado",
  },
];

// Membresías sociales / especiales
export const planesEspeciales: Plan[] = [
  {
    id: "discapacidad",
    nombre: "Personas con Discapacidad",
    precio: 15,
    periodo: "mes",
    requisito: "Presentar carnet de discapacidad",
  },
  {
    id: "tercera-edad",
    nombre: "3ra Edad",
    precio: 15,
    periodo: "mes",
    requisito: "Presentar cédula",
  },
  {
    id: "quincena-exclusiva",
    nombre: "Quincena Exclusiva",
    precio: 17,
    periodo: "quincena",
    requisito: "Válida por 15 días dentro del mes",
  },
];

// Clases especializadas
export const clasesEspeciales: ClasePlan[] = [
  {
    id: "titan-dance",
    nombre: "Titan Dance",
    precio: 29.99,
    periodo: "mes",
    diario: 1.5,
    horarios: [
      "Lunes, Miércoles y Viernes",
      "7:00am - 8:00am",
      "18:00pm - 19:00pm",
    ],
    imagen: "/images/promo/titandance.jpeg",
    descripcion: "Baile fitness de alta energía para quemar calorías al ritmo de la música.",
  },
  {
    id: "titan-power",
    nombre: "Titan Power",
    precio: 34.99,
    periodo: "mes",
    horarios: ["Lunes, Martes y Viernes", "13:00 - 15:00pm"],
    imagen: "/images/promo/titan-power.jpg",
    descripcion: "Entrenamiento de fuerza y powerlifting guiado para llevar tu potencia al máximo.",
  },
  {
    id: "fit-fight",
    nombre: "Fit & Fight (Taekwondo)",
    precio: 29.99,
    periodo: "mes",
    horarios: ["Martes y Jueves: 15:00 - 16:00", "Viernes"],
    imagen: "/images/promo/taekwondo.jpg",
    descripcion:
      "Clases de Taekwondo con guía de alimentación, guía de entrenamiento, control de peso mensual y acceso ilimitado a máquinas.",
  },
];
