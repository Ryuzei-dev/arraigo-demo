import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters, { type FiltrosCatalogo } from "@/components/PropertyFilters";
import CatalogSort from "@/components/CatalogSort";
import MapaCatalogo from "@/components/MapaCatalogo";
import VistosRecientes from "@/components/VistosRecientes";
import Reveal from "@/components/Reveal";
import {
  categorias,
  formatoMoneda,
  formatoPrecio,
  slugColonia,
  superficie,
  type Categoria,
  type Propiedad,
} from "@/lib/properties";
import { getColonias, getPropiedades } from "@/lib/queries";
import styles from "./propiedades.module.css";

export const metadata: Metadata = {
  title: "Propiedades en venta y renta",
  description:
    "Catálogo de casas, departamentos, terrenos, locales, oficinas y bodegas en venta y renta en Uruapan, Michoacán.",
  alternates: { canonical: "/propiedades" },
};

type Params = Record<string, string | string[] | undefined>;
type Clave = keyof FiltrosCatalogo;

// Nota: estas utilidades viven aquí (y no se importan de los componentes cliente)
// porque los valores exportados por un módulo "use client" no se pueden usar en el servidor.
const ORDENES_VALIDOS = ["precio-asc", "precio-desc", "m2-desc"];
const CLAVES: Clave[] = [
  "operacion",
  "categoria",
  "zona",
  "precioMin",
  "precioMax",
  "recamaras",
  "m2Min",
  "q",
  "sort",
  "vista",
];

function urlCatalogo(base: FiltrosCatalogo, cambios: Partial<Record<Clave, string | null>> = {}) {
  const params = new URLSearchParams();
  for (const k of CLAVES) {
    const v = k in cambios ? cambios[k] : base[k];
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  }
  const q = params.toString();
  return q ? `/propiedades?${q}` : "/propiedades";
}

const texto = (v: string | string[] | undefined) => {
  const s = (Array.isArray(v) ? v[0] : v)?.trim();
  return s ? s : undefined;
};
const numero = (v: string | string[] | undefined) => {
  const s = texto(v);
  if (!s) return undefined;
  const n = Math.round(Number(s.replace(/[^\d.]/g, "")));
  return Number.isFinite(n) && n > 0 ? n : undefined;
};
/** Minúsculas y sin acentos, para buscar texto */
const normalizar = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Precio compacto para el pin del mapa: "$5.9 M", "$18.5 mil/mes" */
function precioCorto(precio: number, renta: boolean) {
  const fmt = (n: number) => n.toLocaleString("es-MX", { maximumFractionDigits: 1 });
  const n =
    precio >= 1_000_000
      ? `$${fmt(precio / 1_000_000)} M`
      : precio >= 1000
        ? `$${fmt(precio / 1000)} mil`
        : `$${precio}`;
  return renta ? `${n}/mes` : n;
}

function leerFiltros(sp: Params): FiltrosCatalogo {
  const op = texto(sp.operacion);
  const cat = texto(sp.categoria);
  const sort = texto(sp.sort);
  return {
    operacion: op === "venta" || op === "renta" ? op : undefined,
    categoria: categorias.includes(cat as Categoria) ? (cat as Categoria) : undefined,
    zona: texto(sp.zona),
    precioMin: numero(sp.precioMin),
    precioMax: numero(sp.precioMax),
    recamaras: numero(sp.recamaras),
    m2Min: numero(sp.m2Min),
    q: texto(sp.q)?.slice(0, 80),
    sort: sort && ORDENES_VALIDOS.includes(sort) ? sort : undefined,
    vista: texto(sp.vista) === "mapa" ? "mapa" : undefined,
  };
}

function filtrar(todas: Propiedad[], f: FiltrosCatalogo) {
  const palabras = f.q ? normalizar(f.q).split(/\s+/).filter(Boolean) : [];
  return todas.filter((p) => {
    if (f.operacion && p.operacion !== f.operacion) return false;
    if (f.categoria && p.categoria !== f.categoria) return false;
    if (f.zona && slugColonia(p.colonia) !== f.zona) return false;
    if (f.precioMin && p.precio < f.precioMin) return false;
    if (f.precioMax && p.precio > f.precioMax) return false;
    if (f.recamaras && (p.recamaras ?? 0) < f.recamaras) return false;
    if (f.m2Min && (superficie(p) ?? 0) < f.m2Min) return false;
    if (palabras.length) {
      const pajar = normalizar(`${p.titulo} ${p.colonia} ${p.resumen}`);
      if (!palabras.every((w) => pajar.includes(w))) return false;
    }
    return true;
  });
}

