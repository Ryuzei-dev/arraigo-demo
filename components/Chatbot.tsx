"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { asesores, whatsappAsesor } from "@/lib/asesores";
import { track } from "@/lib/analytics";
import { IconoTelefono, IconoWhatsapp } from "@/components/IconosContacto";
import styles from "./Chatbot.module.css";

/*
 * Asistente guiado (sin IA): un árbol de preguntas con botones que lleva al catálogo filtrado,
 * a /vender, a las guías o a un asesor por WhatsApp. No guarda nada.
 * Sustituye al botón flotante de WhatsApp: WhatsApp es una opción dentro del panel.
 */

const WHATSAPP = "https://wa.me/524520000000";
const wa = (texto: string) => `${WHATSAPP}?text=${encodeURIComponent(texto)}`;

type Enlace = { texto: string; href: string; externo?: boolean; tipo?: "whatsapp" | "telefono" };
type Opcion = { texto: string; ir: Paso } | { texto: string; enlace: Enlace };
type Mensaje = { id: number; de: "bot" | "tu"; texto: string; enlaces?: Enlace[] };

type Paso =
  | { n: "inicio" }
  | { n: "tipo"; op: "venta" | "renta" }
  | { n: "presupuesto"; op: "venta" | "renta"; cat?: string }
  | { n: "resultado"; op: "venta" | "renta"; cat?: string; max?: number }
  | { n: "vender" }
  | { n: "credito" }
  | { n: "asesor" }
  | { n: "horarios" };

const TIPOS = ["Casa", "Departamento", "Terreno", "Local", "Oficina", "Bodega"];
const PRESUPUESTO_VENTA = [2_000_000, 4_000_000, 6_000_000, 8_000_000];
const PRESUPUESTO_RENTA = [10_000, 20_000, 35_000, 50_000];

const pesos = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);

function urlCatalogo(op: "venta" | "renta", cat?: string, max?: number) {
  const p = new URLSearchParams({ operacion: op });
  if (cat) p.set("categoria", cat);
  if (max) p.set("precioMax", String(max));
  return `/propiedades?${p.toString()}`;
}

