import "server-only";
import { getColonias, getPropiedades, type ColoniaResumen } from "@/lib/queries";
import { formatoMoneda, slugColonia, type Propiedad } from "@/lib/properties";

export interface ColoniaDetalle extends ColoniaResumen {
  propiedades: Propiedad[];
  /** Rango de precios de venta (MXN) */
  rangoVenta?: [number, number];
  /** Rango de renta mensual (MXN) */
  rangoRenta?: [number, number];
}

function rango(ps: Propiedad[]): [number, number] | undefined {
  // Solo pesos: mezclar monedas daría rangos sin sentido
  const precios = ps.filter((p) => p.moneda === "MXN").map((p) => p.precio);
  if (!precios.length) return undefined;
  return [Math.min(...precios), Math.max(...precios)];
}

/** Colonias del catálogo con sus propiedades y rangos separados por operación */
export async function getColoniasDetalle(): Promise<ColoniaDetalle[]> {
  const [colonias, todas] = await Promise.all([getColonias(), getPropiedades()]);
  return colonias.map((c) => {
    const propiedades = todas.filter((p) => p.colonia && slugColonia(p.colonia) === c.slug);
    return {
      ...c,
      propiedades,
      rangoVenta: rango(propiedades.filter((p) => p.operacion === "venta")),
      rangoRenta: rango(propiedades.filter((p) => p.operacion === "renta")),
    };
  });
}

export async function getColoniaDetalle(slug: string) {
  return (await getColoniasDetalle()).find((c) => c.slug === slug);
}

export function textoRango(r: [number, number], renta = false) {
  const sufijo = renta ? " al mes" : "";
  if (r[0] === r[1]) return `${formatoMoneda(r[0])}${sufijo}`;
  return `${formatoMoneda(r[0])} a ${formatoMoneda(r[1])}${sufijo}`;
}
