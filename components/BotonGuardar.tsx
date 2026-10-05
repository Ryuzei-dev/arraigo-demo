"use client";

import { alternar, MAX_COMPARAR, useLista, type Lista } from "@/lib/guardados";
import { track } from "@/lib/analytics";
import styles from "./BotonGuardar.module.css";

/**
 * Botón para guardar una propiedad en favoritos o en el comparador.
 * variante "icono": círculo sobre la foto de la tarjeta. "texto": botón con etiqueta (ficha).
 */
export default function BotonGuardar({
  slug,
  titulo,
  lista,
  variante = "icono",
}: {
  slug: string;
  titulo: string;
  lista: Extract<Lista, "favoritos" | "comparar">;
  variante?: "icono" | "texto";
}) {
  const guardados = useLista(lista);
  const activo = guardados.includes(slug);
  const lleno = lista === "comparar" && !activo && guardados.length >= MAX_COMPARAR;

  const etiqueta =
    lista === "favoritos"
      ? activo
        ? `Quitar ${titulo} de favoritos`
        : `Guardar ${titulo} en favoritos`
      : activo
        ? `Quitar ${titulo} del comparador`
        : lleno
          ? `El comparador ya tiene ${MAX_COMPARAR} propiedades`
          : `Agregar ${titulo} al comparador`;

  const texto =
    lista === "favoritos" ? (activo ? "Guardada" : "Guardar") : activo ? "En comparador" : "Comparar";

  return (
    <button
      type="button"
      className={`${styles.boton} ${styles[variante]} ${activo ? styles.activo : ""}`}
      aria-pressed={activo}
      aria-label={etiqueta}
      title={etiqueta}
      aria-disabled={lleno || undefined}
      data-lleno={lleno || undefined}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (lleno) {
          // La barra del comparador muestra el aviso (un botón deshabilitado no daba ninguna respuesta)
          window.dispatchEvent(new CustomEvent("comparador-lleno"));
          return;
        }
        const ahora = alternar(lista, slug);
        if (ahora) track(lista === "favoritos" ? "guardar_favorito" : "agregar_comparador", { propiedad: slug });
      }}
    >
      {lista === "favoritos" ? (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 7 4.5c2 0 3.6 1.1 5 2.9 1.4-1.8 3-2.9 5-2.9 3.6 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2Z"
            fill={activo ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <rect x="3.5" y="4.5" width="7" height="15" rx="1.5" fill={activo ? "currentColor" : "none"} />
          <rect x="13.5" y="4.5" width="7" height="15" rx="1.5" />
        </svg>
      )}
      {variante === "texto" && <span>{texto}</span>}
    </button>
  );
}
