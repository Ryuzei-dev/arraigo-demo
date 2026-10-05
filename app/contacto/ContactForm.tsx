"use client";

import { useState } from "react";
import styles from "./contacto.module.css";

type Estado = "idle" | "enviando" | "ok" | "error";

export default function ContactForm() {
  const [data, setData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    operacion: "Comprar",
    tipo: "Casa",
    mensaje: "",
  });
  const [estado, setEstado] = useState<Estado>("idle");
  const [error, setError] = useState("");

  const handle = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => setData((d) => ({ ...d, [e.target.name]: e.target.value }));

  const whatsappHref = () => {
    const texto = `Hola, soy ${data.nombre || "..."}.
Me interesa ${data.operacion.toLowerCase()} un inmueble tipo ${data.tipo}.
${data.mensaje ? `Mensaje: ${data.mensaje}` : ""}
Mi teléfono: ${data.telefono}`;
    return `https://wa.me/524520000000?text=${encodeURIComponent(texto)}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado("enviando");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "No se pudo enviar");
      }
      setEstado("ok");
    } catch (err) {
      setEstado("error");
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  };

  if (estado === "ok") {
    return (
      <div className={styles.success}>
        <span className={styles.successMark}>✦</span>
        <h3>¡Gracias, {data.nombre.split(" ")[0] || "listo"}!</h3>
        <p>
          Recibimos tu solicitud. Un asesor de Arraigo te contactará muy
          pronto. Si prefieres, escríbenos directo por WhatsApp.
        </p>
        <a
          href={whatsappHref()}
          className="btn btn-gold"
          target="_blank"
          rel="noopener noreferrer"
        >
          Continuar por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.field}>
        <label htmlFor="nombre">Nombre completo</label>
        <input
          id="nombre"
          name="nombre"
          required
          value={data.nombre}
          onChange={handle}
          placeholder="Tu nombre"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            name="telefono"
            required
            type="tel"
            value={data.telefono}
            onChange={handle}
            placeholder="(452) 000 0000"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="correo">Correo (opcional)</label>
          <input
            id="correo"
            name="correo"
            type="email"
            value={data.correo}
            onChange={handle}
            placeholder="tucorreo@ejemplo.com"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="operacion">Quiero</label>
          <select
            id="operacion"
            name="operacion"
            value={data.operacion}
            onChange={handle}
          >
            <option>Comprar</option>
            <option>Vender</option>
            <option>Rentar</option>
            <option>Asesoría</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="tipo">Tipo de inmueble</label>
          <select id="tipo" name="tipo" value={data.tipo} onChange={handle}>
            <option>Casa</option>
            <option>Departamento</option>
            <option>Terreno</option>
            <option>Local</option>
            <option>Oficina</option>
            <option>Bodega</option>
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="mensaje">Mensaje (opcional)</label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={4}
          value={data.mensaje}
          onChange={handle}
          placeholder="Cuéntanos qué buscas: zona, presupuesto, características…"
        />
      </div>

      {estado === "error" && (
        <p className={styles.formError}>
          {error}. Intenta de nuevo o escríbenos por WhatsApp.
        </p>
      )}

      <button
        type="submit"
        className="btn btn-gold"
        style={{ width: "100%", justifyContent: "center" }}
        disabled={estado === "enviando"}
      >
        {estado === "enviando" ? "Enviando…" : "Enviar solicitud"}
        {estado !== "enviando" && <span className="arrow">→</span>}
      </button>

      <a
        href={whatsappHref()}
        className={styles.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        o escríbenos directo por WhatsApp
      </a>
    </form>
  );
}