/** Lo que dice el asistente y las opciones de cada paso */
function contenido(paso: Paso): { texto: string; enlaces?: Enlace[]; opciones: Opcion[] } {
  switch (paso.n) {
    case "inicio":
      return {
        texto: "Hola. ¿En qué te ayudamos?",
        opciones: [
          { texto: "Busco comprar", ir: { n: "tipo", op: "venta" } },
          { texto: "Busco rentar", ir: { n: "tipo", op: "renta" } },
          { texto: "Quiero vender o rentar mi propiedad", ir: { n: "vender" } },
          { texto: "Crédito", ir: { n: "credito" } },
          { texto: "Hablar con un asesor", ir: { n: "asesor" } },
          { texto: "Horarios y ubicación", ir: { n: "horarios" } },
          {
            texto: "Escribir por WhatsApp",
            enlace: { texto: "WhatsApp", href: wa("Hola, quiero asesoría inmobiliaria."), externo: true, tipo: "whatsapp" },
          },
        ],
      };
    case "tipo":
      return {
        texto: paso.op === "venta" ? "¿Qué tipo de inmueble quieres comprar?" : "¿Qué tipo de inmueble quieres rentar?",
        opciones: [
          ...TIPOS.map((t) => ({ texto: t, ir: { n: "presupuesto", op: paso.op, cat: t } as Paso })),
          { texto: "Cualquier tipo", ir: { n: "presupuesto", op: paso.op } },
        ],
      };
    case "presupuesto": {
      const rangos = paso.op === "venta" ? PRESUPUESTO_VENTA : PRESUPUESTO_RENTA;
      return {
        texto:
          paso.op === "venta"
            ? "¿Cuál es tu presupuesto aproximado?"
            : "¿Cuánto quieres pagar de renta al mes, aproximadamente?",
        opciones: [
          ...rangos.map((m) => ({
            texto: `Hasta ${pesos(m)}${paso.op === "renta" ? " al mes" : ""}`,
            ir: { n: "resultado", op: paso.op, cat: paso.cat, max: m } as Paso,
          })),
          { texto: "Más o aún no lo sé", ir: { n: "resultado", op: paso.op, cat: paso.cat } },
        ],
      };
    }
    case "resultado": {
      const que = paso.cat ? `${paso.cat.toLowerCase()}` : "inmuebles";
      const dondeOp = paso.op === "venta" ? "en venta" : "en renta";
      const tope = paso.max ? ` de hasta ${pesos(paso.max)}${paso.op === "renta" ? " al mes" : ""}` : "";
      return {
        texto: `Listo. Te dejamos el catálogo filtrado: ${que} ${dondeOp}${tope}. Si no ves lo que buscas, cuéntaselo a un asesor.`,
        enlaces: [{ texto: "Ver propiedades", href: urlCatalogo(paso.op, paso.cat, paso.max) }],
        opciones: [
          { texto: "Hablar con un asesor", ir: { n: "asesor" } },
          ...(paso.op === "venta" ? [{ texto: "Ver opciones de crédito", ir: { n: "credito" } as Paso }] : []),
        ],
      };
    }
    case "vender":
      return {
        texto:
          "Te ayudamos a vender o rentar tu propiedad. La asesoría inicial es sin costo, definimos el precio con un avalúo comercial y la comisión solo se genera al concretar.",
        enlaces: [
          { texto: "Quiero vender", href: "/vender" },
          { texto: "Quiero rentarla", href: "/vender?operacion=rentar" },
          { texto: "Guía para rentar sin sorpresas", href: "/guias/rentar-tu-propiedad-sin-sorpresas" },
        ],
        opciones: [{ texto: "Hablar con un asesor", ir: { n: "asesor" } }],
      };
    case "credito":
      return {
        texto:
          "Te precalificamos sin costo y comparamos opciones de bancos, Infonavit, Fovissste y esquemas combinados. En la ficha de cada propiedad en venta hay una calculadora para estimar tu mensualidad.",
        enlaces: [
          { texto: "Créditos y financiamiento", href: "/servicios/creditos-y-financiamiento" },
          { texto: "Guía Infonavit y Fovissste", href: "/guias/credito-infonavit-o-fovissste" },
          { texto: "Propiedades en venta", href: "/propiedades?operacion=venta" },
        ],
        opciones: [{ texto: "Hablar con un asesor", ir: { n: "asesor" } }],
      };
    case "asesor":
      return {
        texto: "Escríbele directo a quien conoce tu caso:",
        enlaces: [
          ...asesores.map((a) => ({
            texto: `${a.nombre}, ${a.especialidad.toLowerCase()}`,
            href: whatsappAsesor(a, `Hola ${a.nombre.split(" ")[0]}, quiero asesoría inmobiliaria.`),
            externo: true,
            tipo: "whatsapp" as const,
          })),
          { texto: "Ver perfiles de los asesores", href: "/asesores" },
        ],
        opciones: [],
      };
    case "horarios":
      return {
        texto:
          "Atendemos de lunes a viernes de 9:00 a 19:00 y los sábados de 10:00 a 14:00, en Uruapan, Michoacán.",
        enlaces: [
          { texto: "WhatsApp", href: wa("Hola, quiero agendar una cita."), externo: true, tipo: "whatsapp" },
          { texto: "(452) 000 0000", href: "tel:+524520000000", externo: true, tipo: "telefono" },
          { texto: "Página de contacto", href: "/contacto" },
        ],
        opciones: [],
      };
  }
}

