"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { track } from "@/lib/analytics";
import styles from "./ficha.module.css";
import { IconoCheck } from "@/components/Iconos";

const HORARIOS = ["10:00", "12:00", "16:00", "18:00"];

type Estado = "idle" | "enviando" | "ok" | "error";
type Errores = Partial<Record<"nombre" | "telefono" | "correo" | "fecha" | "hora", string>>;

interface Props {
  slug: string;
  titulo: string;
  url: string;
  operacion: "venta" | "renta";
  categoria: string;
  asesorNombre: string;
  asesorTelefono: string;
}

/** Próximos 14 días sin domingos (se calcula en el navegador para no fijar fechas al compilar) */
function proximosDias(): Date[] {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const dias: Date[] = [];
  for (let i = 1; i <= 14; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    if (d.getDay() !== 0) dias.push(d);
  }
  return dias;
}

const fmtDiaSemana = new Intl.DateTimeFormat("es-MX", { weekday: "short" });
const fmtDiaMes = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" });
const fmtLargo = new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long" });
const limpiar = (s: string) => s.replace(/\./g, "");
const claveFecha = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function validarTelefono(t: string) {
  return t.replace(/\D/g, "").length >= 10;
}
function validarCorreo(c: string) {
  return !c || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);
}

async function enviar(datos: Record<string, string>) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.ok) throw new Error(json.error || "No se pudo enviar");
}

const wa = (tel: string, texto: string) => `https://wa.me/${tel}?text=${encodeURIComponent(texto)}`;

