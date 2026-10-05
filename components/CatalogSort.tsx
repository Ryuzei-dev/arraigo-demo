"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./CatalogSort.module.css";

export const ORDENES = [
  { valor: "recientes", etiqueta: "Más recientes" },
  { valor: "precio-asc", etiqueta: "Precio: menor a mayor" },
  { valor: "precio-desc", etiqueta: "Precio: mayor a menor" },
  { valor: "m2-desc", etiqueta: "Más metros cuadrados" },
] as const;

/** Selector de orden: cambia ?sort= sin perder los demás parámetros */
export default function CatalogSort({ valor }: { valor: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return (
    <div className={styles.orden}>
      <label htmlFor="orden-catalogo" className={styles.label}>
        Ordenar por
      </label>
      <select
        id="orden-catalogo"
        className={styles.select}
        value={valor}
        onChange={(e) => {
          const p = new URLSearchParams(params.toString());
          if (e.target.value === "recientes") p.delete("sort");
          else p.set("sort", e.target.value);
          const q = p.toString();
          router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
        }}
      >
        {ORDENES.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.etiqueta}
          </option>
        ))}
      </select>
    </div>
  );
}
