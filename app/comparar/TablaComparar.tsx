"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { quitar, useLista, vaciar } from "@/lib/guardados";
import {
  formatoMoneda,
  formatoPrecio,
  precioM2,
  type Propiedad,
} from "@/lib/properties";
import styles from "./comparar.module.css";

type Fila = Propiedad & { asesorNombre?: string; asesorSlug?: string };

const guion = <span className={styles.sinDato}>Sin dato</span>;
const dato = (v: ReactNode | undefined | null) => (v === undefined || v === null || v === "" ? guion : v);

/** `mejor`: valor numérico con el que se elige la mejor celda de la fila ("menor" o "mayor") */
type Mejor = { num: (p: Fila) => number | null | undefined; sentido: "menor" | "mayor"; mismaOperacion?: boolean };
const FILAS: { etiqueta: string; valor: (p: Fila) => ReactNode; mejor?: Mejor }[] = [
  { etiqueta: "Precio", valor: (p) => <strong className={styles.precio}>{formatoPrecio(p)}</strong> },
  {
    etiqueta: "Precio por m²",
    valor: (p) => {
      const m2 = precioM2(p);
      return m2 != null ? `${formatoMoneda(m2, p.moneda)}/m²${p.operacion === "renta" ? " al mes" : ""}` : null;
    },
    mejor: { num: precioM2, sentido: "menor", mismaOperacion: true },
  },
  { etiqueta: "Operación", valor: (p) => (p.operacion === "venta" ? "Venta" : "Renta") },
  { etiqueta: "Tipo", valor: (p) => p.categoria },
  { etiqueta: "Colonia", valor: (p) => p.colonia },
  { etiqueta: "Recámaras", valor: (p) => p.recamaras },
  { etiqueta: "Baños", valor: (p) => p.banos },
  { etiqueta: "Estacionamientos", valor: (p) => p.estacionamientos },
  {
    etiqueta: "Construcción",
    valor: (p) => (p.m2Construccion != null ? `${p.m2Construccion} m²` : null),
    mejor: { num: (p) => p.m2Construccion, sentido: "mayor" },
  },
  {
    etiqueta: "Terreno",
    valor: (p) => (p.m2Terreno != null ? `${p.m2Terreno} m²` : null),
    mejor: { num: (p) => p.m2Terreno, sentido: "mayor" },
  },
  {
    etiqueta: "Amenidades",
    valor: (p) =>
      p.amenidades.length ? (
        <ul className={styles.amenidades}>
          {p.amenidades.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      ) : null,
  },
  {
    etiqueta: "Asesor",
    valor: (p) =>
      p.asesorNombre && p.asesorSlug ? (
        <Link href={`/asesores/${p.asesorSlug}`} className={styles.asesor}>
          {p.asesorNombre}
        </Link>
      ) : (
        p.asesorNombre
      ),
  },
];

/** Slug de la mejor propiedad de la fila, o null si no hay con qué comparar o empatan */
function mejorDeFila(f: (typeof FILAS)[number], elegidas: Fila[]): string | null {
  if (!f.mejor || elegidas.length < 2) return null;
  if (f.mejor.mismaOperacion && new Set(elegidas.map((p) => p.operacion)).size > 1) return null;
  const conValor = elegidas
    .map((p) => ({ slug: p.slug, v: f.mejor!.num(p) }))
    .filter((x): x is { slug: string; v: number } => typeof x.v === "number");
  if (conValor.length < 2) return null;
  const orden = [...conValor].sort((a, b) => (f.mejor!.sentido === "menor" ? a.v - b.v : b.v - a.v));
  return orden[0].v === orden[1].v ? null : orden[0].slug;
}

export default function TablaComparar({ propiedades }: { propiedades: Fila[] }) {
  const slugs = useLista("comparar");
  const favoritos = useLista("favoritos");
  const desliza = useRef<HTMLDivElement>(null);
  const [haciaLaDerecha, setHaciaLaDerecha] = useState(false);
  const elegidas = slugs
    .map((s) => propiedades.find((p) => p.slug === s))
    .filter((p): p is Fila => Boolean(p));

  // Indicación "desliza" solo cuando la tabla no cabe y aún hay columnas a la derecha
  useEffect(() => {
    const el = desliza.current;
    if (!el) return;
    const medir = () => setHaciaLaDerecha(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", medir);
      ro.disconnect();
    };
  }, [elegidas.length]);

  if (!elegidas.length) {
    return (
      <div className={styles.vacio}>
        <h2 className="display-m">Aún no eliges propiedades</h2>
        <p>
          En el catálogo, toca el botón de comparar sobre la foto de cada
          propiedad. Puedes comparar hasta tres.
        </p>
        <div className={styles.accionesVacio}>
          <Link href="/propiedades" className="btn btn-gold">
            Ir al catálogo <span className="arrow">→</span>
          </Link>
          {favoritos.length > 0 && (
            <Link href="/favoritos" className="btn btn-ghost">
              Elegir de mis favoritos ({favoritos.length})
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.barra}>
        <p className={styles.conteo}>
          {elegidas.length} propiedad{elegidas.length !== 1 ? "es" : ""} en el comparador
        </p>
        <div className={styles.accionesBarra}>
          {elegidas.length < 3 && (
            <Link href="/propiedades" className={styles.enlace}>
              Agregar otra
            </Link>
          )}
          <button type="button" className={styles.enlace} onClick={() => vaciar("comparar")}>
            Vaciar comparador
          </button>
        </div>
      </div>

      {haciaLaDerecha && (
        <p className={styles.indicacion} aria-hidden="true">
          Desliza para ver todas <span>→</span>
        </p>
      )}
      <div ref={desliza} className={styles.desliza} tabIndex={0} role="region" aria-label="Tabla comparativa, desliza para ver más">
        <table className={styles.tabla}>
          <caption className={styles.sr}>Comparación de propiedades</caption>
          <thead>
            <tr>
              <td className={styles.esquina} />
              {elegidas.map((p) => (
                <th key={p.slug} scope="col" className={styles.cabeza}>
                  <div className={styles.foto}>
                    {p.imagenes[0] && (
                      <Image src={p.imagenes[0]} alt="" fill sizes="280px" className={styles.img} />
                    )}
                    <button
                      type="button"
                      className={styles.quitar}
                      aria-label={`Quitar ${p.titulo} del comparador`}
                      onClick={() => quitar("comparar", p.slug)}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  <span className={styles.nombre}>{p.titulo}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FILAS.map((f) => {
              const mejor = mejorDeFila(f, elegidas);
              return (
                <tr key={f.etiqueta}>
                  <th scope="row" className={styles.etiqueta}>
                    {f.etiqueta}
                  </th>
                  {elegidas.map((p) => (
                    <td key={p.slug} className={mejor === p.slug ? styles.mejor : undefined}>
                      {dato(f.valor(p))}
                      {mejor === p.slug && (
                        <span className={styles.sello}>
                          {f.mejor!.sentido === "menor" ? "Menor" : "Mayor"}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr>
              <th scope="row" className={styles.etiqueta}>
                <span className={styles.sr}>Ficha</span>
              </th>
              {elegidas.map((p) => (
                <td key={p.slug}>
                  <Link href={`/propiedades/${p.slug}`} className={`btn btn-ghost ${styles.ver}`}>
                    Ver ficha <span className="arrow">→</span>
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
