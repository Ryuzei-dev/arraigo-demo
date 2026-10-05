import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Gallery from "@/components/Gallery";
import PropertyMap from "@/components/PropertyMap";
import PropertyCard from "@/components/PropertyCard";
import AccionesFicha from "@/components/ficha/AccionesFicha";
import AsesorFicha from "@/components/ficha/AsesorFicha";
import ContactoFicha from "@/components/ficha/ContactoFicha";
import CalculadoraCredito from "@/components/ficha/CalculadoraCredito";
import TourVirtual from "@/components/ficha/TourVirtual";
import RegistrarVisto from "@/components/ficha/RegistrarVisto";
import {
  etiquetaEstado,
  formatoMoneda,
  formatoPrecio,
  precioM2,
} from "@/lib/properties";
import { getAsesor, whatsappAsesor, type Asesor } from "@/lib/asesores";
import { getPropiedad, getPropiedades } from "@/lib/queries";
import styles from "./detalle.module.css";

export const dynamicParams = true;

/** Si la propiedad no tiene asesor válido, el contacto va a la línea general */
const ASESOR_GENERAL: Asesor = {
  slug: "",
  nombre: "Equipo Arraigo",
  iniciales: "A",
  rol: "Asesoría inmobiliaria",
  especialidad: "Compra, venta y renta",
  telefono: "524520000000",
  telefonoVisible: "(452) 000 0000",
  correo: "",
  bio: "",
  zonas: [],
};

export async function generateStaticParams() {
  const props = await getPropiedades();
  return props.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPropiedad(slug);
  if (!p) return { title: "Propiedad no encontrada" };
  return {
    title: p.titulo,
    description: p.resumen,
    alternates: { canonical: `/propiedades/${p.slug}` },
    openGraph: {
      type: "article",
      title: p.titulo,
      description: p.resumen,
      images: [{ url: p.imagenes[0] }],
    },
  };
}

