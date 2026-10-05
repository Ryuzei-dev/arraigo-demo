"use client";

import { useEffect, useState } from "react";
import s from "./variantes.module.css";

/** Botón de revisión: cambiar entre claro y oscuro */
export default function CambioVariante() {
  const [oscuro, setOscuro] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.varTema = oscuro ? "oscuro" : "claro";
  }, [oscuro]);
  return (
    <button type="button" className={s.tema} onClick={() => setOscuro((v) => !v)} aria-pressed={oscuro}>
      {oscuro ? "Ver claro" : "Ver oscuro"}
    </button>
  );
}
