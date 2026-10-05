"use client";

import { useEffect, useState } from "react";
import s from "./variantes.module.css";

const VARIANTES = [
  { id: "arena", n: "1", nombre: "Arena" },
  { id: "noche", n: "2", nombre: "Noche" },
  { id: "piedra", n: "3", nombre: "Piedra" },
];

/** Barra de revisión: variante 1 / 2 / 3 y claro u oscuro */
export default function CambioVariante() {
  const [oscuro, setOscuro] = useState(false);
  const [variante, setVariante] = useState("arena");
  useEffect(() => {
    document.documentElement.dataset.varTema = oscuro ? "oscuro" : "claro";
    document.documentElement.dataset.variante = variante;
  }, [oscuro, variante]);
  return (
    <div className={s.revision} role="group" aria-label="Variantes">
      {VARIANTES.map((v) => (
        <button key={v.id} type="button" aria-pressed={variante === v.id} onClick={() => setVariante(v.id)} title={v.nombre}>
          {v.n} · {v.nombre}
        </button>
      ))}
      <button type="button" onClick={() => setOscuro((x) => !x)} aria-pressed={oscuro}>
        {oscuro ? "Claro" : "Oscuro"}
      </button>
    </div>
  );
}
