import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import HeroPagina from "@/components/HeroPagina";
import PropertyCard from "@/components/PropertyCard";
import Reveal from "@/components/Reveal";
import { IconoTelefono, IconoWhatsapp } from "@/components/IconosContacto";
import { asesores, getAsesor, whatsappAsesor } from "@/lib/asesores";
import { getPropiedades } from "@/lib/queries";
import styles from "../asesores.module.css";

export function generateStaticParams() {
  return asesores.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getAsesor(slug);
  if (!a) return { title: "Asesor no encontrado" };
  return {
    title: `${a.nombre}, ${a.rol.toLowerCase()}`,
    description: `${a.nombre}, ${a.rol.toLowerCase()} en Arraigo. ${a.bio}`,
    alternates: { canonical: `/asesores/${a.slug}` },
  };
}

export default async function AsesorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getAsesor(slug);
  if (!a) notFound();

  const propiedades = (await getPropiedades()).filter((p) => p.asesor === a.slug);
  const [nombreCorto, ...apellidos] = a.nombre.split(" ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: a.nombre,
    jobTitle: a.rol,
    description: a.bio,
    telephone: `+${a.telefono}`,
    email: a.correo,
    url: `https://arraigo-demo.vercel.app/asesores/${a.slug}`,
    worksFor: { "@id": "https://arraigo-demo.vercel.app/#organization" },
    areaServed: a.zonas.map((z) => ({ "@type": "Place", name: `${z}, Uruapan` })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroPagina
        compacta
        migas={[
          { label: "Inicio", href: "/" },
          { label: "Asesores", href: "/asesores" },
          { label: a.nombre },
        ]}
        titulo={
          <span className={styles.tituloPerfil}>
            <span className={styles.avatarGrande} aria-hidden="true">
              {a.iniciales}
            </span>
            <span>
              {nombreCorto} <span className="italic-gold">{apellidos.join(" ")}</span>
            </span>
          </span>
        }
        entrada={a.bio}
      >
        <div className={styles.perfilAcciones}>
          <a
            href={whatsappAsesor(a, `Hola ${nombreCorto}, quiero asesoría inmobiliaria.`)}
            className="btn btn-gold"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconoWhatsapp /> Escribir a {nombreCorto}
          </a>
          <a href={`tel:+${a.telefono}`} className="btn btn-ghost">
            <IconoTelefono /> {a.telefonoVisible}
          </a>
        </div>
      </HeroPagina>

      <section className={styles.ficha}>
        <div className="wrap">
          <dl className={styles.fichaDatos}>
            <div>
              <dt>Rol</dt>
              <dd>{a.rol}</dd>
            </div>
            <div>
              <dt>Especialidad</dt>
              <dd>{a.especialidad}</dd>
            </div>
            <div>
              <dt>Zonas que atiende</dt>
              <dd>{a.zonas.join(", ")}</dd>
            </div>
            <div>
              <dt>Correo</dt>
              <dd>
                <a href={`mailto:${a.correo}`}>{a.correo}</a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={`section ${styles.propiedades}`}>
        <div className="wrap">
          <h2 className="display-m" style={{ marginBottom: 40 }}>
            Propiedades que <span className="italic-gold">atiende</span>
          </h2>
          {propiedades.length ? (
            <div className={styles.rejilla}>
              {propiedades.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 80}>
                  <PropertyCard p={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className={styles.vacio}>
              Por ahora {nombreCorto} no tiene propiedades publicadas.{" "}
              <Link href="/propiedades">Ve todo el catálogo</Link>.
            </p>
          )}
          <p className={styles.nota}>
            <Link href="/asesores">Conoce al resto del equipo</Link>
          </p>
        </div>
      </section>
    </>
  );
}
