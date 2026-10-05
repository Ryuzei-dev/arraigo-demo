import type { Metadata } from "next";
import { Libre_Caslon_Display, Public_Sans, Schibsted_Grotesk, Spline_Sans_Mono, Familjen_Grotesk, Onest } from "next/font/google";
import { propiedadesMock, formatoPrecio, precioM2, formatoMoneda, superficie } from "@/lib/properties";
import CambioVariante from "./CambioVariante";
import s from "./variantes.module.css";

/*
 * Página interna para comparar tres identidades de Arraigo (fuera de buscadores y del sitemap).
 * Todas: base clara con secciones oscuras, oro y vino, modo claro y oscuro, interacciones tipo Framer.
 */
export const metadata: Metadata = { title: "Variantes de identidad · Arraigo", robots: { index: false, follow: false } };

const caslon = Libre_Caslon_Display({ subsets: ["latin"], weight: "400", variable: "--v-caslon", display: "swap" });
const publicSans = Public_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--v-public", display: "swap" });
const schibsted = Schibsted_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--v-schibsted", display: "swap" });
const splineMono = Spline_Sans_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--v-mono", display: "swap" });
const familjen = Familjen_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--v-familjen", display: "swap" });
const onest = Onest({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--v-onest", display: "swap" });

const casas = propiedadesMock.slice(0, 3);
const portada = propiedadesMock[0].imagenes[0];

function Datos({ i }: { i: number }) {
  const p = casas[i];
  const m2 = superficie(p);
  const pm2 = precioM2(p);
  return { p, m2, pm2 };
}

export default function Variantes() {
  const fuentes = [caslon, publicSans, schibsted, splineMono, familjen, onest].map((f) => f.variable).join(" ");
  return (
    <div className={`${s.pagina} ${fuentes}`}>
      <CambioVariante />

      {/* ============ A · EXPEDIENTE ============ */}
      <section id="expediente" className={`${s.var} ${s.a}`} data-variante>
        <p className={s.etiquetaVar}>A · Expediente: el sitio como un expediente notarial bien llevado</p>
        <div className={s.aHero}>
          <div className={s.aTexto}>
            <h1 className={s.aTitulo}>Comprar o vender bien es revisar todo antes de firmar.</h1>
            <p className={s.aEntrada}>Te acompañamos desde la búsqueda hasta la notaría. La primera asesoría no tiene costo; cobramos comisión solo si la operación se concreta.</p>
            <div className={s.aAcciones}>
              <a className={s.aBtn} href="#">Ver propiedades</a>
              <a className={s.aBtnLinea} href="#">Valuar mi casa</a>
            </div>
          </div>
          <figure className={s.aFoto}>
            <img src={portada} alt="" />
            <figcaption>
              <span className={s.aFolio}>Folio 001</span>
              <span>Casa Residencial Las Lomas</span>
              <span>{formatoPrecio(propiedadesMock[0])}</span>
            </figcaption>
          </figure>
        </div>

        <ul className={s.aLista}>
          {casas.map((_, i) => {
            const { p, m2, pm2 } = Datos({ i });
            return (
              <li key={p.slug} className={s.aFila}>
                <span className={s.aNum}>{String(i + 1).padStart(3, "0")}</span>
                <img src={p.imagenes[0]} alt="" className={s.aMini} />
                <span className={s.aNombre}>{p.titulo}</span>
                <span className={s.aDato}>{p.colonia}</span>
                <span className={s.aDato}>{m2 ? `${m2} m²` : "—"}</span>
                <span className={s.aDato}>{pm2 && p.operacion === "venta" ? `${formatoMoneda(pm2)}/m²` : p.operacion}</span>
                <span className={s.aPrecio}>{formatoPrecio(p)}</span>
              </li>
            );
          })}
        </ul>

        <div className={s.aOscura}>
          <h2>Lo que revisamos antes de que firmes</h2>
          <ol>
            {["Escrituras y titular", "Predial y agua al corriente", "Libertad de gravamen", "Uso de suelo y medidas", "Avalúo contra precio pedido"].map((t, i) => (
              <li key={t}>
                <span className={s.aCheck} style={{ animationDelay: `${i * 120}ms` }} aria-hidden />
                {t}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ B · VITRINA ============ */}
      <section id="vitrina" className={`${s.var} ${s.b}`} data-variante>
        <p className={s.etiquetaVar}>B · Vitrina: foto protagonista y búsqueda al frente, como Compass</p>
        <div className={s.bHero}>
          <img src={portada} alt="" className={s.bFondo} />
          <div className={s.bCaja}>
            <h1 className={s.bTitulo}>Casas, terrenos y locales en Uruapan, revisados antes de mostrártelos.</h1>
            <form className={s.bBuscador}>
              <div className={s.bTabs} role="tablist">
                <button type="button" role="tab" aria-selected="true">Comprar</button>
                <button type="button" role="tab" aria-selected="false">Rentar</button>
                <button type="button" role="tab" aria-selected="false">Vender</button>
              </div>
              <div className={s.bCampo}>
                <input placeholder="Colonia, tipo o presupuesto" aria-label="Buscar" />
                <button type="button">Buscar</button>
              </div>
            </form>
          </div>
        </div>

        <div className={s.bTarjetas}>
          {casas.map((_, i) => {
            const { p, m2 } = Datos({ i });
            return (
              <a key={p.slug} href="#" className={s.bTarjeta}>
                <span className={s.bImg}>
                  <img src={p.imagenes[0]} alt="" />
                  <span className={s.bOp}>{p.operacion === "venta" ? "Venta" : "Renta"}</span>
                </span>
                <span className={s.bPrecio}>{formatoPrecio(p)}</span>
                <span className={s.bNombre}>{p.titulo}</span>
                <span className={s.bMeta}>
                  {p.colonia}
                  {m2 ? ` · ${m2} m²` : ""}
                </span>
              </a>
            );
          })}
        </div>

        <div className={s.bOscura}>
          <div>
            <h2>¿Cuánto vale tu casa hoy?</h2>
            <p>Avalúo comercial con comparables reales de tu colonia. Sin costo y sin compromiso.</p>
          </div>
          <div className={s.bCifras}>
            <p><strong>3</strong> comparables por avalúo</p>
            <p><strong>48 h</strong> para entregarlo</p>
            <p><strong>0</strong> costo inicial</p>
          </div>
        </div>
      </section>

      {/* ============ C · ESCRITURA ============ */}
      <section id="escritura" className={`${s.var} ${s.c}`} data-variante>
        <p className={s.etiquetaVar}>C · Escritura: serif de documento oficial y texto que se narra con el scroll</p>
        <div className={s.cHero}>
          <h1 className={s.cTitulo}>
            Tu patrimonio, <span>por escrito.</span>
          </h1>
          <div className={s.cLado}>
            <p>Compra, venta y renta en Uruapan con cada paso documentado: precio, papeles y condiciones claros desde el primer día.</p>
            <a className={s.cBtn} href="#">Agendar asesoría sin costo</a>
          </div>
        </div>
        <figure className={s.cFoto}>
          <img src={portada} alt="" />
        </figure>

        <div className={s.cNarra}>
          <p className={s.cFijo}>Así trabajamos</p>
          <ol>
            {[
              ["Escuchamos", "Qué buscas, cuánto puedes y cuándo lo necesitas."],
              ["Filtramos", "Solo te mostramos lo que cumple y tiene papeles en orden."],
              ["Negociamos", "Precio y condiciones por escrito, sin presión."],
              ["Firmamos", "Te acompañamos a la notaría hasta la entrega de llaves."],
            ].map(([t, d], i) => (
              <li key={t}>
                <span className={s.cNum}>{["I", "II", "III", "IV"][i]}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className={s.cTarjetas}>
          {casas.map((_, i) => {
            const { p, m2, pm2 } = Datos({ i });
            return (
              <a key={p.slug} href="#" className={s.cTarjeta}>
                <img src={p.imagenes[0]} alt="" />
                <span className={s.cTexto}>
                  <span className={s.cNombre}>{p.titulo}</span>
                  <span className={s.cFila}>
                    <span>{p.colonia}</span>
                    <span>{m2 ? `${m2} m²` : ""}</span>
                  </span>
                  <span className={s.cFila}>
                    <strong>{formatoPrecio(p)}</strong>
                    <span>{pm2 && p.operacion === "venta" ? `${formatoMoneda(pm2)}/m²` : ""}</span>
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
