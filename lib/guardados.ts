"use client";

// Listas que se guardan en el navegador del visitante (sin cuenta): favoritos, comparador
// y propiedades vistas recientemente. Se sincronizan entre componentes y pestañas.

import { useSyncExternalStore } from "react";

export type Lista = "favoritos" | "comparar" | "vistos";

const CLAVE: Record<Lista, string> = {
  favoritos: "arraigo:favoritos",
  comparar: "arraigo:comparar",
  vistos: "arraigo:vistos",
};

export const MAX_COMPARAR = 3;
const MAX_VISTOS = 8;
const VACIA: string[] = [];
const cache = new Map<Lista, { raw: string | null; valor: string[] }>();
const oyentes = new Set<() => void>();

function leer(lista: Lista): string[] {
  if (typeof window === "undefined") return VACIA;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CLAVE[lista]);
  } catch {
    return VACIA;
  }
  const c = cache.get(lista);
  if (c && c.raw === raw) return c.valor;
  let valor: string[] = VACIA;
  try {
    const v = raw ? JSON.parse(raw) : [];
    valor = Array.isArray(v) ? v.filter((x) => typeof x === "string") : VACIA;
  } catch {
    valor = VACIA;
  }
  cache.set(lista, { raw, valor });
  return valor;
}

function escribir(lista: Lista, valor: string[]) {
  try {
    window.localStorage.setItem(CLAVE[lista], JSON.stringify(valor));
  } catch {
    // Sin almacenamiento (modo privado): la lista vive solo en esta sesión
  }
  oyentes.forEach((f) => f());
}

function suscribir(f: () => void) {
  oyentes.add(f);
  const enOtraPestana = (e: StorageEvent) => {
    if (e.key?.startsWith("arraigo:")) f();
  };
  window.addEventListener("storage", enOtraPestana);
  return () => {
    oyentes.delete(f);
    window.removeEventListener("storage", enOtraPestana);
  };
}

/** Lista reactiva; en el servidor y en el primer render es vacía */
export function useLista(lista: Lista): string[] {
  return useSyncExternalStore(
    suscribir,
    () => leer(lista),
    () => VACIA
  );
}

export function alternar(lista: Lista, slug: string): boolean {
  const actual = leer(lista);
  if (actual.includes(slug)) {
    escribir(lista, actual.filter((s) => s !== slug));
    return false;
  }
  if (lista === "comparar" && actual.length >= MAX_COMPARAR) return false;
  escribir(lista, [...actual, slug]);
  return true;
}

export function quitar(lista: Lista, slug: string) {
  escribir(lista, leer(lista).filter((s) => s !== slug));
}

export function vaciar(lista: Lista) {
  escribir(lista, []);
}

/** Registra una visita al principio de "vistos" */
export function registrarVisto(slug: string) {
  const resto = leer("vistos").filter((s) => s !== slug);
  escribir("vistos", [slug, ...resto].slice(0, MAX_VISTOS));
}
