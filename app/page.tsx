import Link from "next/link";
import Image from "next/image";
import ImageMarquee from "@/components/ImageMarquee";
import PropertyCarousel from "@/components/PropertyCarousel";
import Testimonials from "@/components/Testimonials";
import HeroBackground from "@/components/HeroBackground";
import Reveal from "@/components/Reveal";
import HomeSearch from "@/components/HomeSearch";
import type { Metadata } from "next";
import { getColonias, getPropiedades } from "@/lib/queries";
import styles from "./home.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const servicios = [
  {
    n: "01",
    t: "Compra",
    d: "Filtramos el mercado según tu zona y presupuesto, y negociamos el precio por ti.",
  },
  {
    n: "02",
    t: "Venta",
    d: "Avalúo, fotografía y promoción. Solo te llevamos visitas de compradores serios.",
  },
  {
    n: "03",
    t: "Renta",
    d: "Buscamos inquilinos confiables, hacemos el contrato y administramos la renta.",
  },
  {
    n: "04",
    t: "Asesoría",
    d: "Crédito hipotecario, avalúos y decisiones de inversión con números claros.",
  },
];

export default async function Home() {
  const [propiedades, colonias] = await Promise.all([getPropiedades(), getColonias()]);

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className={styles.hero}>
        <HeroBackground image="/fotos/portada.jpg" />
        <div className={styles.heroScrim} />
        <div className={styles.heroGrid} />

        <div className={`wrap ${styles.heroInner}`}>
          <span className={styles.sideLabel}>Inmobiliaria en Uruapan, Michoacán</span>

          <h1 className={`display-xl ${styles.heroTitle}`}>
            Compra, vende o renta en Uruapan con{" "}
            <span className="italic-gold">asesoría</span>.
          </h1>
          <p className={styles.heroLead}>
            La primera asesoría no tiene costo: te decimos cuánto vale tu
            inmueble o qué opciones hay con tu presupuesto. Cobramos comisión
            solo si la operación se concreta.
          </p>
          <div className={styles.heroBtns}>
            <Link href="/propiedades?operacion=venta" className="btn btn-gold">
              Ver en venta <span className="arrow">→</span>
            </Link>
            <Link href="/propiedades?operacion=renta" className="btn btn-ghost">
              Ver en renta
            </Link>
          </div>
          <HomeSearch zonas={colonias.map((c) => ({ slug: c.slug, nombre: c.nombre }))} />
        </div>

        <div className={styles.scroll}>
          <span>Desliza</span>
          <span className={styles.scrollLine} />
        </div>
      </section>

      <ImageMarquee />

      {/* ===================== MANIFIESTO ===================== */}
      <section className={`section ${styles.manifesto}`}>
        <div className="wrap">
          <Reveal delay={80}>
            <h2 className={`display-l ${styles.manifestoTitle}`}>
              Raíces firmes para{" "}
              <span className="italic-gold">tu patrimonio.</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className={styles.manifestoText}>
              Una casa suele ser la compra más grande de una familia. Por eso
              revisamos precio, papeles y condiciones antes de que firmes, y
              te acompañamos hasta la notaría y la entrega de llaves.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===================== PROPIEDADES (carrusel) ===================== */}
      <section className={`section ${styles.props}`} style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className={styles.propsHead}>
            <Reveal>
              <div>
                <h2 className="display-m" style={{ marginTop: 16 }}>
                  Propiedades disponibles
                </h2>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <Link href="/propiedades" className="btn btn-ghost">
                Ver todo el catálogo <span className="arrow">→</span>
              </Link>
            </Reveal>
          </div>
        </div>
        <div className={styles.carouselWrap}>
          <PropertyCarousel items={propiedades} />
        </div>
      </section>

      {/* ===================== SERVICIOS ===================== */}
      <section className={`section on-light ${styles.serv}`}>
        <div className="wrap">
          <div className={styles.servHead}>
            <Reveal delay={80}>
              <h2 className="display-l" style={{ marginTop: 18, maxWidth: "14ch" }}>
                Lo que hacemos <span className="italic-gold">por ti</span>.
              </h2>
            </Reveal>
          </div>

          <div className={styles.servGrid}>
            {servicios.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div className={styles.servItem}>
                  <span className={styles.servN}>{s.n}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className={styles.servCta}>
              <Link href="/servicios" className="btn btn-primary">
                Conoce todos los servicios <span className="arrow">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== TESTIMONIOS ===================== */}
      <section className={`section ${styles.testi}`}>
        <div className="wrap">
          <div className={styles.testiHead}>
            <Reveal delay={80}>
              <h2 className="display-m" style={{ marginTop: 16 }}>
                Lo que dicen quienes<br />
                ya nos <span className="italic-gold">eligieron</span>
              </h2>
            </Reveal>
          </div>
        </div>
        <div className={styles.carouselWrap}>
          <Testimonials />
        </div>
      </section>

    </>
  );
}
