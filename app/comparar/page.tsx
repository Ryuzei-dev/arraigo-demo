import type { Metadata } from "next";
import Link from "next/link";
import { getPropiedades } from "@/lib/queries";
import { getAsesor } from "@/lib/asesores";
import Breadcrumbs from "@/components/Breadcrumbs";
import BotonVolver from "@/components/BotonVolver";
import TablaComparar from "./TablaComparar";
import styles from "./comparar.module.css";

export const metadata: Metadata = {
  title: "Comparar propiedades",
  description:
    "Compara lado a lado precio, superficie, recámaras y amenidades de las propiedades que elegiste en Uruapan.",
  alternates: { canonical: "/comparar" },
  robots: { index: false, follow: true },
};

export default async function CompararPage() {
  const todas = await getPropiedades();
  const datos = todas.map((p) => {
    const asesor = getAsesor(p.asesor);
    return { ...p, asesorNombre: asesor?.nombre, asesorSlug: asesor?.slug };
  });

  return (
    <>
      <section className={styles.head}>
        <div className="wrap">
          <div className={styles.navegacion}>
            <Breadcrumbs
              items={[
                { label: "Inicio", href: "/" },
                { label: "Propiedades", href: "/propiedades" },
                { label: "Comparar" },
              ]}
            />
            <BotonVolver />
          </div>
          <h1 className={`display-l ${styles.title}`}>
            Compara <span className="italic-gold">lado a lado</span>.
          </h1>
          <p className={styles.sub}>
            Hasta tres propiedades a la vez. En dorado, el menor precio por m² y la mayor superficie.
          </p>
        </div>
      </section>
      <section className={`section ${styles.cuerpo}`}>
        <div className="wrap">
          <TablaComparar propiedades={datos} />

          <nav className={styles.siguiente} aria-label="Siguientes pasos">
            <Link href="/propiedades" className="btn btn-gold">
              Seguir buscando <span className="arrow">→</span>
            </Link>
            <Link href="/favoritos" className="btn btn-ghost">
              Ver favoritos
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
