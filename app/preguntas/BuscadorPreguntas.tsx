"use client";

import { useId, useMemo, useState } from "react";
import type { CategoriaFaq, Faq } from "@/lib/content";
import styles from "./preguntas.module.css";

/** Quita acentos y mayúsculas para buscar "credito" y encontrar "crédito" */
function normalizar(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default function BuscadorPreguntas({ faqs, categorias }: { faqs: Faq[]; categorias: CategoriaFaq[] }) {
  const id = useId();
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState<CategoriaFaq | null>(null);
  const [abierta, setAbierta] = useState<string | null>(null);

  const resultado = useMemo(() => {
    const palabras = normalizar(texto).split(/\s+/).filter(Boolean);
    return faqs.filter((f) => {
      if (categoria && f.categoria !== categoria) return false;
      if (!palabras.length) return true;
      const donde = normalizar(`${f.q} ${f.a}`);
      return palabras.every((p) => donde.includes(p));
    });
  }, [faqs, texto, categoria]);

  const conteo = (c: CategoriaFaq) => faqs.filter((f) => f.categoria === c).length;

  return (
    <div className={styles.buscador}>
      <div className={styles.controles}>
        <div className={styles.campoBusqueda}>
          <label htmlFor={`${id}-q`} className={styles.etiqueta}>
            Busca tu duda
          </label>
          <input
            id={`${id}-q`}
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Ej. documentos, Infonavit, comisión"
            autoComplete="off"
            aria-controls={`${id}-lista`}
          />
        </div>

        <div className={styles.chipsWrap}>
          <div className={styles.chips} role="group" aria-label="Filtrar por tema">
            <button
              type="button"
              className={`${styles.chip} ${categoria === null ? styles.chipActivo : ""}`}
              aria-pressed={categoria === null}
              onClick={() => setCategoria(null)}
            >
              Todas <span className={styles.chipN}>{faqs.length}</span>
            </button>
            {categorias.map((c) => (
              <button
                key={c}
                type="button"
                className={`${styles.chip} ${categoria === c ? styles.chipActivo : ""}`}
                aria-pressed={categoria === c}
                onClick={() => setCategoria(categoria === c ? null : c)}
              >
                {c} <span className={styles.chipN}>{conteo(c)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className={styles.estado} role="status" aria-live="polite">
        {resultado.length === 1 ? "1 pregunta" : `${resultado.length} preguntas`}
        {categoria ? ` en ${categoria}` : ""}
        {texto.trim() ? ` para "${texto.trim()}"` : ""}
      </p>

      <div id={`${id}-lista`} className={styles.lista}>
        {resultado.length === 0 && (
          <div className={styles.sinResultados}>
            <p>No encontramos preguntas con esas palabras.</p>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setTexto("");
                setCategoria(null);
              }}
            >
              Ver todas las preguntas
            </button>
          </div>
        )}
        {resultado.map((f) => {
          const abiertaEsta = abierta === f.q;
          const panel = `${id}-r-${faqs.indexOf(f)}`;
          return (
            <div key={f.q} className={`${styles.item} ${abiertaEsta ? styles.itemAbierto : ""}`}>
              <h2 className={styles.pregunta}>
                <button
                  type="button"
                  aria-expanded={abiertaEsta}
                  aria-controls={panel}
                  onClick={() => setAbierta(abiertaEsta ? null : f.q)}
                >
                  <span className={styles.preguntaTexto}>
                    {f.categoria && (
                      <span className={styles.cat} aria-hidden="true">
                        {f.categoria}
                      </span>
                    )}
                    {f.q}
                  </span>
                  <span className={styles.icono} aria-hidden="true">
                    {abiertaEsta ? "−" : "+"}
                  </span>
                </button>
              </h2>
              <div id={panel} className={styles.respuesta} hidden={!abiertaEsta}>
                <p>{f.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