export default async function PropiedadDetalle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getPropiedad(slug);
  if (!p) notFound();

  const todas = await getPropiedades();
  const relacionadas = todas
    .filter((x) => x.slug !== p.slug && x.categoria === p.categoria)
    .slice(0, 3);
  const fallback = todas.filter((x) => x.slug !== p.slug).slice(0, 3);
  const similares = relacionadas.length ? relacionadas : fallback;

  const asesor = getAsesor(p.asesor) ?? ASESOR_GENERAL;
  const primerNombre = asesor.nombre.split(" ")[0];
  const esVenta = p.operacion === "venta";
  const m2 = esVenta ? precioM2(p) : undefined;
  const rebajada =
    p.estado === "rebajada" && p.precioAnterior != null && p.precioAnterior > p.precio;

  const url = `https://arraigo-demo.vercel.app/propiedades/${p.slug}`;
  const waAsesor = whatsappAsesor(
    asesor,
    `Hola ${primerNombre}, me interesa ${p.titulo} (${url})`
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    "@id": url,
    url,
    name: p.titulo,
    description: p.resumen,
    image: p.imagenes,
    ...(p.recamaras != null ? { numberOfRooms: p.recamaras } : {}),
    ...(p.m2Construccion != null
      ? {
          floorSize: {
            "@type": "QuantitativeValue",
            value: p.m2Construccion,
            unitCode: "MTK",
          },
        }
      : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: p.colonia,
      addressLocality: "Uruapan",
      addressRegion: "Michoacán",
      addressCountry: "MX",
    },
    ...(p.lat != null && p.lng != null
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: p.lat,
            longitude: p.lng,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      price: p.precio,
      priceCurrency: p.moneda,
      availability: "https://schema.org/InStock",
      businessFunction:
        p.operacion === "renta"
          ? "http://purl.org/goodrelations/v1#LeaseOut"
          : "http://purl.org/goodrelations/v1#Sell",
    },
  };

  const specs = [
    p.recamaras != null && { k: "Recámaras", v: p.recamaras },
    p.banos != null && { k: "Baños", v: p.banos },
    p.estacionamientos != null && {
      k: "Estacionamiento",
      v: p.estacionamientos,
    },
    p.m2Construccion != null && { k: "Construcción", v: `${p.m2Construccion} m²` },
    p.m2Terreno != null && { k: "Terreno", v: `${p.m2Terreno} m²` },
  ].filter(Boolean) as { k: string; v: string | number }[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RegistrarVisto slug={p.slug} />

      <div className={styles.top}>
        <div className="wrap">
          <nav className={styles.crumbs} aria-label="Ruta de navegación">
            <Link href="/">Inicio</Link>
            <span aria-hidden="true">/</span>
            <Link href="/propiedades">Propiedades</Link>
            <span aria-hidden="true">/</span>
            <span className={styles.crumbCurrent} aria-current="page">
              {p.titulo}
            </span>
          </nav>

          <div className={styles.header}>
            <div className={styles.headerTexto}>
              <span className={styles.op} data-op={p.operacion}>
                {esVenta ? "En venta" : "En renta"} · {p.categoria}
              </span>
              <h1 className={`display-l ${styles.title}`}>{p.titulo}</h1>
              <p className={styles.loc}>
                {p.colonia} · {p.ubicacion}
              </p>
            </div>
            <div className={styles.priceBox}>
              <div className={styles.priceTop}>
                <span className={styles.priceLabel}>Precio</span>
                {p.estado && (
                  <span className={styles.estado} data-estado={p.estado}>
                    {etiquetaEstado[p.estado]}
                  </span>
                )}
              </div>
              {rebajada && (
                <span className={styles.precioAnterior}>
                  <span className={styles.srOnly}>Precio anterior: </span>
                  <s>
                    {formatoMoneda(p.precioAnterior!, p.moneda)}
                    {esVenta ? "" : " / mes"}
                  </s>
                </span>
              )}
              <span className={styles.price}>
                {rebajada && <span className={styles.srOnly}>Precio actual: </span>}
                {formatoPrecio(p)}
              </span>
              {m2 != null && (
                <span className={styles.precioM2}>
                  {formatoMoneda(m2, p.moneda)} por m²
                </span>
              )}
            </div>
          </div>

          <AccionesFicha slug={p.slug} titulo={p.titulo} />
        </div>
      </div>

      {/* Galería */}
      <section className={styles.gallery} aria-label="Fotos">
        <div className="wrap">
          <Gallery images={p.imagenes} title={p.titulo} />
        </div>
      </section>

      {/* Cuerpo */}
      <section className={`section ${styles.body}`}>
        <div className="wrap">
          <div className={styles.layout}>
            <div className={styles.main}>
              <Reveal>
                <h2 className={`display-m ${styles.sobre}`}>Sobre esta propiedad</h2>
              </Reveal>
              {p.descripcion.map((par, i) => (
                <Reveal key={i} delay={i * 60}>
                  <p className={styles.par}>{par}</p>
                </Reveal>
              ))}

              <Reveal>
                <div className={styles.specGrid}>
                  {specs.map((s) => (
                    <div key={s.k} className={styles.spec}>
                      <span className={styles.specV}>{s.v}</span>
                      <span className={styles.specK}>{s.k}</span>
                    </div>
                  ))}
                </div>
              </Reveal>

              {p.amenidades.length > 0 && (
                <Reveal>
                  <h3 className={styles.amenTitle}>Amenidades</h3>
                  <ul className={styles.amenities}>
                    {p.amenidades.map((a) => (
                      <li key={a}>
                        <span className={styles.amenDot} aria-hidden="true">✦</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}

              {esVenta && (
                <div className={styles.bloque}>
                  <h3 className={styles.amenTitle}>Calcula tu crédito</h3>
                  <p className={styles.bloqueTexto}>
                    Mueve el enganche, el plazo y la tasa para ver una mensualidad aproximada.
                  </p>
                  <CalculadoraCredito precioInicial={p.precio} moneda={p.moneda} />
                </div>
              )}

              {p.tourUrl && (
                <div className={styles.bloque}>
                  <h3 className={styles.amenTitle}>Recorrido virtual</h3>
                  <TourVirtual
                    url={p.tourUrl}
                    titulo={p.titulo}
                    poster={p.imagenes[1] ?? p.imagenes[0]}
                    slug={p.slug}
                  />
                </div>
              )}

              <div className={`${styles.bloque} ${styles.ubicacion}`}>
                <h3 className={styles.amenTitle}>Ubicación</h3>
                {p.lat != null && p.lng != null ? (
                  <PropertyMap
                    lat={p.lat}
                    lng={p.lng}
                    colonia={p.colonia}
                    ubicacion={p.ubicacion}
                    titulo={p.titulo}
                  />
                ) : (
                  <div className={styles.map}>
                    <div className={styles.mapPin} aria-hidden="true">◈</div>
                    <div>
                      <strong>{p.colonia}</strong>
                      <span>{p.ubicacion}</span>
                    </div>
                    <span className={styles.mapNote}>
                      Ubicación aproximada · se comparte exacta en la visita
                    </span>
                  </div>
                )}
              </div>

              {/* Solo en la ficha impresa */}
              <div className={styles.soloImpresion}>
                <p>
                  <strong>Asesor:</strong> {asesor.nombre} · {asesor.telefonoVisible}
                </p>
                <p>
                  <strong>Ubicación:</strong> {p.colonia}, {p.ubicacion}
                </p>
                <p className={styles.impresionUrl}>{url}</p>
              </div>
            </div>

            {/* Aside: asesor asignado, visita y mensaje */}
            <aside className={styles.aside} aria-label="Contacto con el asesor">
              <AsesorFicha asesor={asesor} titulo={p.titulo} url={url} />
              <ContactoFicha
                slug={p.slug}
                titulo={p.titulo}
                url={url}
                operacion={p.operacion}
                categoria={p.categoria}
                asesorNombre={asesor.nombre}
                asesorTelefono={asesor.telefono}
              />
            </aside>
          </div>
        </div>
      </section>

      {/* Barra fija en celular: precio y WhatsApp al asesor siempre a la mano */}
      <div className={styles.barraMovil} data-barra-ficha>
        <span className={styles.barraPrecio}>{formatoPrecio(p)}</span>
        <a
          href={waAsesor}
          className="btn btn-gold"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`WhatsApp a ${asesor.nombre}`}
        >
          WhatsApp
        </a>
      </div>

      {/* Similares */}
      <section className={`section ${styles.similar}`}>
        <div className="wrap">
          <h2 className="display-m" style={{ marginBottom: 44 }}>
            Propiedades similares
          </h2>
          <div className={styles.similarGrid}>
            {similares.map((sp, i) => (
              <PropertyCard key={sp.slug} p={sp} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
