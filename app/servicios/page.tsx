import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Faq from "@/components/Faq";
import { servicios } from "@/lib/servicios";
import styles from "./servicios.module.css";
import { IconoCheck } from "@/components/Iconos";

export const metadata: Metadata = {
  title: "Servicios inmobiliarios",
  description:
    "Asesoría en compra, venta y renta de inmuebles, avalúos, gestión de créditos y administración de propiedades en Uruapan, Michoacán.",
  alternates: { canonical: "/servicios" },
};

const pasos = [
  { n: "01", t: "Escuchamos", d: "Entendemos tu objetivo, tu presupuesto y tus tiempos." },
  { n: "02", t: "Proponemos", d: "Diseñamos una estrategia y opciones concretas a tu medida." },
  { n: "03", t: "Negociamos", d: "Cuidamos tus intereses en cada punto de la operación." },
  { n: "04", t: "Cerramos", d: "Acompañamos trámites, notaría y entrega hasta el final." },
];

export default function ServiciosPage() {
  return (
    <>
      <section className={styles.head}>
        <div className={styles.headGrid} />
        <div className="wrap">
          <h1 className={`display-xl ${styles.title}`}>
            De la primera visita<br />
            a la <span className="italic-gold">notaría</span>.
          </h1>
          <p className={styles.sub}>
            Compra, venta, renta, avalúo y crédito con el mismo asesor, de
            principio a fin.
          </p>
        </div>
      </section>

      <section className={`section ${styles.grid}`}>
        <div className="wrap">
          <div className={styles.cards}>
            {servicios.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 80}>
                <Link href={`/servicios/${s.slug}`} className={styles.card}>
                  <span className={styles.cardN}>{s.n}</span>
                  <h3>{s.titulo}</h3>
                  <p>{s.resumen}</p>
                  <ul>
                    {s.beneficios.slice(0, 3).map((it) => (
                      <li key={it}>
                        <span><IconoCheck /></span>
                        {it}
                      </li>
                    ))}
                  </ul>
                  <span className={styles.cardGo}>
                    Ver servicio <span className="arrow">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={`section on-light ${styles.process}`}>
        <div className="wrap">
          <Reveal>
            <h2 className="display-l" style={{ margin: "18px 0 60px", maxWidth: "16ch" }}>
              Un proceso <span className="italic-gold">claro</span>, sin sorpresas.
            </h2>
          </Reveal>
          <div className={styles.steps}>
            {pasos.map((p, i) => (
              <Reveal key={p.n} delay={i * 90}>
                <div className={styles.step}>
                  <span className={styles.stepN}>{p.n}</span>
                  <h4>{p.t}</h4>
                  <p>{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.faq}`}>
        <div className="wrap">
          <Reveal>
            <h2 className="display-m" style={{ margin: "16px 0 44px" }}>
              Antes de empezar
            </h2>
          </Reveal>
          <Reveal>
            <Faq />
          </Reveal>
        </div>
      </section>

    </>
  );
}