export default function Chatbot() {
  const pathname = usePathname();
  const uid = useId();
  const [abierto, setAbierto] = useState(false);
  const [paso, setPaso] = useState<Paso>({ n: "inicio" });
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const contador = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const lanzadorRef = useRef<HTMLButtonElement>(null);
  const finRef = useRef<HTMLDivElement>(null);
  const enfocarOpciones = useRef(false);

  const decir = useCallback((de: Mensaje["de"], texto: string, enlaces?: Enlace[]) => {
    contador.current += 1;
    const m = { id: contador.current, de, texto, enlaces };
    setMensajes((ms) => [...ms, m]);
  }, []);

  const reiniciar = useCallback(() => {
    const c = contenido({ n: "inicio" });
    contador.current += 1;
    setMensajes([{ id: contador.current, de: "bot", texto: c.texto }]);
    setPaso({ n: "inicio" });
  }, []);

  const abrir = () => {
    if (!mensajes.length) reiniciar();
    setAbierto(true);
    track("abrir_chatbot", { pagina: pathname });
  };

  const devolverFoco = useRef(false);
  const cerrar = useCallback(() => {
    devolverFoco.current = true;
    setAbierto(false);
  }, []);

  // Al cerrar con Esc o con la X, el foco vuelve al botón que abrió el panel
  useEffect(() => {
    if (!abierto && devolverFoco.current) {
      devolverFoco.current = false;
      lanzadorRef.current?.focus();
    }
  }, [abierto]);

  const elegir = (o: Opcion) => {
    if ("enlace" in o) return;
    decir("tu", o.texto);
    const c = contenido(o.ir);
    decir("bot", c.texto, c.enlaces);
    setPaso(o.ir);
    enfocarOpciones.current = true;
    track("chatbot_opcion", { opcion: o.texto });
  };

  // Al abrir: foco dentro del panel
  useEffect(() => {
    if (!abierto) return;
    const t = requestAnimationFrame(() => {
      const primero = panelRef.current?.querySelector<HTMLElement>("[data-opcion]");
      (primero ?? panelRef.current)?.focus();
    });
    return () => cancelAnimationFrame(t);
  }, [abierto]);

  // Esc cierra
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cerrar();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [abierto, cerrar]);

  // Mensaje nuevo: baja al final y lleva el foco a la primera opción nueva
  useEffect(() => {
    if (!abierto) return;
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    finRef.current?.scrollIntoView({ block: "end", behavior: reducir ? "auto" : "smooth" });
    if (enfocarOpciones.current) {
      enfocarOpciones.current = false;
      const ultimo = panelRef.current?.querySelector<HTMLElement>("[data-ultimo] a, [data-opcion]");
      ultimo?.focus({ preventScroll: true });
    }
  }, [mensajes, abierto]);

  // Al cambiar de página, el panel se cierra (el enlace ya cumplió su función)
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  if (pathname.startsWith("/studio")) return null;

  const actual = contenido(paso);
  const enFicha = /^\/propiedades\/[^/]+/.test(pathname);

  return (
    <div className={`${styles.raiz} ${enFicha ? styles.enFicha : ""}`}>
      {/* Espacio al final de la página en celular para que el botón no tape el pie */}
      <div className={styles.espaciador} aria-hidden="true" />
      {!abierto && (
        <button
          ref={lanzadorRef}
          type="button"
          className={styles.lanzador}
          onClick={abrir}
          aria-haspopup="dialog"
          aria-expanded={false}
          aria-controls={`${uid}-panel`}
        >
          <span className={styles.lanzadorIcono} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5.5h16v10H9.5L5 19.5v-4H4z" />
              <path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" />
            </svg>
          </span>
          ¿Te ayudamos?
        </button>
      )}

      {abierto && (
        <div
          ref={panelRef}
          id={`${uid}-panel`}
          className={styles.panel}
          role="dialog"
          aria-modal="false"
          aria-labelledby={`${uid}-titulo`}
          tabIndex={-1}
        >
          <div className={styles.cabecera}>
            <span className={styles.marca} aria-hidden="true">
              A
            </span>
            <div className={styles.cabeceraTexto}>
              <h2 id={`${uid}-titulo`}>Asistente de Arraigo</h2>
              <p>Respuestas rápidas, sin registro</p>
            </div>
            <button type="button" className={styles.cerrar} onClick={cerrar} aria-label="Cerrar asistente">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <div className={styles.conversacion} role="log" aria-live="polite" aria-relevant="additions">
            {mensajes.map((m, i) => (
              <div
                key={m.id}
                className={`${styles.mensaje} ${m.de === "tu" ? styles.tuyo : styles.bot}`}
                data-ultimo={i === mensajes.length - 1 && m.enlaces?.length ? "" : undefined}
              >
                <span className={styles.srOnly}>{m.de === "tu" ? "Tú: " : "Arraigo: "}</span>
                <p>{m.texto}</p>
                {m.enlaces && m.enlaces.length > 0 && (
                  <ul className={styles.enlaces}>
                    {m.enlaces.map((e) => (
                      <li key={e.href}>
                        {e.externo ? (
                          <a
                            href={e.href}
                            className={styles.enlace}
                            {...(e.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          >
                            {e.tipo === "whatsapp" && <IconoWhatsapp size={16} />}
                            {e.tipo === "telefono" && <IconoTelefono size={16} />}
                            <span>{e.texto}</span>
                            {e.href.startsWith("http") && <span className={styles.srOnly}> (se abre en otra pestaña)</span>}
                          </a>
                        ) : (
                          <Link href={e.href} className={styles.enlace} onClick={() => setAbierto(false)}>
                            <span>{e.texto}</span>
                            <span aria-hidden="true">→</span>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <div ref={finRef} />
          </div>

          <div className={styles.opciones}>
            {actual.opciones.map((o) =>
              "enlace" in o ? (
                <a
                  key={o.texto}
                  href={o.enlace.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.opcion} ${styles.opcionWhatsapp}`}
                  data-opcion=""
                >
                  <IconoWhatsapp size={16} /> {o.texto}
                  <span className={styles.srOnly}> (se abre en otra pestaña)</span>
                </a>
              ) : (
                <button key={o.texto} type="button" className={styles.opcion} onClick={() => elegir(o)} data-opcion="">
                  {o.texto}
                </button>
              )
            )}
            {paso.n !== "inicio" && (
              <button
                type="button"
                className={`${styles.opcion} ${styles.opcionVolver}`}
                onClick={() => {
                  reiniciar();
                  enfocarOpciones.current = true;
                }}
                data-opcion=""
              >
                ← Volver al inicio
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
