// Datos de demostración que complementan cada propiedad mientras no se capturen en Sanity.
// Si la propiedad trae el campo en Sanity, ese valor manda (ver lib/queries.ts).

import type { EstadoPropiedad } from "./properties";

export interface ExtrasPropiedad {
  asesor: string;
  estado?: EstadoPropiedad;
  precioAnterior?: number;
  tourUrl?: string;
}

// Tour 360 de muestra (Kuula). Sirve para enseñar la función; en producción va el tour real de cada inmueble.
const TOUR_DEMO = "https://kuula.co/share/collection/7fzdM?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1";

export const extras: Record<string, ExtrasPropiedad> = {
  "casa-residencial-las-lomas": {
    asesor: "laura-mendez",
    estado: "nueva",
    tourUrl: TOUR_DEMO,
  },
  "departamento-centro-historico": {
    asesor: "sofia-cardenas",
    estado: "rebajada",
    precioAnterior: 20000,
  },
  "terreno-comercial-zona-industrial": { asesor: "andres-villalobos" },
  "local-comercial-plaza-morelos": { asesor: "andres-villalobos", estado: "apartada" },
  "oficinas-corporativo-la-huerta": { asesor: "sofia-cardenas" },
  "bodega-industrial-libramiento": { asesor: "andres-villalobos", estado: "rebajada", precioAnterior: 8400000 },
};

/** Asesor por defecto según el tipo de inmueble, para propiedades nuevas sin asignar */
export function asesorPorDefecto(categoria: string, operacion: string): string {
  if (["Terreno", "Bodega", "Local"].includes(categoria)) return "andres-villalobos";
  if (operacion === "renta") return "sofia-cardenas";
  return "laura-mendez";
}
