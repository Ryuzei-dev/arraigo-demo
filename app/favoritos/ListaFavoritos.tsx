"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import { alternar, MAX_COMPARAR, useLista, vaciar } from "@/lib/guardados";
import type { Propiedad } from "@/lib/properties";
import styles from "./favoritos.module.css";

export default function ListaFavoritos({ propiedades }: { propiedades: Propiedad[] }) {
  const router = useRouter();
  const slugs = useLista("favoritos");
  const guardadas = slugs
    .map((s) => propiedades.find((p) => p.slug === s))
    .filter((p): p is Propiedad => Boolean(p));

  if (!guardadas.length) {
    return (
      <div className={styles.vacio}>
        <h2 className="display-m">Todavía no guardas propiedades</h2>
        <p>
          Toca el corazón sobre la foto de cualquier propiedad del catálogo
          para guardarla aquí.
        </p>
        <Link href="/propiedades" className="btn btn-gold">
          Ir al catálogo <span className="arrow">→</span>
        </Link>
      </div>
    );
  }

  const n = guardadas.length;
  const aComparar = guardadas.slice(0, MAX_COMPARAR);

  return (
    <>
      <div className={styles.barra}>
        <p className={styles.conteo}>
          <strong>{n}</strong> propiedad{n !== 1 ? "es" : ""} guardada{n !== 1 ? "s" : ""}
        </p>
        <div className={styles.acciones}>
          <button type="button" className={styles.enlace} onClick={() => vaciar("favoritos")}>
            Quitar todas
          </button>
          {n >= 2 && (
            <button
              type="button"
              className="btn btn-gold"
              onClick={() => {
                vaciar("comparar");
                aComparar.forEach((p) => alternar("comparar", p.slug));
                router.push("/comparar");
              }}
            >
              {n > MAX_COMPARAR ? `Comparar las primeras ${MAX_COMPARAR}` : `Comparar ${n === 2 ? "las dos" : `las ${n}`}`}{" "}
              <span className="arrow">→</span>
            </button>
          )}
        </div>
      </div>
      <div className={styles.grid}>
        {guardadas.map((p) => (
          <PropertyCard key={p.slug} p={p} />
        ))}
      </div>
    </>
  );
}
