// Asesores de Arraigo. Datos ficticios de demostración (nombres, teléfonos y correos no son reales).
// Cada propiedad tiene un asesor asignado (lib/extras.ts o el campo "asesor" en Sanity).

export interface Asesor {
  slug: string;
  nombre: string;
  /** Iniciales para el avatar (no usamos fotos de personas reales) */
  iniciales: string;
  rol: string;
  especialidad: string;
  /** Solo dígitos, con lada internacional, para wa.me y tel: */
  telefono: string;
  telefonoVisible: string;
  correo: string;
  bio: string;
  zonas: string[];
}

export const asesores: Asesor[] = [
  {
    slug: "laura-mendez",
    nombre: "Laura Méndez",
    iniciales: "LM",
    rol: "Asesora residencial",
    especialidad: "Casas y departamentos",
    telefono: "524520000001",
    telefonoVisible: "(452) 000 0001",
    correo: "laura@arraigo.example",
    bio: "Acompaña a familias que compran su primera casa: crédito, visitas y revisión de papeles hasta la notaría.",
    zonas: ["Fracc. Las Lomas", "Centro Histórico"],
  },
  {
    slug: "andres-villalobos",
    nombre: "Andrés Villalobos",
    iniciales: "AV",
    rol: "Asesor comercial e industrial",
    especialidad: "Terrenos, bodegas y locales",
    telefono: "524520000002",
    telefonoVisible: "(452) 000 0002",
    correo: "andres@arraigo.example",
    bio: "Trabaja con inversionistas y empresas: uso de suelo, accesos y plusvalía antes de cerrar una compra o una renta.",
    zonas: ["Zona Industrial", "Libramiento Oriente", "Av. Morelos"],
  },
  {
    slug: "sofia-cardenas",
    nombre: "Sofía Cárdenas",
    iniciales: "SC",
    rol: "Asesora de rentas",
    especialidad: "Renta y administración",
    telefono: "524520000003",
    telefonoVisible: "(452) 000 0003",
    correo: "sofia@arraigo.example",
    bio: "Coloca y administra propiedades en renta: perfil del inquilino, contrato y seguimiento mes a mes.",
    zonas: ["La Huerta", "Centro Histórico", "Av. Morelos"],
  },
];

export function getAsesor(slug?: string): Asesor | undefined {
  return asesores.find((a) => a.slug === slug);
}

/** Enlace de WhatsApp al asesor con un mensaje ya escrito */
export function whatsappAsesor(a: Asesor, mensaje: string) {
  return `https://wa.me/${a.telefono}?text=${encodeURIComponent(mensaje)}`;
}
