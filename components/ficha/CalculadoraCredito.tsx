"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { formatoMoneda } from "@/lib/properties";
import styles from "./ficha.module.css";

const PLAZOS = [10, 15, 20] as const;

/** Mensualidad con amortización francesa (pagos fijos) */
export function mensualidad(monto: number, tasaAnual: number, anios: number) {
  const n = anios * 12;
  if (monto <= 0 || n <= 0) return 0;
  const r = tasaAnual / 100 / 12;
  if (r <= 0) return monto / n;
  return (monto * r) / (1 - Math.pow(1 + r, -n));
}

export default function CalculadoraCredito({
  precioInicial,
  moneda = "MXN",
}: {
  precioInicial: number;
  moneda?: "MXN" | "USD";
}) {
  const id = useId();
  const [precio, setPrecio] = useState(String(precioInicial));
  const [enganche, setEnganche] = useState(20);
  const [plazo, setPlazo] = useState<(typeof PLAZOS)[number]>(20);
  const [tasa, setTasa] = useState("11.0");

  const precioNum = Math.max(0, Number(precio.replace(/[^\d.]/g, "")) || 0);
  const tasaNum = Math.min(40, Math.max(0, Number(tasa) || 0));
  const engancheMonto = precioNum * (enganche / 100);
  const credito = precioNum - engancheMonto;
  const pago = mensualidad(credito, tasaNum, plazo);
  const fmt = (n: number) => formatoMoneda(Math.round(n), moneda);

  return (
    <div className={styles.calcCaja}>
    <div className={styles.calc}>
      <div className={styles.calcCampos}>
        <div className={styles.campo}>
          <label htmlFor={`${id}-precio`}>Precio de la propiedad</label>
          <div className={styles.conPrefijo}>
            <span aria-hidden="true">$</span>
            <input
              id={`${id}-precio`}
              inputMode="numeric"
              autoComplete="off"
              value={precioNum ? new Intl.NumberFormat("es-MX").format(precioNum) : precio}
              onChange={(e) => setPrecio(e.target.value.replace(/[^\d]/g, ""))}
            />
          </div>
        </div>

        <div className={styles.campo}>
          <div className={styles.campoFila}>
            <label htmlFor={`${id}-enganche`}>Enganche</label>
            <output htmlFor={`${id}-enganche`} className={styles.valorDato}>
              {enganche}% · {fmt(engancheMonto)}
            </output>
          </div>
          <input
            id={`${id}-enganche`}
            type="range"
            min={10}
            max={50}
            step={1}
            value={enganche}
            aria-valuetext={`${enganche} por ciento, ${fmt(engancheMonto)}`}
            onChange={(e) => setEnganche(Number(e.target.value))}
            className={styles.rango}
            style={{ ["--avance" as string]: `${((enganche - 10) / 40) * 100}%` }}
          />
        </div>

        <fieldset className={styles.campo}>
          <legend>Plazo</legend>
          <div className={styles.opciones} data-columnas="3">
            {PLAZOS.map((a) => (
              <label key={a} className={styles.opcion}>
                <input
                  type="radio"
                  name={`${id}-plazo`}
                  value={a}
                  checked={plazo === a}
                  onChange={() => setPlazo(a)}
                />
                <span>{a} años</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.campo}>
          <label htmlFor={`${id}-tasa`}>Tasa de interés anual (%)</label>
          <input
            id={`${id}-tasa`}
            type="number"
            inputMode="decimal"
            min={0}
            max={40}
            step={0.1}
            value={tasa}
            onChange={(e) => setTasa(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.calcResultado} aria-live="polite">
        <div className={styles.resultadoPrincipal}>
          <span className={styles.resultadoEtiqueta}>Mensualidad estimada</span>
          <output className={styles.resultadoValor}>{fmt(pago)}</output>
        </div>
        <dl className={styles.resultadoLista}>
          <div>
            <dt>Monto del crédito</dt>
            <dd>{fmt(credito)}</dd>
          </div>
          <div>
            <dt>Enganche</dt>
            <dd>{fmt(engancheMonto)}</dd>
          </div>
          <div>
            <dt>Plazo</dt>
            <dd>{plazo * 12} pagos</dd>
          </div>
        </dl>
        <p className={styles.nota}>
          Estimación sin comisiones ni seguros. Tu banco, Infonavit o Fovissste te dan la cifra exacta.
        </p>
        <Link href="/servicios/creditos-y-financiamiento" className={styles.enlace}>
          Te ayudamos con tu crédito <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
    </div>
  );
}
