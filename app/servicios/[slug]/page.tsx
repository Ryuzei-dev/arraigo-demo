import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { servicios, getServicio } from "@/lib/servicios";
import styles from "./servicio.module.css";
import { IconoCheck } from "@/components/Iconos";

export function generateStaticParams() {
  return servicios.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getServicio(slug);
  if (!s) return { title: "Servicio no encontrado" };
  return {
    title: `${s.titulo} · Servicios`,
    description: s.resumen,
    alternates: { canonical: `/servicios/${s.slug}` },
    openGraph: {
      title: `${s.titulo} · Arraigo`,
      description: s.resumen,
      images: [{ url: s.imagen }],
    },
  };
}

export default async function ServicioDetalle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getServicio(slug);
  if (!s) notFound();

  const i = servicios.findIndex((x) => x.slug === s.slug);
  const prev = servicios[(i - 1 + servicios.length) % servicios.length];
  const next = servicios[(i + 1) % servicios.length];
  const otros = servicios.filter((x) => x.slug !== s.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.titulo,
    description: s.resumen,
    serviceType: s.titulo,
    provider: {
      "@type": "RealEstateAgent",
      name: "Arraigo",
      areaServed: "Uruapan, Michoacán",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className={styles.hero}>
        <div className="wrap">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Servicios", href: "/servicios" },
              { label: s.titulo },
            ]}
          />
          <div className={styles.heroLayout}>
            <div className={styles.heroText}>
              <span className={styles.serviceNum}>Servicio {s.n}</span>
              <h1 className={`display-l ${styles.title}`}>{s.titulo}</h1>
              <p className={styles.intro}>{s.intro}</p>
              <div className={styles.heroBtns}>
                <Link href="/contacto" className="btn btn-gold">
                  Solicitar este servicio <span className="arrow">→</span>
                </Link>
                <a
                  href={`https://wa.me/524520000000?text=${encodeURIComponent(
                    `Hola, me interesa el servicio de ${s.titulo}.`
                  )}`}
                  className="btn btn-ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
            <div className={styles.heroImg}>
              <Image
                src={s.imagen}
                alt={s.titulo}
                fill
                sizes="(max-width: 900px) 100vw, 520px"
                className={styles.img}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* DESCRIPCIÓN + BENEFICIOS */}
      <section className={`section ${styles.body}`}>
        <div className="wrap">
          <div className={styles.bodyGrid}>
            <div className={styles.desc}>
              {s.descripcion.map((p, idx) => (
                <Reveal key={idx} delay={idx * 60}>
                  <p className={styles.par}>{p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}>
              <div className={styles.beneficios}>
                <h3 className={styles.beneTitle}>Qué incluye</h3>
                <ul>
                  {s.beneficios.map((b) => (
                    <li key={b}>
                      <span className={styles.check}><IconoCheck /></span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className={`section on-light ${styles.proceso}`}>
        <div className="wrap">
          <Reveal>
            <h2 className="display-m" style={{ margin: "16px 0 56px" }}>
              Cómo trabajamos tu {s.titulo.toLowerCase()}, paso a paso
            </h2>
          </Reveal>
          <div className={styles.steps}>
            {s.proceso.map((p, idx) => (
              <Reveal key={p.t} delay={idx * 80}>
                <div className={styles.step}>
                  <span className={styles.stepN}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h4>{p.t}</h4>
                  <p>{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* OTROS SERVICIOS */}
      <section className={`section ${styles.otros}`}>
        <div className="wrap">
          <Reveal>
            <div className={styles.otrosHead}>
              <h2 className="display-m">Otros servicios</h2>
              <Link href="/servicios" className="btn btn-ghost">
                Ver todos <span className="arrow">→</span>
              </Link>
            </div>
          </Reveal>
          <div className={styles.otrosGrid}>
            {otros.map((o, idx) => (
              <Reveal key={o.slug} delay={(idx % 3) * 70}>
                <Link href={`/servicios/${o.slug}`} className={styles.otroCard}>
                  <span className={styles.otroN}>{o.n}</span>
                  <h3>{o.titulo}</h3>
                  <p>{o.resumen}</p>
                  <span className={styles.otroGo}>
                    Ver servicio <span className="arrow">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NAV ANTERIOR / SIGUIENTE */}
      <section className={styles.pager}>
        <div className="wrap">
          <div className={styles.pagerGrid}>
            <Link href={`/servicios/${prev.slug}`} className={styles.pagerItem}>
              <span className={styles.pagerLabel}>← Anterior</span>
              <span className={styles.pagerTitle}>{prev.titulo}</span>
            </Link>
            <Link
              href={`/servicios/${next.slug}`}
              className={`${styles.pagerItem} ${styles.pagerNext}`}
            >
              <span className={styles.pagerLabel}>Siguiente →</span>
              <span className={styles.pagerTitle}>{next.titulo}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section ${styles.cta}`}>
        <div className="wrap">
          <Reveal>
            <h2 className="display-l" style={{ maxWidth: "20ch", margin: "0 auto" }}>
              ¿Hablamos de tu <span className="italic-gold">{s.titulo.toLowerCase()}</span>?
            </h2>
            <div className={styles.ctaBtns}>
              <Link href="/contacto" className="btn btn-gold">
                Agenda una asesoría <span className="arrow">→</span>
              </Link>
              <Link href="/propiedades" className="btn btn-ghost">
                Ver propiedades
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
