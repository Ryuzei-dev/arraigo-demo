import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getColonias, getPropiedades } from "@/lib/queries";
import { formatoPrecio, formatoMoneda, superficie } from "@/lib/properties";
import InicioVivo from "./InicioVivo";
import styles from "./home.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/*
 * Inicio con la identidad "Arena": hero sobre foto, declaración que se enciende con el scroll,
 * carril de propiedades con filtro, "lo que de verdad compras", proceso con número fijo en
 * oscuro, preguntas y colonias con su precio por m². El cierre lo pone el pie del sitio.
 */

const compras = [
  { t: "Papeles en orden, antes de la primera visita", d: "Escrituras, predial y libertad de gravamen revisados.", foto: "/fotos/compra.jpg" },
  { t: "Un precio que se sostiene", d: "Comparado contra ventas reales de la misma colonia.", foto: "/fotos/avaluos.jpg" },
  { t: "Condiciones por escrito", d: "Lo que se acuerda queda en papel, no en una llamada.", foto: "/fotos/interiores.jpg" },
  { t: "Alguien contigo en la notaría", d: "Hasta la firma y la entrega de llaves.", foto: "/fotos/patios.jpg" },
];

const pasos = [
  { t: "Escuchamos", d: "Qué buscas, cuánto puedes invertir y para cuándo lo necesitas. Si vendes, cuánto vale de verdad tu propiedad hoy.", a: "1 reunión", b: "sin costo" },
  { t: "Filtramos", d: "Solo te mostramos lo que cumple y tiene papeles en orden. Menos visitas, mejores visitas.", a: "Papeles", b: "revisados antes" },
  { t: "Negociamos", d: "Precio y condiciones por escrito, sin presión. Tú decides con la información completa.", a: "Por escrito", b: "cada acuerdo" },
  { t: "Firmamos", d: "Te acompañamos con el crédito, el notario y la entrega. Cobramos comisión solo si se concreta.", a: "Comisión", b: "solo al cerrar" },
];

const preguntas = [
  ["¿Cuánto cobran?", "La primera asesoría no tiene costo. Cobramos comisión solo cuando la operación se concreta, y el porcentaje queda por escrito desde el inicio."],
  ["¿Me ayudan con el crédito?", "Sí. Precalificamos y comparamos opciones de bancos, Infonavit y Fovissste antes de que elijas."],
  ["¿Cuánto tarda una compra?", "De contado, unas semanas. Con crédito, de uno a tres meses según el banco y los papeles."],
  ["¿Qué necesito para vender?", "Escrituras, identificación y predial y servicios al corriente. Te damos la lista exacta en la primera reunión."],
];

