import Link from "next/link";
import type { Metadata } from "next";
import HeroPagina from "@/components/HeroPagina";
import { categoriasFaq, todasLasFaqs } from "@/lib/content";
import BuscadorPreguntas from "./BuscadorPreguntas";
import styles from "./preguntas.module.css";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Respuestas sobre comprar, vender y rentar con Arraigo en Uruapan: costos de la asesoría, documentos, crédito Infonavit y Fovissste, tiempos y horario.",
  alternates: { canonical: "/preguntas" },
};

export default function PreguntasPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: todasLasFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroPagina
        migas={[{ label: "Inicio", href: "/" }, { label: "Preguntas frecuentes" }]}
        titulo={
          <>
            Preguntas <span className="italic-gold">frecuentes</span>.
          </>
        }
        entrada="Lo que más nos preguntan sobre comprar, vender, rentar y el crédito. Si no encuentras tu duda, escríbenos."
      />

      <section className={`section ${styles.cuerpo}`}>
        <div className="wrap">
          <BuscadorPreguntas faqs={todasLasFaqs} categorias={categoriasFaq} />
          <div className={styles.cierre}>
            <p>¿No encontraste tu respuesta?</p>
            <div className={styles.cierreBotones}>
              <a
                href={`https://wa.me/524520000000?text=${encodeURIComponent("Hola, tengo una pregunta.")}`}
                className="btn btn-gold"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pregúntanos por WhatsApp
              </a>
              <Link href="/guias" className="btn btn-ghost">
                Leer las guías
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