export default function ContactoFicha(props: Props) {
  const id = useId();
  const [pestana, setPestana] = useState<"visita" | "mensaje">("visita");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const orden = ["visita", "mensaje"] as const;

  const onTecla = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = orden.indexOf(pestana);
    let j = i;
    if (e.key === "ArrowRight") j = (i + 1) % orden.length;
    else if (e.key === "ArrowLeft") j = (i - 1 + orden.length) % orden.length;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = orden.length - 1;
    else return;
    e.preventDefault();
    setPestana(orden[j]);
    refs.current[j]?.focus();
  };

  return (
    <div className={styles.contacto}>
      <div className={styles.pestanas} role="tablist" aria-label="Formas de contacto">
        {orden.map((p, i) => (
          <button
            key={p}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${p}`}
            aria-selected={pestana === p}
            aria-controls={`${id}-panel-${p}`}
            tabIndex={pestana === p ? 0 : -1}
            className={styles.pestana}
            onClick={() => setPestana(p)}
            onKeyDown={onTecla}
          >
            {p === "visita" ? "Agendar visita" : "Enviar mensaje"}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel-visita`}
        aria-labelledby={`${id}-tab-visita`}
        hidden={pestana !== "visita"}
        className={styles.panel}
      >
        <FormVisita {...props} />
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel-mensaje`}
        aria-labelledby={`${id}-tab-mensaje`}
        hidden={pestana !== "mensaje"}
        className={styles.panel}
      >
        <FormMensaje {...props} />
      </div>
    </div>
  );
}

function Campo({
  id,
  etiqueta,
  error,
  children,
}: {
  id: string;
  etiqueta: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.campo}>
      <label htmlFor={id}>{etiqueta}</label>
      {children}
      {error && (
        <p id={`${id}-error`} className={styles.errorCampo}>
          {error}
        </p>
      )}
    </div>
  );
}

function FormVisita({ slug, titulo, asesorNombre, asesorTelefono, operacion, categoria }: Props) {
  const id = useId();
  const [dias, setDias] = useState<Date[]>([]);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [estado, setEstado] = useState<Estado>("idle");
  const [errorEnvio, setErrorEnvio] = useState("");
  const exito = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDias(proximosDias());
  }, []);

  useEffect(() => {
    if (estado === "ok") exito.current?.focus();
  }, [estado]);

  const dia = dias.find((d) => claveFecha(d) === fecha);
  const fechaTexto = dia ? fmtLargo.format(dia) : "";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err: Errores = {};
    if (!fecha) err.fecha = "Elige un día para la visita.";
    if (!hora) err.hora = "Elige un horario.";
    if (!nombre.trim()) err.nombre = "Escribe tu nombre.";
    if (!validarTelefono(telefono)) err.telefono = "Escribe un teléfono de 10 dígitos.";
    setErrores(err);
    if (Object.keys(err).length) {
      const primero = (["fecha", "hora", "nombre", "telefono"] as const).find((k) => err[k]);
      const objetivo =
        primero === "fecha" || primero === "hora"
          ? e.currentTarget.querySelector<HTMLInputElement>(`input[name="${id}-${primero}"]`)
          : e.currentTarget.querySelector<HTMLInputElement>(`#${CSS.escape(`${id}-${primero}`)}`);
      objetivo?.focus();
      return;
    }
    setEstado("enviando");
    setErrorEnvio("");
    try {
      await enviar({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        operacion: "Visita",
        tipo: categoria,
        propiedad: titulo,
        mensaje: `Visita solicitada: ${fechaTexto} ${hora}. Asesor: ${asesorNombre}`,
      });
      track("solicitar_visita", { propiedad: slug, operacion });
      setEstado("ok");
    } catch (er) {
      setEstado("error");
      setErrorEnvio(er instanceof Error ? er.message : "Error inesperado");
    }
  };

  if (estado === "ok") {
    const primerNombre = asesorNombre.split(" ")[0];
    return (
      <div className={styles.exito} ref={exito} tabIndex={-1} role="status">
        <span className={styles.exitoMarca} aria-hidden="true"><IconoCheck /></span>
        <h3>Visita solicitada</h3>
        <p>
          {nombre.split(" ")[0]}, recibimos tu solicitud para el {fechaTexto} a las {hora}.{" "}
          {primerNombre} te llama para confirmar.
        </p>
        <a
          href={wa(
            asesorTelefono,
            `Hola ${primerNombre}, soy ${nombre.trim()}. Solicité una visita a ${titulo} el ${fechaTexto} a las ${hora}. ¿Me confirmas?`
          )}
          className="btn btn-ghost"
          target="_blank"
          rel="noopener noreferrer"
        >
          Confirmar por WhatsApp
        </a>
      </div>
    );
  }

  const descError = (k: keyof Errores) => (errores[k] ? `${id}-${k}-error` : undefined);

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <fieldset className={styles.campo} aria-describedby={descError("fecha")}>
        <legend>Día</legend>
        <div className={styles.opciones} data-columnas="dias">
          {dias.length === 0 && <span className={styles.cargando}>Cargando fechas…</span>}
          {dias.map((d) => {
            const k = claveFecha(d);
            return (
              <label key={k} className={styles.opcion}>
                <input
                  type="radio"
                  name={`${id}-fecha`}
                  value={k}
                  checked={fecha === k}
                  aria-label={fmtLargo.format(d)}
                  onChange={() => {
                    setFecha(k);
                    setErrores((x) => ({ ...x, fecha: undefined }));
                  }}
                />
                <span className={styles.opcionDia}>
                  <small>{limpiar(fmtDiaSemana.format(d))}</small>
                  {limpiar(fmtDiaMes.format(d))}
                </span>
              </label>
            );
          })}
        </div>
        {errores.fecha && (
          <p id={`${id}-fecha-error`} className={styles.errorCampo}>
            {errores.fecha}
          </p>
        )}
      </fieldset>

      <fieldset className={styles.campo} aria-describedby={descError("hora")}>
        <legend>Horario</legend>
        <div className={styles.opciones} data-columnas="4">
          {HORARIOS.map((h) => (
            <label key={h} className={styles.opcion}>
              <input
                type="radio"
                name={`${id}-hora`}
                value={h}
                checked={hora === h}
                onChange={() => {
                  setHora(h);
                  setErrores((x) => ({ ...x, hora: undefined }));
                }}
              />
              <span>{h}</span>
            </label>
          ))}
        </div>
        {errores.hora && (
          <p id={`${id}-hora-error`} className={styles.errorCampo}>
            {errores.hora}
          </p>
        )}
      </fieldset>

      <Campo id={`${id}-nombre`} etiqueta="Nombre" error={errores.nombre}>
        <input
          id={`${id}-nombre`}
          autoComplete="name"
          value={nombre}
          aria-invalid={!!errores.nombre}
          aria-describedby={descError("nombre")}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
        />
      </Campo>
      <Campo id={`${id}-telefono`} etiqueta="Teléfono" error={errores.telefono}>
        <input
          id={`${id}-telefono`}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={telefono}
          aria-invalid={!!errores.telefono}
          aria-describedby={descError("telefono")}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="(452) 000 0000"
        />
      </Campo>

      {estado === "error" && (
        <p className={styles.errorEnvio} role="alert">
          {errorEnvio}. Intenta de nuevo o escríbenos por WhatsApp.
        </p>
      )}

      <button type="submit" className={`btn btn-gold ${styles.enviar}`} disabled={estado === "enviando"}>
        {estado === "enviando" ? "Enviando…" : "Solicitar visita"}
      </button>
    </form>
  );
}