export default async function Home() {
  const [propiedades, colonias] = await Promise.all([getPropiedades(), getColonias()]);
  const disponibles = propiedades.filter((p) => p.estado !== "vendida" && p.estado !== "rentada");

  return (
    <div className={styles.inicio}>
      <InicioVivo />

      {/* ===================== HERO ===================== */}
      <section className={`${styles.hero} tono-oscuro`}>
        <Image src="/fotos/portada.jpg" alt="" fill priority sizes="100vw" className={styles.heroFoto} data-hero-foto />
        <div className={styles.heroVelo} />
        <div className={styles.heroTexto}>
          <h1 className={styles.heroTitulo}>
            Tu patrimonio,
            <br />
            revisado <em>con calma.</em>
          </h1>
          <div className={styles.heroPie}>
            <p>
              Compra, venta y renta en Uruapan. Revisamos precio, papeles y condiciones antes de que firmes; la primera asesoría no
              tiene costo.
            </p>
            <div className={styles.heroAcciones}>
              <Link href="/propiedades" className="btn btn-gold">
                Ver propiedades <span className="arrow">→</span>
              </Link>
              <Link prefetch={false} href="/vender" className={styles.botonVidrio}>
                Valuar mi casa
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.cinta} aria-hidden="true">
          <div className={styles.cintaPista}>
            {[0, 1].map((k) => (
              <span key={k}>
                {["Papeles revisados", "Precio comparado", "Condiciones por escrito", "Acompañamiento a notaría", "Comisión solo al cerrar"].map((t) => (
                  <span key={t} className={styles.cintaFrase}>
                    {t}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== DECLARACIÓN ===================== */}
      <section className={styles.claro}>
        <div className="wrap">
          <p className={styles.declaracion} data-llenar>
            Las buenas decisiones de patrimonio se toman despacio. Cada propiedad que te mostramos ya pasó por nuestras manos: la
            visitamos, revisamos sus papeles y comparamos su precio antes de que tú inviertas una tarde en verla.
          </p>
          <dl className={styles.cifras}>
            <div>
              <dt data-contar="0" data-prefijo="$">
                $0
              </dt>
              <dd>cuesta la primera asesoría</dd>
            </div>
            <div>
              <dt data-contar="4">4</dt>
              <dd>pasos hasta la notaría</dd>
            </div>
            <div>
              <dt data-contar={disponibles.length}>{disponibles.length}</dt>
              <dd>propiedades disponibles hoy</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ===================== PROPIEDADES ===================== */}
      <section className={styles.claro} id="propiedades">
        <div className="wrap">
          <div className={styles.cabeza}>
            <h2 className={styles.titulo2}>Lo que hay disponible hoy.</h2>
            <div className={styles.cabezaLado}>
              <div className={styles.pastillas} role="group" aria-label="Filtrar por operación" data-filtro>
                <button type="button" aria-pressed="true" data-op="todas">
                  Todas
                </button>
                <button type="button" aria-pressed="false" data-op="venta">
                  Venta
                </button>
                <button type="button" aria-pressed="false" data-op="renta">
                  Renta
                </button>
              </div>
              <Link href="/propiedades" className={styles.enlace}>
                Ver catálogo <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.carril} data-carril>
          {disponibles.map((p) => {
            const m2 = superficie(p);
            return (
              <Link key={p.slug} href={`/propiedades/${p.slug}`} className={styles.ficha} data-op={p.operacion}>
                <span className={styles.fichaFoto}>
                  <Image src={p.imagenes[0]} alt={p.titulo} fill sizes="(max-width: 600px) 78vw, 420px" />
                </span>
                <span className={styles.fichaFila}>
                  <span className={styles.fichaNombre}>{p.titulo}</span>
                  <span className={styles.fichaPrecio}>{formatoPrecio(p)}</span>
                </span>
                <span className={styles.fichaMeta}>
                  {p.colonia} · {p.categoria}
                  {m2 ? ` · ${m2} m²` : ""}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===================== LO QUE DE VERDAD COMPRAS ===================== */}
      <section className={styles.claro}>
        <div className="wrap">
          <h2 className={styles.titulo2}>Lo que de verdad estás comprando.</h2>
          <ol className={styles.compras} data-compras>
            {compras.map((c, i) => (
              <li key={c.t} data-foto={c.foto}>
                <span className={styles.num}>0{i + 1}</span>
                <span className={styles.comprasT}>{c.t}</span>
                <span className={styles.comprasD}>{c.d}</span>
              </li>
            ))}
          </ol>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.seguidor} src={compras[0].foto} alt="" aria-hidden="true" data-seguidor />
      </section>

      {/* ===================== PROCESO ===================== */}
      <section className={`${styles.oscuro} tono-oscuro`} id="proceso" data-proceso>
        <div className={`wrap ${styles.proceso}`}>
          <div className={styles.procesoFijo}>
            <div className={styles.numeros} aria-hidden="true">
              {pasos.map((_, i) => (
                <span key={i} className={styles.numero} data-num={i}>
                  0{i + 1}
                </span>
              ))}
            </div>
            <p className={styles.procesoLema}>Cuatro pasos, y en todos alguien responde por ti.</p>
            <div className={styles.avance}>
              <span data-avance />
            </div>
          </div>
          <ol className={styles.pasos}>
            {pasos.map((p, i) => (
              <li key={p.t} data-paso={i} className={styles.paso}>
                <span className={styles.pasoCuenta}>{String(i + 1).padStart(2, "0")} / 04</span>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
                <dl>
                  <div>
                    <dt>{p.a}</dt>
                    <dd>{p.b}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===================== PREGUNTAS ===================== */}
      <section className={styles.claro} id="preguntas">
        <div className="wrap">
          <div className={styles.cabeza}>
            <h2 className={styles.titulo2}>Lo que nos preguntan antes de la primera visita.</h2>
            <Link prefetch={false} href="/preguntas" className={styles.enlace}>
              Todas las preguntas <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className={styles.faq}>
            {preguntas.map(([q, r], i) => (
              <details key={q} name="faq">
                <summary>
                  <span className={styles.num}>0{i + 1}</span>
                  <span>{q}</span>
                  <span className={styles.mas} aria-hidden="true" />
                </summary>
                <p>{r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== COLONIAS ===================== */}
      <section className={styles.claro}>
        <div className="wrap">
          <div className={styles.cabeza}>
            <h2 className={styles.titulo2}>Dónde trabajamos.</h2>
            <Link prefetch={false} href="/colonias" className={styles.enlace}>
              Guía de colonias <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ul className={styles.colonias}>
            {colonias.map((c) => (
              <li key={c.slug}>
                <Link prefetch={false} href={`/colonias/${c.slug}`}>
                  <span className={styles.coloniaNombre}>{c.nombre}</span>
                  <span className={styles.coloniaTipo}>
                    {c.total} {c.total === 1 ? "propiedad" : "propiedades"}
                  </span>
                  <span className={styles.coloniaDato}>
                    {c.m2Venta ? `${formatoMoneda(Math.round(c.m2Venta))} por m²` : `Desde ${formatoMoneda(c.precioMin)}`}
                  </span>
                  <span className={styles.coloniaFlecha} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
