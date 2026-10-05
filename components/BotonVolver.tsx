"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./BotonVolver.module.css";

/**
 * Regresa a la página anterior si vino de este sitio; si entró directo (enlace compartido),
 * lleva a `respaldo`.
 */
export default function BotonVolver({ respaldo = "/propiedades", etiqueta = "Volver" }: { respaldo?: string; etiqueta?: string }) {
  const router = useRouter();
  return (
    <Link
      href={respaldo}
      prefetch={false}
      className={styles.volver}
      onClick={(e) => {
        let mismoSitio = false;
        try {
          mismoSitio = !!document.referrer && new URL(document.referrer).origin === location.origin;
        } catch {}
        if (mismoSitio && window.history.length > 1) {
          e.preventDefault();
          router.back();
        }
      }}
    >
      <span aria-hidden="true">←</span> {etiqueta}
    </Link>
  );
}
