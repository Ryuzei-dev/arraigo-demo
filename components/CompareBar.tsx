"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MAX_COMPARAR, quitar, useLista, vaciar } from "@/lib/guardados";
import styles from "./CompareBar.module.css";

export interface ItemComparar {
  slug: string;
  titulo: string;
  imagen?: string;
}

/**
 * Barra fija inferior con las propiedades del comparador, en todo el sitio. Aparece con 1 o más.
 * Deja un espaciador en el flujo para no tapar el final de la página.
 * En /comparar no se muestra: ahí la tabla ya es el comparador.
 */
export default function CompareBar({ items }: { items: ItemComparar[] }) {
  const pathname = usePathname();
  const slugs = useLista("comparar");
  const barraRef = useRef<HTMLElement>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const elegidas = slugs
    .map((s) => items.find((i) => i.slug === s))
    .filter((i): i is ItemComparar => Boolean(i));

  const oculta = pathname === "/comparar" || pathname.startsWith("/studio");
  const n = oculta ? 0 : elegidas.length;

  // Aviso cuando se intenta agregar una cuarta propiedad
  useEffect(() => {
    let t = 0;
    const alLlenar = () => {
      setAviso(`Ya tienes ${MAX_COMPARAR}. Quita una para agregar otra.`);
      window.clearTimeout(t);
      t = window.setTimeout(() => setAviso(null), 3200);
    };
    window.addEventListener("comparador-lleno", alLlenar);
    return () => {
      window.removeEventListener("comparador-lleno", alLlenar);
      window.clearTimeout(t);
    };
  }, []);

  // Publica la altura de la barra para que el asistente flotante se suba lo justo
  useEffect(() => {
    const raiz = document.documentElement;
    const el = barraRef.current;
    if (!el) {
      raiz.style.removeProperty("--alto-barra-inferior");
      return;
    }
    // Distancia del borde superior de la barra al fondo de la ventana (altura + su separación)
    const medir = () =>
      raiz.style.setProperty(
        "--alto-barra-inferior",
        `${Math.round(el.offsetHeight + (parseFloat(getComputedStyle(el).bottom) || 0))}px`
      );
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    window.addEventListener("resize", medir);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", medir);
      raiz.style.removeProperty("--alto-barra-inferior");
    };
  }, [n]);

  if (!n) return null;

  return (
    <>
      <div className={styles.espacio} aria-hidden="true" />
      <section ref={barraRef} className={styles.barra} aria-label="Comparador de propiedades" data-barra-comparar>
        <ul className={styles.items}>
          {elegidas.map((p) => (
            <li key={p.slug} className={styles.item}>
              <span className={styles.foto}>
                {p.imagen && <Image src={p.imagen} alt="" fill sizes="44px" quality={50} />}
              </span>
              <span className={styles.nombre}>{p.titulo}</span>
              <button
                type="button"
                className={styles.quitar}
                aria-label={`Quitar ${p.titulo} del comparador`}
                title="Quitar"
                onClick={() => quitar("comparar", p.slug)}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
          {Array.from({ length: MAX_COMPARAR - n }).map((_, i) => (
            <li key={`hueco-${i}`} className={styles.hueco} aria-hidden="true" />
          ))}
        </ul>
        <div className={styles.acciones}>
          <button type="button" className={styles.vaciar} onClick={() => vaciar("comparar")}>
            Vaciar
          </button>
          {n > 1 ? (
            <Link href="/comparar" className={`btn btn-gold ${styles.comparar}`}>
              Comparar ({n})
            </Link>
          ) : pathname === "/propiedades" ? (
            <span className={styles.pista}>Elige una más</span>
          ) : (
            <Link href="/propiedades" className={`btn btn-ghost ${styles.comparar}`}>
              Elige otra
            </Link>
          )}
        </div>
        <p className={`${styles.estado} ${aviso ? styles.avisoVisible : ""}`} role="status">
          {aviso ?? `${n} de ${MAX_COMPARAR} en el comparador`}
        </p>
      </section>
    </>
  );
}
