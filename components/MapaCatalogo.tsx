"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./MapaCatalogo.module.css";

export interface PuntoMapa {
  slug: string;
  titulo: string;
  colonia: string;
  precio: string;
  /** Precio corto para el pin, p. ej. "$5.9 M" */
  pin: string;
  imagen?: string;
  lat?: number;
  lng?: number;
}

const escapar = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Mapa del catálogo con Leaflet y teselas de OpenStreetMap (sin llave de API).
 * Leaflet se carga solo en el navegador, dentro del efecto.
 */
export default function MapaCatalogo({ puntos }: { puntos: PuntoMapa[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const conGeo = puntos.filter(
    (p): p is PuntoMapa & { lat: number; lng: number } =>
      typeof p.lat === "number" && typeof p.lng === "number"
  );
  const sinGeo = puntos.filter((p) => !conGeo.includes(p as never));
  const firma = conGeo.map((p) => p.slug).join("|");

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo || !conGeo.length) return;
    let mapa: import("leaflet").Map | undefined;
    let cancelado = false;

    import("leaflet")
      .then((mod) => {
        if (cancelado) return;
        const L = mod.default ?? mod;
        const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        mapa = L.map(nodo, {
          scrollWheelZoom: false,
          zoomAnimation: !reducido,
          fadeAnimation: !reducido,
          markerZoomAnimation: !reducido,
          attributionControl: true,
        });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(mapa);

        const marcas = conGeo.map((p) => {
          const icono = L.divIcon({
            className: styles.pinCaja,
            html: `<span class="${styles.pin}">${escapar(p.pin)}</span>`,
            iconSize: undefined,
            iconAnchor: [0, 0],
          });
          const popup = `
            <a class="${styles.popup}" href="/propiedades/${encodeURIComponent(p.slug)}">
              ${p.imagen ? `<img src="${escapar(p.imagen)}" alt="" loading="lazy" />` : ""}
              <span class="${styles.popupTexto}">
                <strong>${escapar(p.titulo)}</strong>
                <span>${escapar(p.colonia)}</span>
                <em>${escapar(p.precio)}</em>
                <span class="${styles.popupVer}">Ver ficha →</span>
              </span>
            </a>`;
          return L.marker([p.lat, p.lng], {
            icon: icono,
            title: `${p.titulo}, ${p.precio}`,
            alt: `${p.titulo}, ${p.precio}`,
            riseOnHover: true,
          })
            .bindPopup(popup, { maxWidth: 260, minWidth: 220, closeButton: true })
            .addTo(mapa!);
        });

        const grupo = L.featureGroup(marcas);
        if (marcas.length === 1) mapa.setView([conGeo[0].lat, conGeo[0].lng], 15);
        else mapa.fitBounds(grupo.getBounds(), { padding: [60, 60], maxZoom: 15 });
      })
      .catch(() => setError(true));

    return () => {
      cancelado = true;
      mapa?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firma]);

  return (
    <div className={styles.marco}>
      {conGeo.length > 0 ? (
        <div
          ref={ref}
          className={styles.mapa}
          role="region"
          aria-label={`Mapa con ${conGeo.length} propiedad${conGeo.length !== 1 ? "es" : ""}`}
        />
      ) : (
        <p className={styles.vacio}>Ninguna de estas propiedades tiene ubicación en el mapa.</p>
      )}
      {error && <p className={styles.vacio}>No pudimos cargar el mapa. Revisa tu conexión.</p>}

      {/* Lista accesible de lo que hay en el mapa y de lo que no tiene ubicación */}
      <details className={styles.lista}>
        <summary>Ver estas propiedades como lista ({puntos.length})</summary>
        <ul>
          {puntos.map((p) => (
            <li key={p.slug}>
              <Link href={`/propiedades/${p.slug}`}>{p.titulo}</Link>
              <span>
                {p.colonia} · {p.precio}
                {sinGeo.includes(p) ? " · sin ubicación en el mapa" : ""}
              </span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
