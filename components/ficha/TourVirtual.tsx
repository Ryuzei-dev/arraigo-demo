"use client";

import Image from "next/image";
import { useState } from "react";
import { track } from "@/lib/analytics";
import styles from "./ficha.module.css";

/** Recorrido 360: el iframe solo se carga cuando la persona lo pide */
export default function TourVirtual({
  url,
  titulo,
  poster,
  slug,
}: {
  url: string;
  titulo: string;
  poster?: string;
  slug: string;
}) {
  const [activo, setActivo] = useState(false);

  return (
    <div className={styles.tour}>
      {activo ? (
        <iframe
          src={url}
          title={`Recorrido virtual 360 de ${titulo}`}
          loading="lazy"
          allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className={styles.tourPoster}
          onClick={() => {
            setActivo(true);
            track("ver_tour", { propiedad: slug });
          }}
        >
          {poster && (
            <Image src={poster} alt="" fill sizes="(max-width: 900px) 100vw, 800px" className={styles.tourImg} />
          )}
          <span className={styles.tourVelo} aria-hidden="true" />
          <span className={styles.tourBoton}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <ellipse cx="12" cy="12" rx="9" ry="4" />
              <path d="M12 3v18" />
              <path d="M10 9.5 14 12l-4 2.5z" fill="currentColor" stroke="none" />
            </svg>
            Ver recorrido 360
          </span>
        </button>
      )}
    </div>
  );
}
