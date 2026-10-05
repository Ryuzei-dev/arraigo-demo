import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import styles from "./nosotros.module.css";
import { IconoCheck } from "@/components/Iconos";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Arraigo: asesoría inmobiliaria con seriedad, transparencia y acompañamiento personalizado en Uruapan, Michoacán.",
  alternates: { canonical: "/nosotros" },
};

const valores = [
  {
    t: "Te decimos el precio real",
    d: "Te decimos lo que necesitas saber del precio y del inmueble, aunque no sea lo que esperabas oír.",
  },
  {
    t: "Un asesor que te responde",
    d: "Un asesor asignado que responde, acompaña y da la cara en cada etapa de tu operación.",
  },
  {
    t: "Criterio local para valuar",
    d: "Conocemos las colonias, los precios y las notarías de Uruapan. Eso nos da criterio para valuar y negociar.",
  },
  {
    t: "Tus datos, en reserva",
    d: "Manejamos patrimonio y datos con la reserva y el cuidado que merecen.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className="wrap">
          <h1 className={`display-xl ${styles.title}`}>
            Una inmobiliaria de Uruapan<br />
            que revisa <span className="italic-gold">antes de vender</span>.
          </h1>
          <p className={styles.lead}>
            Arraigo nació para que comprar, vender o rentar en Uruapan sea un
            proceso claro: precios explicados, papeles revisados y un asesor que
            responde.
          </p>
        </div>
      </section>

      <section className={`section ${styles.story}`}>
        <div className="wrap">
          <div className={styles.storyGrid}>
            <Reveal>
              <div className={styles.storyImg}>
                <Image
                  src="/fotos/nosotros.jpg"
                  alt="Recepción con banca de madera, plantas y muro de piedra"
                  fill
                  sizes="(max-width: 900px) 100vw, 560px"
                  className={styles.img}
                />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className={styles.storyText}>
                <h2 className="display-m" style={{ margin: "18px 0 24px" }}>
                  Conocemos las colonias, los precios<br />
                  y las <span className="italic-gold">notarías de Uruapan.</span>
                </h2>
                <p>
                  Somos una inmobiliaria de Uruapan, Michoacán, especializada en
                  asesorar a familias e inversionistas en cada decisión sobre su
                  patrimonio. Conocemos el mercado local a fondo y trabajamos con
                  la seriedad que exige mover algo tan importante como un hogar o
                  una inversión.
                </p>
                <p>
                  Nuestro compromiso es simple: acompañarte con transparencia,
                  darte información honesta y estar presentes hasta que la última
                  firma esté puesta. Así hemos construido la confianza de quienes
                  ya nos eligieron.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={`section on-light ${styles.values}`}>
        <div className="wrap">
          <Reveal>
            <h2 className="display-l" style={{ margin: "18px 0 60px", maxWidth: "18ch" }}>
              Cuatro compromisos que puedes <span className="italic-gold">exigirnos</span>.
            </h2>
          </Reveal>
          <div className={styles.valuesGrid}>
            {valores.map((v, i) => (
              <Reveal key={v.t} delay={i * 80}>
                <div className={styles.value}>
                  <span className={styles.valueMark}><IconoCheck /></span>
                  <h3>{v.t}</h3>
                  <p>{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.quote}`}>
        <div className="wrap">
          <Reveal>
            <blockquote>
              “Trabajamos para que cada cliente tome la mejor decisión de su vida
              con la tranquilidad de estar bien asesorado.”
            </blockquote>
            <cite>Equipo de Arraigo</cite>
            <div className={styles.quoteBtns}>
              <Link href="/contacto" className="btn btn-gold">
                Conócenos en persona <span className="arrow">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
