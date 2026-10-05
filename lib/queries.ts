import "server-only";
import { client } from "@/sanity/lib/client";
import { propiedadesMock, slugColonia, type Propiedad } from "./properties";
import { asesorPorDefecto } from "./asesores";
import { projectId } from "@/sanity/env";

// Campos GROQ mapeados 1:1 con el tipo Propiedad.
const FIELDS = `
  "slug": slug.current,
  titulo, categoria, operacion, precio, moneda,
  ubicacion, colonia,
  "lat": geo.lat, "lng": geo.lng,
  recamaras, banos, estacionamientos, m2Construccion, m2Terreno,
  destacada, resumen, descripcion, amenidades,
  "imagenes": imagenes[].asset->url,
  asesor, estado, precioAnterior, tourUrl
`;

/**
 * Caché: las consultas no se repiten por tiempo. Se guardan con la etiqueta "propiedad" y se
 * renuevan cuando Sanity avisa al publicar (app/api/revalidate). Como red de seguridad, si el
 * aviso fallara, se renuevan una vez al día con la siguiente visita.
 */
export const ETIQUETA = "propiedad";
const CACHE = { next: { tags: [ETIQUETA], revalidate: 86400 } };

/** Lo que dice Sanity es lo que se muestra. Solo el asesor tiene un valor por omisión. */
function normalize(d: Partial<Propiedad>): Propiedad {
  const base = d as Propiedad;
  return {
    ...base,
    imagenes: (d.imagenes ?? []).filter(Boolean),
    descripcion: d.descripcion ?? [],
    amenidades: d.amenidades ?? [],
    asesor: d.asesor || asesorPorDefecto(base.categoria, base.operacion),
    estado: d.estado || undefined,
    precioAnterior: d.precioAnterior || undefined,
    tourUrl: d.tourUrl || undefined,
  };
}

/** Todas las propiedades. Los datos demo solo se usan sin proyecto de Sanity o si Sanity no responde. */
export async function getPropiedades(): Promise<Propiedad[]> {
  if (!projectId) return propiedadesMock.map(normalize);
  try {
    const data = await client.fetch<Propiedad[]>(
      `*[_type == "propiedad"] | order(destacada desc, _createdAt desc){ ${FIELDS} }`,
      {},
      CACHE
    );
    return (data ?? []).map(normalize);
  } catch (e) {
    console.warn("[sanity] usando datos demo:", (e as Error).message);
  }
  return propiedadesMock.map(normalize);
}

/** Una propiedad por slug. Si Sanity responde que no existe, no existe (404). */
export async function getPropiedad(
  slug: string
): Promise<Propiedad | undefined> {
  if (!projectId) {
    const m = propiedadesMock.find((p) => p.slug === slug);
    return m ? normalize(m) : undefined;
  }
  try {
    const data = await client.fetch<Propiedad | null>(
      `*[_type == "propiedad" && slug.current == $slug][0]{ ${FIELDS} }`,
      { slug },
      CACHE
    );
    return data ? normalize(data) : undefined;
  } catch (e) {
    console.warn("[sanity] usando datos demo:", (e as Error).message);
  }
  const m = propiedadesMock.find((p) => p.slug === slug);
  return m ? normalize(m) : undefined;
}

/** Destacadas para el inicio; si no hay marcadas, toma las primeras 3. */
export async function getDestacadas(): Promise<Propiedad[]> {
  const todas = await getPropiedades();
  const destacadas = todas.filter((p) => p.destacada);
  return destacadas.length ? destacadas : todas.slice(0, 3);
}

/** Colonias con propiedades, con estadísticas calculadas del catálogo */
export interface ColoniaResumen {
  slug: string;
  nombre: string;
  total: number;
  venta: number;
  renta: number;
  precioMin: number;
  precioMax: number;
  /** Promedio de precio por m² de las propiedades en venta con superficie */
  m2Venta?: number;
  lat?: number;
  lng?: number;
}

export async function getColonias(): Promise<ColoniaResumen[]> {
  const todas = await getPropiedades();
  const mapa = new Map<string, Propiedad[]>();
  for (const p of todas) {
    if (!p.colonia) continue;
    const k = slugColonia(p.colonia);
    mapa.set(k, [...(mapa.get(k) ?? []), p]);
  }
  return [...mapa.entries()]
    .map(([slug, ps]) => {
      const ventas = ps.filter((p) => p.operacion === "venta");
      const m2 = ventas
        .map((p) => (p.m2Construccion ?? p.m2Terreno ? p.precio / (p.m2Construccion ?? p.m2Terreno)! : undefined))
        .filter((v): v is number => typeof v === "number");
      const conGeo = ps.find((p) => p.lat && p.lng);
      return {
        slug,
        nombre: ps[0]!.colonia,
        total: ps.length,
        venta: ventas.length,
        renta: ps.length - ventas.length,
        precioMin: Math.min(...ps.map((p) => p.precio)),
        precioMax: Math.max(...ps.map((p) => p.precio)),
        m2Venta: m2.length ? Math.round(m2.reduce((a, b) => a + b, 0) / m2.length) : undefined,
        lat: conGeo?.lat,
        lng: conGeo?.lng,
      };
    })
    .sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre));
}
