"use client";

import { useEffect, useState } from "react";
import s from "./variantes.module.css";

/** Barra de revisión: saltar entre variantes y cambiar claro / oscuro */
export default function CambioVariante() {
  const [oscuro, setOscuro] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.varTema = oscuro ? "oscuro" : "claro";
  }, [oscuro]);
  return (
    <nav className={s.barra} aria-label="Variantes">
      <a href="#expediente">A</a>
      <a href="#vitrina">B</a>
      <a href="#escritura">C</a>
      <button type="button" onClick={() => setOscuro((v) => !v)} aria-pressed={oscuro}>
        {oscuro ? "Ver claro" : "Ver oscuro"}
      </button>
    </nav>
  );
}
