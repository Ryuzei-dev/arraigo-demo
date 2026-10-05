"use client";

import { useEffect, useRef, useState } from "react";
import BotonGuardar from "@/components/BotonGuardar";
import { track } from "@/lib/analytics";
import styles from "./ficha.module.css";

/** Fila de acciones bajo el título: compartir, guardar, comparar y descargar ficha */
export default function AccionesFicha({
  slug,
  titulo,
}: {
  slug: string;
  titulo: string;
}) {
  const [estado, setEstado] = useState("");
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    },
    []
  );

  const avisar = (texto: string) => {
    setEstado(texto);
    if (temporizador.current) clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setEstado(""), 3500);
  };

  const copiar = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      // Respaldo para navegadores sin portapapeles asíncrono
      const campo = document.createElement("textarea");
      campo.value = url;
      campo.setAttribute("readonly", "");
      campo.style.position = "fixed";
      campo.style.opacity = "0";
      document.body.appendChild(campo);
      campo.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      campo.remove();
      return ok;
    }
  };

  const compartir = async () => {
    const url = window.location.href.split("#")[0];
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: titulo, url });
        track("compartir_propiedad", { propiedad: slug, metodo: "nativo" });
        return;
      } catch (e) {
        // Si la persona cerró el menú de compartir, no hacemos nada más
        if (e instanceof DOMException && e.name === "AbortError") return;
      }
    }
    const ok = await copiar(url);
    avisar(ok ? "Enlace copiado" : "No pudimos copiar el enlace");
    if (ok) track("compartir_propiedad", { propiedad: slug, metodo: "copiar" });
  };

  return (
    <div className={styles.acciones}>
      <button type="button" className={styles.accion} onClick={compartir}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="2.5" />
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="18" cy="19" r="2.5" />
          <path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" />
        </svg>
        <span>Compartir</span>
      </button>
      <BotonGuardar slug={slug} titulo={titulo} lista="favoritos" variante="texto" />
      <BotonGuardar slug={slug} titulo={titulo} lista="comparar" variante="texto" />
      <button
        type="button"
        className={styles.accion}
        onClick={() => {
          track("descargar_ficha", { propiedad: slug });
          window.print();
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14" />
        </svg>
        <span>Descargar ficha</span>
      </button>
      <span className={styles.estadoAccion} role="status" aria-live="polite">
        {estado}
      </span>
    </div>
  );
}
