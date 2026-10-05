import type { Metadata } from "next";
import { Newsreader, Hanken_Grotesk } from "next/font/google";
import { propiedadesMock, formatoPrecio, superficie, precioM2, formatoMoneda } from "@/lib/properties";
import CambioVariante from "./CambioVariante";
import Vivo from "./Vivo";
import s from "./variantes.module.css";

/*
 * Prototipo de identidad para Arraigo (página interna, fuera de buscadores).
 * Dirección: editorial y serena como Maison North, con el oscuro, oro y vino de Arraigo.
 * Base clara arena + secciones oscuras; claro y oscuro; movimiento ligado al scroll.
 */
export const metadata: Metadata = { title: "Prototipo de identidad · Arraigo", robots: { index: false, follow: false } };

// Serif editorial legible: el eje óptico la afina en tamaños grandes y la engruesa en chicos
const serif = Newsreader({ subsets: ["latin"], weight: "variable", style: ["normal", "italic"], axes: ["opsz"], variable: "--p-serif", display: "swap" });
const sans = Hanken_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--p-sans", display: "swap" });

const portada = propiedadesMock[0].imagenes[0];

const compras = [
  { t: "Papeles en orden, antes de la primera visita", d: "Escrituras, predial y libertad de gravamen revisados." },
  { t: "Un precio que se sostiene", d: "Comparado contra ventas reales de la misma colonia." },
  { t: "Condiciones por escrito", d: "Lo que se acuerda queda en papel, no en una llamada." },
  { t: "Alguien contigo en la notaría", d: "Hasta la firma y la entrega de llaves." },
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

export default function Prototipo() {
  const casas = propiedadesMock.slice(0, 6);
  return (
    <div className={`${s.pagina} ${serif.variable} ${sans.variable}`}>
      <CambioVariante />
      <Vivo />

      {/* ---------- Barra ---------- */}
      <header className={s.barra} data-barra>
        <span className={s.marca}>Arraigo</span>
        <nav className={s.nav}>
          <a href="#propiedades">Propiedades</a>
          <a href="#proceso">Cómo trabajamos</a>
          <a href="#preguntas">Preguntas</a>
        </nav>
        <span className={s.hora} data-hora>Uruapan · 00:00</span>
        <a href="#contacto" className={s.botonOro}>
          Agendar asesoría <span aria-hidden>→</span>
        </a>
      </header>

      {/* ---------- Hero ---------- */}
      <section className={s.hero}>
        <img src={portada} alt="" className={s.heroFoto} data-hero-foto />
        <div className={s.heroVelo} />
        <div className={s.heroTexto}>
          <h1 className={s.heroTitulo}>
            Tu patrimonio,
            <br />
            revisado <em>con calma.</em>
          </h1>
          <div className={s.heroPie}>
            <p>Compra, venta y renta en Uruapan. Revisamos precio, papeles y condiciones antes de que firmes; la primera asesoría no tiene costo.</p>
            <div className={s.heroAcciones}>
              <a href="#propiedades" className={s.botonOro}>Ver propiedades <span aria-hidden>→</span></a>
              <a href="#contacto" className={s.botonVidrio}>Valuar mi casa</a>
            </div>
          </div>
        </div>
        <div className={s.cinta} aria-hidden>
          <div className={s.cintaPista}>
            {[0, 1].map((k) => (
              <span key={k}>
                {["Papeles revisados", "Precio comparado", "Condiciones por escrito", "Acompañamiento a notaría", "Comisión solo al cerrar"].map((t) => (
                  <span key={t} className={s.cintaFrase}>{t}</span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Declaración + cifras ---------- */}
      <section className={s.claro}>
        <div className={s.envoltura}>
          <p className={s.declaracion} data-llenar>
            Las buenas decisiones de patrimonio se toman despacio. Cada propiedad que te mostramos ya pasó por nuestras manos: la visitamos, revisamos sus papeles y comparamos su precio antes de que tú inviertas una tarde en verla.
          </p>
          <dl className={s.cifras}>
            <div><dt data-contar="0" data-prefijo="$">$0</dt><dd>cuesta la primera asesoría</dd></div>
            <div><dt data-contar="4">4</dt><dd>pasos hasta la notaría</dd></div>
            <div><dt data-contar="6">6</dt><dd>propiedades disponibles hoy</dd></div>
          </dl>
        </div>
      </section>

      {/* ---------- Propiedades ---------- */}
      <section className={s.claro} id="propiedades">
        <div className={s.envoltura}>
          <div className={s.cabeza}>
            <h2 className={s.titulo2}>Lo que hay disponible hoy.</h2>
            <div className={s.pastillas} role="group" aria-label="Filtrar" data-filtro>
              <button type="button" aria-pressed="true" data-op="todas">Todas</button>
              <button type="button" aria-pressed="false" data-op="venta">Venta</button>
              <button type="button" aria-pressed="false" data-op="renta">Renta</button>
            </div>
          </div>
        </div>
        <div className={s.carril} data-carril>
          {casas.map((p) => {
            const m2 = superficie(p);
            return (
              <a key={p.slug} href="#" className={s.ficha} data-op={p.operacion}>
                <span className={s.fichaFoto}><img src={p.imagenes[0]} alt="" loading="lazy" /></span>
                <span className={s.fichaFila}>
                  <span className={s.fichaNombre}>{p.titulo}</span>
                  <span className={s.fichaPrecio}>{formatoPrecio(p)}</span>
                </span>
                <span className={s.fichaMeta}>
                  {p.colonia} · {p.categoria}
                  {m2 ? ` · ${m2} m²` : ""}
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* ---------- Lo que de verdad compras ---------- */}
      <section className={s.claro}>
        <div className={s.envoltura}>
          <h2 className={s.titulo2}>Lo que de verdad estás comprando.</h2>
          <ol className={s.compras} data-compras>
            {compras.map((c, i) => (
              <li key={c.t} data-foto={propiedadesMock[i + 1].imagenes[0]}>
                <span className={s.comprasNum}>0{i + 1}</span>
                <span className={s.comprasT}>{c.t}</span>
                <span className={s.comprasD}>{c.d}</span>
              </li>
            ))}
          </ol>
        </div>
        <img className={s.seguidor} src={propiedadesMock[1].imagenes[0]} alt="" aria-hidden data-seguidor />
      </section>

      {/* ---------- Proceso: número fijo que cambia con el scroll ---------- */}
      <section className={s.oscuro} id="proceso" data-proceso>
        <div className={`${s.envoltura} ${s.proceso}`}>
          <div className={s.procesoFijo}>
            <div className={s.numeros} aria-hidden>
              {pasos.map((_, i) => (
                <span key={i} className={s.numero} data-num={i}>0{i + 1}</span>
              ))}
            </div>
            <p className={s.procesoLema}>Cuatro pasos, y en todos alguien responde por ti.</p>
            <div className={s.avance}><span data-avance /></div>
          </div>
          <ol className={s.pasos}>
            {pasos.map((p, i) => (
              <li key={p.t} data-paso={i} className={s.paso}>
                <span className={s.pasoCuenta}>{String(i + 1).padStart(2, "0")} / 04</span>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
                <dl>
                  <div><dt>{p.a}</dt><dd>{p.b}</dd></div>
                </dl>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Preguntas ---------- */}
      <section className={s.claro} id="preguntas">
        <div className={s.envoltura}>
          <h2 className={s.titulo2}>Lo que nos preguntan antes de la primera visita.</h2>
          <div className={s.faq}>
            {preguntas.map(([q, r], i) => (
              <details key={q} name="faq">
                <summary>
                  <span className={s.comprasNum}>0{i + 1}</span>
                  <span>{q}</span>
                  <span className={s.mas} aria-hidden />
                </summary>
                <p>{r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Cierre ---------- */}
      <section className={s.cierre} id="contacto">
        <img src={propiedadesMock[0].imagenes[1] ?? portada} alt="" />
        <div className={s.cierreTexto}>
          <h2>Antes de firmar, una segunda opinión.</h2>
          <p>La primera asesoría no tiene costo y no te compromete a nada. Cuéntanos qué estás pensando y te decimos lo que haríamos.</p>
          <a href="#" className={s.botonOro}>Escribir por WhatsApp <span aria-hidden>→</span></a>
        </div>
      </section>

      <footer className={s.pie}>
        <div className={s.pieFila}>
          <p>Asesoría inmobiliaria en Uruapan, Michoacán. Compra, venta y renta.</p>
          <p>Sitio de demostración hecho por LumikaStudio</p>
        </div>
        {/* En lugar del nombre gigante: dónde trabajamos, con el dato que importa en cada colonia */}
        <div className={s.pieColonias}>
          <h2>Dónde trabajamos</h2>
          <ul>
            {propiedadesMock.map((p) => {
              const pm2 = precioM2(p);
              return (
                <li key={p.slug}>
                  <a href="#">
                    <span className={s.pieColonia}>{p.colonia}</span>
                    <span className={s.pieTipo}>{p.categoria} en {p.operacion}</span>
                    <span className={s.pieDato}>
                      {p.operacion === "venta" && pm2 ? `${formatoMoneda(pm2)} por m²` : formatoPrecio(p)}
                    </span>
                    <span className={s.pieFlecha} aria-hidden>→</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <p className={s.pieNota}>Precios de las propiedades publicadas hoy. Datos de demostración.</p>
        </div>
        <p className={s.pieLegal}>© 2026 Arraigo · Uruapan, Michoacán</p>
      </footer>
    </div>
  );
}
