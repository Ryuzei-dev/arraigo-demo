import type { ReactNode } from "react";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import styles from "./HeroPagina.module.css";

/** Cabecera de página interna: migas, titular grande y entrada (mismo patrón que servicios y nosotros) */
export default function HeroPagina({
  migas,
  titulo,
  entrada,
  children,
  compacta = false,
}: {
  migas: Crumb[];
  titulo: ReactNode;
  entrada?: ReactNode;
  children?: ReactNode;
  compacta?: boolean;
}) {
  return (
    <section className={`${styles.hero} ${compacta ? styles.compacta : ""}`}>
      <div className="wrap">
        <Breadcrumbs items={migas} />
        <h1 className={`${compacta ? "display-l" : "display-xl"} ${styles.titulo}`}>{titulo}</h1>
        {entrada && <p className={styles.entrada}>{entrada}</p>}
        {children && <div className={styles.extra}>{children}</div>}
      </div>
    </section>
  );
}