function FormMensaje({ slug, titulo, operacion, categoria, asesorNombre, asesorTelefono, url }: Props) {
  const id = useId();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState(`Me interesa ${titulo}`);
  const [errores, setErrores] = useState<Errores>({});
  const [estado, setEstado] = useState<Estado>("idle");
  const [errorEnvio, setErrorEnvio] = useState("");
  const exito = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (estado === "ok") exito.current?.focus();
  }, [estado]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err: Errores = {};
    if (!nombre.trim()) err.nombre = "Escribe tu nombre.";
    if (!validarTelefono(telefono)) err.telefono = "Escribe un teléfono de 10 dígitos.";
    if (!validarCorreo(correo.trim())) err.correo = "Revisa tu correo.";
    setErrores(err);
    const primero = (["nombre", "telefono", "correo"] as const).find((k) => err[k]);
    if (primero) {
      e.currentTarget.querySelector<HTMLInputElement>(`#${CSS.escape(`${id}-${primero}`)}`)?.focus();
      return;
    }
    setEstado("enviando");
    setErrorEnvio("");
    try {
      await enviar({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        ...(correo.trim() ? { correo: correo.trim() } : {}),
        operacion: operacion === "venta" ? "Comprar" : "Rentar",
        tipo: categoria,
        propiedad: titulo,
        mensaje: `${mensaje.trim()}\nAsesor: ${asesorNombre}`,
      });
      track("mensaje_ficha", { propiedad: slug, operacion });
      setEstado("ok");
    } catch (er) {
      setEstado("error");
      setErrorEnvio(er instanceof Error ? er.message : "Error inesperado");
    }
  };

  if (estado === "ok") {
    const primerNombre = asesorNombre.split(" ")[0];
    return (
      <div className={styles.exito} ref={exito} tabIndex={-1} role="status">
        <span className={styles.exitoMarca} aria-hidden="true"><IconoCheck /></span>
        <h3>Mensaje enviado</h3>
        <p>Gracias, {nombre.split(" ")[0]}. {primerNombre} te contacta muy pronto.</p>
        <a
          href={wa(asesorTelefono, `Hola ${primerNombre}, soy ${nombre.trim()}. Me interesa ${titulo} (${url})`)}
          className="btn btn-ghost"
          target="_blank"
          rel="noopener noreferrer"
        >
          Seguir por WhatsApp
        </a>
      </div>
    );
  }

  const descError = (k: keyof Errores) => (errores[k] ? `${id}-${k}-error` : undefined);

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <Campo id={`${id}-nombre`} etiqueta="Nombre" error={errores.nombre}>
        <input
          id={`${id}-nombre`}
          autoComplete="name"
          value={nombre}
          aria-invalid={!!errores.nombre}
          aria-describedby={descError("nombre")}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
        />
      </Campo>
      <Campo id={`${id}-telefono`} etiqueta="Teléfono" error={errores.telefono}>
        <input
          id={`${id}-telefono`}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={telefono}
          aria-invalid={!!errores.telefono}
          aria-describedby={descError("telefono")}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="(452) 000 0000"
        />
      </Campo>
      <Campo id={`${id}-correo`} etiqueta="Correo (opcional)" error={errores.correo}>
        <input
          id={`${id}-correo`}
          type="email"
          autoComplete="email"
          value={correo}
          aria-invalid={!!errores.correo}
          aria-describedby={descError("correo")}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
        />
      </Campo>
      <Campo id={`${id}-mensaje`} etiqueta="Mensaje">
        <textarea id={`${id}-mensaje`} rows={3} value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
      </Campo>

      {estado === "error" && (
        <p className={styles.errorEnvio} role="alert">
          {errorEnvio}. Intenta de nuevo o escríbenos por WhatsApp.
        </p>
      )}

      <button type="submit" className={`btn btn-gold ${styles.enviar}`} disabled={estado === "enviando"}>
        {estado === "enviando" ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
