import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getColonias, getPropiedades } from "@/lib/queries";
import { formatoPrecio, formatoMoneda, superficie } from "@/lib/properties";
import InicioVivo from "./InicioVivo";
import { IconoCheck } from "@/components/Iconos";
import styles from "./home.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/*
 * Inicio con la identidad "Arena": hero sobre foto, declaración que se enciende con el scroll,
 * carril de propiedades con filtro, revisiones antes de firmar, proceso con número fijo en
 * oscuro, preguntas y colonias con su precio por m². El cierre lo pone el pie del sitio.
 */

const compras = [
  {
    t: "Escrituras y predial revisados antes de la visita",
    d: "Pedimos escrituras, predial al corriente y certificado de libertad de gravamen. Si algo falta, lo sabes antes de ver la casa, no el día de la firma.",
    foto: "/fotos/compra.jpg",
    pide: ["Escrituras", "Predial", "Libertad de gravamen"],
  },
  {
    t: "Precio comparado con la misma colonia",
    d: "Contrastamos lo que piden con el precio por m² de la zona y con inmuebles parecidos. Llegas a negociar con un número que puedes defender.",
    foto: "/fotos/avaluos.jpg",
    pide: ["Precio por m²", "Inmuebles parecidos"],
  },
  {
    t: "Cada acuerdo firmado antes de pagar",
    d: "Precio, forma de pago, fechas y condiciones de entrega quedan por escrito antes de que entregues dinero. Nada depende de una llamada.",
    foto: "/fotos/interiores.jpg",
    pide: ["Forma de pago", "Fechas", "Entrega"],
  },
  {
    t: "El mismo asesor hasta la entrega de llaves",
    d: "Te acompaña con el banco, coordina con el notario y está en la firma. Si surge una duda a la mitad, sabes a quién llamar.",
    foto: "/fotos/patios.jpg",
    pide: ["Banco", "Notario", "Llaves"],
  },
];

const pasos = [
  {
    t: "Escuchamos qué necesitas",
    d: "En una primera reunión sin costo definimos zona, tipo de inmueble, presupuesto y para cuándo lo necesitas. Si vas a vender, revisamos cuánto vale tu propiedad hoy.",
    recibes: ["Asesoría inicial sin costo ni compromiso", "Precalificación de crédito, si la necesitas", "La lista exacta de documentos para tu caso"],
  },
  {
    t: "Filtramos el mercado por ti",
    d: "Descartamos lo que no cumple con tu perfil o tiene papeles incompletos. Visitas menos inmuebles, y cada uno ya pasó por nuestra revisión.",
    recibes: ["Solo opciones dentro de tu presupuesto", "Papeles del inmueble revisados antes de la visita", "Precio comparado con la colonia"],
  },
  {
    t: "Negociamos precio y condiciones",
    d: "Presentamos la oferta y negociamos en tu nombre, sin presión. Tú apruebas cada paso, y lo acordado queda firmado antes de que entregues dinero.",
    recibes: ["Oferta sustentada en precios de la zona", "Revisión de cláusulas y contrato", "Acuerdos por escrito, nunca de palabra"],
  },
  {
    t: "Firmamos en notaría",
    d: "Damos seguimiento al crédito, coordinamos con el notario y te acompañamos en la firma y la entrega de llaves. Cobramos comisión solo si la operación se concreta.",
    recibes: ["Seguimiento del crédito hasta la firma", "Acompañamiento en notaría y escrituración", "Comisión solo al cerrar"],
  },
];

const preguntas = [
  ["¿Cuánto cobran por asesorarme?", "La primera asesoría no tiene costo ni compromiso. Cobramos comisión solo cuando la operación se concreta, y el porcentaje queda por escrito desde el inicio, antes de empezar a buscar o a promover."],
  ["¿Me ayudan a sacar el crédito?", "Sí. Te precalificamos sin costo y comparamos opciones de distintos bancos, Infonavit, Fovissste y esquemas combinados. Te ayudamos a reunir los documentos y damos seguimiento al trámite hasta la firma."],
  ["¿Cuánto tarda comprar una casa?", "De contado, una compra puede cerrarse en unas semanas. Con crédito suele tomar de uno a tres meses, según el banco y el estado de los papeles. Te damos tiempos realistas desde la primera reunión."],
  ["¿Qué documentos necesito para vender?", "Por lo general escrituras, identificación oficial, predial y boletas de servicios al corriente. En la primera reunión revisamos tu caso y te damos la lista exacta."],
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
              Compra, venta y renta de casas, departamentos y terrenos en Uruapan. Revisamos precio, papeles y condiciones antes de
              que firmes. La primera asesoría no tiene costo.
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
            <div>
              <h2 className={styles.titulo2}>Propiedades en venta y renta en Uruapan</h2>
              <p className={styles.entrada}>
                Cada ficha trae precio, superficie, colonia, fotos y ubicación en el mapa. Filtra por operación aquí o abre el catálogo
                para buscar por zona y presupuesto.
              </p>
            </div>
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
          <h2 className={styles.titulo2}>Lo que revisamos antes de que firmes</h2>
          <p className={styles.entrada}>
            Una casa se compra pocas veces en la vida. Estas cuatro revisiones son las que evitan sorpresas en la notaría.
          </p>
          <ol className={styles.revisiones}>
            {compras.map((c, i) => (
              <li key={c.t} className={styles.revision}>
                <span className={styles.revFoto}>
                  <Image src={c.foto} alt="" fill sizes="(max-width: 760px) 78vw, (max-width: 1100px) 45vw, 300px" />
                  <span className={styles.revNum}>0{i + 1}</span>
                </span>
                <h3 className={styles.revT}>{c.t}</h3>
                <p className={styles.revD}>{c.d}</p>
                <p className={styles.revPide}>
                  {c.pide.map((x) => (
                    <span key={x}>{x}</span>
                  ))}
                </p>
              </li>
            ))}
          </ol>
        </div>
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
            <h2 className={styles.procesoLema}>Cómo compras con nosotros, en cuatro pasos</h2>
            <p className={styles.procesoNota}>De contado, unas semanas. Con crédito, de uno a tres meses.</p>
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
                <p className={styles.pasoRecibes}>Qué recibes</p>
                <ul>
                  {p.recibes.map((r) => (
                    <li key={r}>
                      <IconoCheck />
                      {r}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===================== PREGUNTAS ===================== */}
      <section className={styles.claro} id="preguntas">
        <div className="wrap">
          <div className={styles.cabeza}>
            <div>
              <h2 className={styles.titulo2}>Cuánto cobramos, cuánto tarda y qué necesitas</h2>
              <p className={styles.entrada}>Las cuatro preguntas que más nos hacen antes de la primera visita.</p>
            </div>
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
            <div>
              <h2 className={styles.titulo2}>Precio por m² en las colonias donde trabajamos</h2>
              <p className={styles.entrada}>
                Promedio de las propiedades en venta de nuestro catálogo. Te sirve para saber si un precio está en rango antes de visitar.
              </p>
            </div>
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
