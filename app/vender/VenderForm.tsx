"use client";

import { useId, useState } from "react";
import { track } from "@/lib/analytics";
import { IconoWhatsapp } from "@/components/IconosContacto";
import styles from "./vender.module.css";
import { IconoCheck } from "@/components/Iconos";

type Estado = "idle" | "enviando" | "ok" | "error";
type Operacion = "vender" | "rentar";

const TIPOS = ["Casa", "Departamento", "Terreno", "Local", "Oficina", "Bodega"];

export default function VenderForm({ operacionInicial = "vender" }: { operacionInicial?: Operacion }) {
  const id = useId();
  const [d, setD] = useState({
    operacion: operacionInicial as Operacion,
    tipo: "Casa",
    colonia: "",
    m2Construccion: "",
    m2Terreno: "",
    recamaras: "",
    nombre: "",
    telefono: "",
    correo: "",
    comentarios: "",
  });
  const [estado, setEstado] = useState<Estado>("idle");
  const [error, setError] = useState("");

  const cambiar = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setD((x) => ({ ...x, [e.target.name]: e.target.value }));

  const detalles = () =>
    [
      `Tipo: ${d.tipo}`,
      d.colonia && `Colonia: ${d.colonia}`,
      d.m2Construccion && `Construcción: ${d.m2Construccion} m²`,
      d.m2Terreno && `Terreno: ${d.m2Terreno} m²`,
      d.recamaras && `Recámaras: ${d.recamaras}`,
      d.comentarios && `Comentarios: ${d.comentarios}`,
    ]
      .filter(Boolean)
      .join(". ");

  const whatsappHref = () => {
    const texto = `Hola, soy ${d.nombre || "..."}. Quiero ${d.operacion === "vender" ? "vender" : "rentar"} mi propiedad. ${detalles()}.`;
    return `https://wa.me/524520000000?text=${encodeURIComponent(texto)}`;
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado("enviando");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: d.nombre,
          telefono: d.telefono,
          correo: d.correo || undefined,
          operacion: d.operacion === "vender" ? "Vender" : "Rentar mi propiedad",
          tipo: d.tipo,
          mensaje: detalles(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "No se pudo enviar");
      track("enviar_formulario_vender", { operacion: d.operacion, tipo: d.tipo });
      setEstado("ok");
    } catch (err) {
      setEstado("error");
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  };

  if (estado === "ok") {
    return (
      <div className={styles.exito} role="status">
        <span className={styles.exitoMarca} aria-hidden="true"><IconoCheck /></span>
        <h3>¡Gracias, {d.nombre.split(" ")[0] || "listo"}!</h3>
        <p>
          Recibimos los datos de tu propiedad. Un asesor te contactará para agendar la visita y
          preparar el avalúo comercial. Si quieres adelantar fotos o dudas, escríbenos por WhatsApp.
        </p>
        <a href={whatsappHref()} className="btn btn-gold" target="_blank" rel="noopener noreferrer">
          <IconoWhatsapp /> Continuar por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={enviar} aria-describedby={`${id}-nota`}>
      <fieldset className={styles.grupo}>
        <legend className={styles.leyenda}>¿Qué quieres hacer?</legend>
        <div className={styles.segmento}>
          {(["vender", "rentar"] as const).map((op) => (
            <label key={op} className={`${styles.opcion} ${d.operacion === op ? styles.opcionActiva : ""}`}>
              <input
                type="radio"
                name="operacion"
                value={op}
                checked={d.operacion === op}
                onChange={cambiar}
              />
              {op === "vender" ? "Vender" : "Rentar"}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.fila}>
        <div className={styles.campo}>
          <label htmlFor={`${id}-tipo`}>Tipo de inmueble</label>
          <select id={`${id}-tipo`} name="tipo" value={d.tipo} onChange={cambiar}>
            {TIPOS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className={styles.campo}>
          <label htmlFor={`${id}-colonia`}>Colonia</label>
          <input
            id={`${id}-colonia`}
            name="colonia"
            value={d.colonia}
            onChange={cambiar}
            placeholder="Ej. Centro"
            autoComplete="address-level3"
          />
        </div>
      </div>

      <div className={styles.filaTres}>
        <div className={styles.campo}>
          <label htmlFor={`${id}-m2c`}>m² de construcción</label>
          <input
            id={`${id}-m2c`}
            name="m2Construccion"
            type="number"
            inputMode="numeric"
            min={0}
            value={d.m2Construccion}
            onChange={cambiar}
          />
        </div>
        <div className={styles.campo}>
          <label htmlFor={`${id}-m2t`}>m² de terreno</label>
          <input
            id={`${id}-m2t`}
            name="m2Terreno"
            type="number"
            inputMode="numeric"
            min={0}
            value={d.m2Terreno}
            onChange={cambiar}
          />
        </div>
        <div className={styles.campo}>
          <label htmlFor={`${id}-rec`}>Recámaras</label>
          <input
            id={`${id}-rec`}
            name="recamaras"
            type="number"
            inputMode="numeric"
            min={0}
            max={20}
            value={d.recamaras}
            onChange={cambiar}
          />
        </div>
      </div>

      <div className={styles.campo}>
        <label htmlFor={`${id}-nombre`}>Nombre completo</label>
        <input
          id={`${id}-nombre`}
          name="nombre"
          required
          value={d.nombre}
          onChange={cambiar}
          autoComplete="name"
          placeholder="Tu nombre"
        />
      </div>

      <div className={styles.fila}>
        <div className={styles.campo}>
          <label htmlFor={`${id}-tel`}>Teléfono</label>
          <input
            id={`${id}-tel`}
            name="telefono"
            type="tel"
            required
            value={d.telefono}
            onChange={cambiar}
            autoComplete="tel"
            placeholder="(452) 000 0000"
          />
        </div>
        <div className={styles.campo}>
          <label htmlFor={`${id}-correo`}>Correo (opcional)</label>
          <input
            id={`${id}-correo`}
            name="correo"
            type="email"
            value={d.correo}
            onChange={cambiar}
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
          />
        </div>
      </div>

      <div className={styles.campo}>
        <label htmlFor={`${id}-com`}>Comentarios (opcional)</label>
        <textarea
          id={`${id}-com`}
          name="comentarios"
          rows={4}
          value={d.comentarios}
          onChange={cambiar}
          placeholder="Estado del inmueble, si tiene escrituras, cuándo te gustaría vender o rentar…"
        />
      </div>

      {estado === "error" && (
        <p className={styles.error} role="alert">
          {error}. Intenta de nuevo o escríbenos por WhatsApp.
        </p>
      )}

      <button type="submit" className={`btn btn-gold ${styles.enviar}`} disabled={estado === "enviando"}>
        {estado === "enviando" ? "Enviando…" : "Quiero mi asesoría sin costo"}
        {estado !== "enviando" && <span className="arrow" aria-hidden="true">→</span>}
      </button>
      <p id={`${id}-nota`} className={styles.notaForm}>
        Solo usamos tus datos para contactarte sobre tu propiedad.
      </p>
    </form>
  );
}
