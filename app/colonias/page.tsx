import Link from "next/link";
import type { Metadata } from "next";
import HeroPagina from "@/components/HeroPagina";
import Reveal from "@/components/Reveal";
import { formatoMoneda } from "@/lib/properties";
import { getColoniasDetalle, textoRango } from "./datos";
import styles from "./colonias.module.css";

export const metadata: Metadata = {
  title: "Colonias de Uruapan con propiedades",
  description:
    "Las colonias de Uruapan donde tenemos casas, departamentos, terrenos y locales en venta y renta, con rangos de precio según nuestro catálogo.",
  alternates: { canonical: "/colonias" },
};

export default async function ColoniasPage() {
  const colonias = await getColoniasDetalle();

  return (
    <>
      <HeroPagina
        migas={[{ label: "Inicio", href: "/" }, { label: "Colonias" }]}
        titulo={
          <>
            Busca por <span className="italic-gold">colonia</span>.
          </>
        }
        entrada="Las colonias donde hoy tenemos propiedades publicadas, con precios según las propiedades de nuestro catálogo."
      />

      <section className={`section ${styles.lista}`}>
        <div className="wrap">
          {colonias.length === 0 ? (
            <p className={styles.vacio}>
              Por ahora no hay propiedades publicadas. <Link href="/contacto">Cuéntanos qué buscas</Link>.
            </p>
          ) : (
            <ul className={styles.rejilla}>
              {colonias.map((c, i) => (
                <li key={c.slug}>
                  <Reveal delay={(i % 3) * 70}>
                    <Link href={`/colonias/${c.slug}`} className={styles.colonia}>
                      <h2>{c.nombre}</h2>
                      <p className={styles.conteo}>
                        {c.total} {c.total === 1 ? "propiedad" : "propiedades"}: {c.venta} en venta y {c.renta} en
                        renta
                      </p>
                      <dl className={styles.datos}>
                        {c.rangoVenta && (
                          <div>
                            <dt>Venta</dt>
                            <dd>{textoRango(c.rangoVenta)}</dd>
                          </div>
                        )}
                        {c.rangoRenta && (
                          <div>
                            <dt>Renta</dt>
                            <dd>{textoRango(c.rangoRenta, true)}</dd>
                          </div>
                        )}
                        {c.m2Venta && (
                          <div>
                            <dt>Promedio por m² en venta</dt>
                            <dd>{formatoMoneda(c.m2Venta)}</dd>
                          </div>
                        )}
                      </dl>
                      <span className={styles.ir}>
                        Ver propiedades <span className="arrow" aria-hidden="true">→</span>
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
          <p className={styles.aviso}>
            Datos según las propiedades de nuestro catálogo, no del mercado completo de cada colonia. El
            promedio por m² divide el precio de venta entre los m² de construcción o, si no hay, de terreno.
            No es un avalúo.
          </p>
        </div>
      </section>
    </>
  );
}
