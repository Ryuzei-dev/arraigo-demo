// Medición de eventos con Google Analytics 4. Solo funciona si NEXT_PUBLIC_GA_ID está definido;
// sin esa variable, track() no hace nada.

type Parametros = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(evento: string, parametros: Parametros = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", evento, parametros);
}
