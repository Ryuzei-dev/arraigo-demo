import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import HeroPagina from "@/components/HeroPagina";
import PropertyCard from "@/components/PropertyCard";
import Reveal from "@/components/Reveal";
import { formatoMoneda } from "@/lib/properties";
import { getColoniaDetalle, getColoniasDetalle, textoRango } from "../datos";
import styles from "../colonias.module.css";

export async function generateStaticParams() {
  return (await getColoniasDetalle()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getColoniaDetalle(slug);
  if (!c) return { title: "Colonia no encontrada" };
  return {
    title: `Propiedades en ${c.nombre}, Uruapan`,
    description: `${c.total} ${c.total === 1 ? "propiedad" : "propiedades"} en ${c.nombre}, Uruapan: ${c.venta} en venta y ${c.renta} en renta, según nuestro catálogo.`,
    alternates: { canonical: `/colonias/${c.slug}` },
  };
}

export default async function ColoniaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getColoniaDetalle(slug);
  if (!c) notFound();

  return (
    <>
      <HeroPagina
        compacta
        migas={[
          { label: "Inicio", href: "/" },
          { label: "Colonias", href: "/colonias" },
          { label: c.nombre },
        ]}
        titulo={<span className="italic-gold">{c.nombre}</span>}
        entrada={`${c.total} ${c.total === 1 ? "propiedad publicada" : "propiedades publicadas"} en esta colonia de Uruapan.`}
      />

      <section className={styles.cifras}>
        <div className="wrap">
          <dl className={styles.cifrasRejilla}>
            <div>
              <dt>En venta</dt>
              <dd>{c.venta}</dd>
            </div>
            <div>
              <dt>En renta</dt>
              <dd>{c.renta}</dd>
            </div>
            {c.rangoVenta && (
              <div>
                <dt>Precios de venta</dt>
                <dd className={styles.cifraTexto}>{textoRango(c.rangoVenta)}</dd>
              </div>
            )}
            {c.rangoRenta && (
              <div>
                <dt>Rentas</dt>
                <dd className={styles.cifraTexto}>{textoRango(c.rangoRenta, true)}</dd>
              </div>
            )}
            {c.m2Venta && (
              <div>
                <dt>Promedio por m² en venta</dt>
                <dd className={styles.cifraTexto}>{formatoMoneda(c.m2Venta)}</dd>
              </div>
            )}
          </dl>
          <p className={styles.avisoCifras}>Según las propiedades de nuestro catálogo. No es un avalúo.</p>
        </div>
      </section>

      <section className={`section ${styles.propiedades}`}>
        <div className="wrap">
          <div className={styles.cabeceraLista}>
            <h2 className="display-m">
              Propiedades en <span className="italic-gold">{c.nombre}</span>
            </h2>
            <Link href={`/propiedades?zona=${c.slug}`} className="btn btn-ghost">
              Ver en el catálogo con filtros <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
          <div className={styles.rejillaPropiedades}>
            {c.propiedades.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 80}>
                <PropertyCard p={p} />
              </Reveal>
            ))}
          </div>
          <div className={styles.cierre}>
            <p>
              ¿Tienes una propiedad en {c.nombre}? Te decimos en cuánto venderla o rentarla.
            </p>
            <div className={styles.cierreBotones}>
              <Link href="/vender" className="btn btn-gold">
                Valora tu propiedad <span className="arrow" aria-hidden="true">→</span>
              </Link>
              <Link href="/colonias" className="btn btn-ghost">
                Otras colonias
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
