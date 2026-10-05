import Link from "next/link";
import type { Metadata } from "next";
import HeroPagina from "@/components/HeroPagina";
import Reveal from "@/components/Reveal";
import { guias } from "@/lib/guias";
import styles from "./guias.module.css";

export const metadata: Metadata = {
  title: "Guías para comprar, vender y rentar",
  description:
    "Guías prácticas para comprar casa en México: papeles que necesitas, cómo usar tu crédito Infonavit o Fovissste y cómo rentar tu propiedad sin sorpresas.",
  alternates: { canonical: "/guias" },
};

export default function GuiasPage() {
  return (
    <>
      <HeroPagina
        migas={[{ label: "Inicio", href: "/" }, { label: "Guías" }]}
        titulo={
          <>
            Lo que conviene saber <span className="italic-gold">antes</span>.
          </>
        }
        entrada="Guías cortas y prácticas sobre los trámites que más dudas generan. Información general: para tu caso, pregúntanos."
      />

      <section className={`section ${styles.indice}`}>
        <div className="wrap">
          <ol className={styles.lista}>
            {guias.map((g, i) => (
              <li key={g.slug}>
                <Reveal delay={i * 70}>
                  <Link href={`/guias/${g.slug}`} className={styles.guia}>
                    <span className={styles.numero} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.guiaTexto}>
                      <h2>{g.titulo}</h2>
                      <p>{g.resumen}</p>
                      <span className={styles.para}>{g.para}</span>
                    </span>
                    <span className={styles.flecha} aria-hidden="true">
                      →
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
