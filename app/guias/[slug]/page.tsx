import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import HeroPagina from "@/components/HeroPagina";
import { getGuia, guias } from "@/lib/guias";
import styles from "../guias.module.css";

export function generateStaticParams() {
  return guias.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuia(slug);
  if (!g) return { title: "Guía no encontrada" };
  return {
    title: g.titulo,
    description: g.resumen,
    alternates: { canonical: `/guias/${g.slug}` },
    openGraph: { type: "article", title: g.titulo, description: g.resumen },
  };
}

function fechaLegible(iso: string) {
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso)
  );
}

export default async function GuiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuia(slug);
  if (!g) notFound();

  const otras = guias.filter((x) => x.slug !== g.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.titulo,
    description: g.resumen,
    dateModified: g.revisada,
    datePublished: g.revisada,
    inLanguage: "es-MX",
    mainEntityOfPage: `https://arraigo-demo.vercel.app/guias/${g.slug}`,
    author: { "@id": "https://arraigo-demo.vercel.app/#organization" },
    publisher: { "@id": "https://arraigo-demo.vercel.app/#organization" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroPagina
        compacta
        migas={[
          { label: "Inicio", href: "/" },
          { label: "Guías", href: "/guias" },
          { label: g.titulo },
        ]}
        titulo={g.titulo}
        entrada={g.resumen}
      >
        <p className={styles.meta}>
          Revisada el <time dateTime={g.revisada}>{fechaLegible(g.revisada)}</time>. Información general, no sustituye
          la asesoría de tu notaría o institución.
        </p>
      </HeroPagina>

      <article className={`section ${styles.articulo}`}>
        <div className="wrap">
          <div className={styles.columnas}>
            <nav className={styles.contenido} aria-label="Contenido de la guía">
              <h2>En esta guía</h2>
              <ol>
                {g.secciones.map((s, i) => (
                  <li key={s.titulo}>
                    <a href={`#seccion-${i + 1}`}>{s.titulo}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className={styles.texto}>
              {g.secciones.map((s, i) => (
                <section key={s.titulo} id={`seccion-${i + 1}`} className={styles.seccion}>
                  <h2>{s.titulo}</h2>
                  {s.parrafos.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                  {s.lista && (
                    <ul>
                      {s.lista.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              <aside className={styles.cta} aria-label="Siguiente paso">
                <p>{g.cta.texto}</p>
                <div className={styles.ctaBotones}>
                  <Link href={g.cta.href} className="btn btn-gold">
                    {g.cta.boton} <span className="arrow" aria-hidden="true">→</span>
                  </Link>
                  <a
                    href={`https://wa.me/524520000000?text=${encodeURIComponent(`Hola, leí la guía "${g.titulo}" y tengo una duda.`)}`}
                    className="btn btn-ghost"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pregúntanos por WhatsApp
                  </a>
                </div>
              </aside>
            </div>
          </div>

          <div className={styles.otras}>
            <h2>Otras guías</h2>
            <ul>
              {otras.map((o) => (
                <li key={o.slug}>
                  <Link href={`/guias/${o.slug}`}>
                    {o.titulo} <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </>
  );
}
