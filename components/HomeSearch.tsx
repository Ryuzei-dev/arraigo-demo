"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { categorias } from "@/lib/properties";
import { track } from "@/lib/analytics";
import styles from "./HomeSearch.module.css";

const TOPES_VENTA = [1_000_000, 2_000_000, 3_000_000, 5_000_000, 8_000_000, 12_000_000];
const TOPES_RENTA = [10_000, 15_000, 20_000, 30_000, 50_000];
const fmt = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);

/**
 * Buscador del inicio: GET a /propiedades. Funciona sin JS.
 * En celular se pliega en un solo botón que lo despliega.
 */
export default function HomeSearch({
  zonas,
}: {
  zonas: { slug: string; nombre: string }[];
}) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [operacion, setOperacion] = useState("");

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    new FormData(e.currentTarget).forEach((v, k) => {
      const s = String(v).trim();
      if (s) params.set(k, s);
    });
    track("buscar_inicio", Object.fromEntries(params));
    const q = params.toString();
    router.push(q ? `/propiedades?${q}` : "/propiedades");
  };

  const opcionesVenta = TOPES_VENTA.map((n) => (
    <option key={`v${n}`} value={n}>
      {fmt(n)}
    </option>
  ));
  const opcionesRenta = TOPES_RENTA.map((n) => (
    <option key={`r${n}`} value={n}>
      {fmt(n)} al mes
    </option>
  ));

  return (
    <div className={`${styles.buscador} ${abierto ? styles.abierto : ""}`}>
      <button
        type="button"
        className={styles.desplegar}
        aria-expanded={abierto}
        aria-controls="buscador-inicio"
        onClick={() => setAbierto((v) => !v)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4 4" />
        </svg>
        Buscar propiedades
        <svg className={styles.flecha} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <form
        id="buscador-inicio"
        action="/propiedades"
        method="get"
        role="search"
        aria-label="Buscar propiedades"
        className={styles.form}
        onSubmit={enviar}
      >
        <div className={styles.campo}>
          <label htmlFor="hs-op">Operación</label>
          <select
            id="hs-op"
            name="operacion"
            value={operacion}
            onChange={(e) => setOperacion(e.target.value)}
          >
            <option value="">Venta o renta</option>
            <option value="venta">Venta</option>
            <option value="renta">Renta</option>
          </select>
        </div>
        <div className={styles.campo}>
          <label htmlFor="hs-tipo">Tipo</label>
          <select id="hs-tipo" name="categoria" defaultValue="">
            <option value="">Cualquier tipo</option>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.campo}>
          <label htmlFor="hs-zona">Zona</label>
          <select id="hs-zona" name="zona" defaultValue="">
            <option value="">Todas las zonas</option>
            {zonas.map((z) => (
              <option key={z.slug} value={z.slug}>
                {z.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.campo}>
          <label htmlFor="hs-precio">Precio máximo</label>
          <select id="hs-precio" name="precioMax" defaultValue="" key={operacion}>
            <option value="">Sin límite</option>
            {operacion === "venta" && opcionesVenta}
            {operacion === "renta" && opcionesRenta}
            {operacion === "" && (
              <>
                <optgroup label="Venta">{opcionesVenta}</optgroup>
                <optgroup label="Renta mensual">{opcionesRenta}</optgroup>
              </>
            )}
          </select>
        </div>
        <button type="submit" className={`btn btn-gold ${styles.buscar}`}>
          Buscar <span className="arrow">→</span>
        </button>
      </form>
    </div>
  );
}
