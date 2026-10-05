import Link from "next/link";
import type { Metadata } from "next";
import HeroPagina from "@/components/HeroPagina";
import { getColonias } from "@/lib/queries";
import { formatoMoneda } from "@/lib/properties";
import { getServicio } from "@/lib/servicios";
import VenderForm from "./VenderForm";
import styles from "./vender.module.css";

export const metadata: Metadata = {
  title: "¿Cuánto vale tu propiedad? Vende o renta con nosotros",
  description:
    "Vende o renta tu casa, departamento, terreno o local en Uruapan. Asesoría inicial sin costo, avalúo comercial y comisión solo al concretar.",
  alternates: { canonical: "/vender" },
};

const razones = [
  {
    t: "Asesoría sin costo",
    d: "La asesoría inicial es sin costo ni compromiso. Escuchamos tu objetivo y te proponemos una estrategia.",
  },
  {
    t: "Avalúo comercial",
    d: "Definimos el precio con un avalúo comercial realista, sustentado en datos del mercado.",
  },
  {
    t: "Comisión solo al concretar",
    d: "Solo se genera una comisión cuando concretamos la operación.",
  },
];

export default async function VenderPage({
  searchParams,
}: {
  searchParams: Promise<{ operacion?: string }>;
}) {
  const sp = await searchParams;
  const operacionInicial = sp.operacion === "rentar" ? "rentar" : "vender";
  const venta = getServicio("venta-de-propiedades");
  const colonias = (await getColonias()).filter((c) => c.m2Venta);

  return (
    <>
      <HeroPagina
        migas={[{ label: "Inicio", href: "/" }, { label: "Vender" }]}
        titulo={
          <>
            ¿Cuánto vale tu <span className="italic-gold">propiedad</span>?
          </>
        }
        entrada="Cuéntanos de tu casa, departamento, terreno o local. Te decimos en cuánto venderla o rentarla y cómo la promoveríamos, sin compromiso."
      />

      <section className={`section ${styles.cuerpo}`}>
        <div className="wrap">
          <div className={styles.layout}>
            <div className={styles.info}>
              <ul className={styles.razones}>
                {razones.map((r) => (
                  <li key={r.t}>
                    <h2>{r.t}</h2>
                    <p>{r.d}</p>
                  </li>
                ))}
              </ul>

              {venta && (
                <div className={styles.proceso}>
                  <h2 className={styles.subtitulo}>Cómo vendemos</h2>
                  <ol>
                    {venta.proceso.map((p) => (
                      <li key={p.t}>
                        <strong>{p.t}.</strong> {p.d}
                      </li>
                    ))}
                  </ol>
                  <p className={styles.enlaces}>
                    <Link href="/servicios/venta-de-propiedades">Venta de propiedades</Link>
                    <Link href="/servicios/renta-y-administracion">Renta y administración</Link>
                  </p>
                </div>
              )}
            </div>

            <div id="formulario">
                <h2 className={styles.formTitulo}>Datos de tu propiedad</h2>
                <VenderForm operacionInicial={operacionInicial} />
            </div>
          </div>
        </div>
      </section>

      {colonias.length > 0 && (
        <section className={`section on-light ${styles.referencia}`}>
          <div className="wrap">
            <h2 className="display-m" style={{ marginBottom: 18 }}>
              Precio promedio por m² en nuestro <span className="italic-gold">catálogo</span>
            </h2>
            <p className={styles.aviso}>
              Referencia calculada solo con las propiedades en venta que publicamos hoy en cada colonia
              (precio entre m² de construcción o, si no hay, de terreno). No es un avalúo: el valor de
              tu inmueble depende de su estado, ubicación exacta y características.
            </p>
            <div className={styles.tablaWrap}>
              <table className={styles.tabla}>
                <caption className={styles.srOnly}>Precio promedio por m² de venta por colonia, según el catálogo</caption>
                <thead>
                  <tr>
                    <th scope="col">Colonia</th>
                    <th scope="col">Propiedades en venta</th>
                    <th scope="col">Promedio por m²</th>
                  </tr>
                </thead>
                <tbody>
                  {colonias.map((c) => (
                    <tr key={c.slug}>
                      <th scope="row">
                        <Link href={`/colonias/${c.slug}`}>{c.nombre}</Link>
                      </th>
                      <td>{c.venta}</td>
                      <td>{formatoMoneda(c.m2Venta!)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.masColonias}>
              <Link href="/colonias">Ver todas las colonias del catálogo</Link>
            </p>
          </div>
        </section>
      )}
    </>
  );
}