function ordenar(lista: Propiedad[], sort?: string) {
  const copia = [...lista];
  if (sort === "precio-asc") copia.sort((a, b) => a.precio - b.precio);
  else if (sort === "precio-desc") copia.sort((a, b) => b.precio - a.precio);
  else if (sort === "m2-desc") copia.sort((a, b) => (superficie(b) ?? 0) - (superficie(a) ?? 0));
  return copia;
}

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const sp = await searchParams;
  const filtros = leerFiltros(sp);

  const [todas, colonias] = await Promise.all([getPropiedades(), getColonias()]);
  const lista = ordenar(filtrar(todas, filtros), filtros.sort);
  const zonas = colonias.map((c) => ({ slug: c.slug, nombre: c.nombre, total: c.total }));
  const nombreZona = zonas.find((z) => z.slug === filtros.zona)?.nombre ?? filtros.zona;
  const esMapa = filtros.vista === "mapa";

  // Filtros activos, cada uno con su enlace para quitarlo
  const activos: { etiqueta: string; href: string }[] = [];
  const quitar = (k: Clave) => urlCatalogo(filtros, { [k]: null });
  if (filtros.operacion)
    activos.push({ etiqueta: filtros.operacion === "venta" ? "Venta" : "Renta", href: quitar("operacion") });
  if (filtros.categoria) activos.push({ etiqueta: filtros.categoria, href: quitar("categoria") });
  if (filtros.zona) activos.push({ etiqueta: `Zona: ${nombreZona}`, href: quitar("zona") });
  if (filtros.precioMin)
    activos.push({ etiqueta: `Desde ${formatoMoneda(filtros.precioMin)}`, href: quitar("precioMin") });
  if (filtros.precioMax)
    activos.push({ etiqueta: `Hasta ${formatoMoneda(filtros.precioMax)}`, href: quitar("precioMax") });
  if (filtros.recamaras)
    activos.push({
      etiqueta: `${filtros.recamaras}+ recámara${filtros.recamaras !== 1 ? "s" : ""}`,
      href: quitar("recamaras"),
    });
  if (filtros.m2Min) activos.push({ etiqueta: `Desde ${filtros.m2Min} m²`, href: quitar("m2Min") });
  if (filtros.q) activos.push({ etiqueta: `“${filtros.q}”`, href: quitar("q") });
  const limpiar = urlCatalogo({ sort: filtros.sort, vista: filtros.vista });

  const resumenes = todas.map((p) => ({
    slug: p.slug,
    titulo: p.titulo,
    colonia: p.colonia,
    precio: formatoPrecio(p),
    imagen: p.imagenes[0],
  }));

  return (
    <>
      <section className={styles.head}>
        <div className={styles.headGrid} />
        <div className="wrap">
          <h1 className={`display-l ${styles.title}`}>
            Casas, terrenos y locales<br />
            en <span className="italic-gold">Uruapan</span>.
          </h1>
          <p className={styles.sub}>
            {todas.length} propiedad{todas.length !== 1 ? "es" : ""} disponible
            {todas.length !== 1 ? "s" : ""} en este momento.
          </p>
        </div>
      </section>

      <section className={`section ${styles.results}`}>
        <div className="wrap">
          <div className={styles.layout}>
            <PropertyFilters filtros={filtros} zonas={zonas} total={lista.length} />

            <div className={styles.resultsCol}>
              <div className={styles.barra}>
                <p className={styles.conteo}>
                  <strong>{lista.length}</strong> resultado{lista.length !== 1 ? "s" : ""}
                  {activos.length > 0 ? " con estos filtros" : ""}
                </p>
                <div className={styles.controles}>
                  <nav className={styles.vista} aria-label="Modo de vista">
                    <Link
                      href={urlCatalogo(filtros, { vista: null })}
                      scroll={false}
                      aria-current={!esMapa ? "page" : undefined}
                      className={!esMapa ? styles.vistaActiva : undefined}
                    >
                      Lista
                    </Link>
                    <Link
                      href={urlCatalogo(filtros, { vista: "mapa" })}
                      scroll={false}
                      aria-current={esMapa ? "page" : undefined}
                      className={esMapa ? styles.vistaActiva : undefined}
                    >
                      Mapa
                    </Link>
                  </nav>
                  <Suspense fallback={null}>
                    <CatalogSort valor={filtros.sort ?? "recientes"} />
                  </Suspense>
                </div>
              </div>

              {activos.length > 0 && (
                <ul className={styles.activos} aria-label="Filtros activos">
                  {activos.map((a) => (
                    <li key={a.etiqueta}>
                      <Link href={a.href} scroll={false} className={styles.activo}>
                        {a.etiqueta}
                        <span aria-hidden="true" className={styles.x}>
                          ×
                        </span>
                        <span className={styles.sr}> (quitar filtro)</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href={limpiar} scroll={false} className={styles.limpiar}>
                      Limpiar
                    </Link>
                  </li>
                </ul>
              )}

              {lista.length === 0 ? (
                <div className={styles.empty}>
                  <h2 className="display-m">Sin resultados</h2>
                  <p>
                    No hay propiedades con estos filtros. Prueba con otra
                    combinación.
                  </p>
                  <Link href={limpiar} className="btn btn-ghost">
                    Limpiar filtros
                  </Link>
                </div>
              ) : esMapa ? (
                <MapaCatalogo
                  puntos={lista.map((p) => ({
                    slug: p.slug,
                    titulo: p.titulo,
                    colonia: p.colonia,
                    precio: formatoPrecio(p),
                    pin: precioCorto(p.precio, p.operacion === "renta"),
                    imagen: p.imagenes[0],
                    lat: p.lat,
                    lng: p.lng,
                  }))}
                />
              ) : (
                <>
                  <h2 className={styles.sr}>Propiedades encontradas</h2>
                  <div className={styles.grid}>
                    {lista.map((p, i) => (
                      <Reveal key={p.slug} delay={(i % 2) * 70}>
                        <PropertyCard p={p} preload={i === 0} />
                      </Reveal>
                    ))}
                  </div>
                </>
              )}

              <VistosRecientes items={resumenes} />
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
