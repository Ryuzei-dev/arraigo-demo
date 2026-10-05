"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./Gallery.module.css";

export default function Gallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true });
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });
  const [selected, setSelected] = useState(0);

  // Visor a pantalla completa
  const dialogo = useRef<HTMLDialogElement>(null);
  const botonCerrar = useRef<HTMLButtonElement>(null);
  const origen = useRef<HTMLElement | null>(null);
  const [abierto, setAbierto] = useState(false);
  const [actual, setActual] = useState(0);
  const toque = useRef<{ x: number; y: number } | null>(null);
  const total = images.length;

  const onThumb = useCallback(
    (i: number) => {
      mainApi?.scrollTo(i);
    },
    [mainApi]
  );

  const onSelect = useCallback(() => {
    if (!mainApi) return;
    const i = mainApi.selectedScrollSnap();
    setSelected(i);
    thumbApi?.scrollTo(i);
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
    return () => {
      mainApi.off("select", onSelect);
      mainApi.off("reInit", onSelect);
    };
  }, [mainApi, onSelect]);

  const abrir = (i: number, desde: HTMLElement) => {
    // Embla ya descarta el clic que llega al soltar un arrastre del carrusel
    origen.current = desde;
    setActual(i);
    setAbierto(true);
  };

  const cerrar = useCallback(() => setAbierto(false), []);
  const mover = useCallback(
    (paso: number) => setActual((i) => (i + paso + total) % total),
    [total]
  );

  // Abre o cierra el <dialog>, bloquea el scroll de la página y devuelve el foco
  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierto) {
      if (!d.open) d.showModal();
      botonCerrar.current?.focus();
      const html = document.documentElement;
      const previo = html.style.overflow;
      html.style.overflow = "hidden";
      return () => {
        html.style.overflow = previo;
      };
    }
    if (d.open) d.close();
    if (origen.current) {
      // La galería queda en la foto que se veía en el visor
      if (mainApi && mainApi.selectedScrollSnap() !== actual) mainApi.scrollTo(actual, true);
      origen.current.focus({ preventScroll: true });
      origen.current = null;
    }
    // Solo reacciona a abrir/cerrar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto]);

  const onTecla = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      mover(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      mover(-1);
    }
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.main} ref={mainRef}>
        <div className={styles.mainContainer}>
          {images.map((src, i) => (
            <div className={styles.mainSlide} key={i}>
              <button
                type="button"
                className={styles.abrir}
                onClick={(e) => abrir(i, e.currentTarget)}
                aria-label={`Ver imagen ${i + 1} de ${total} en pantalla completa`}
                tabIndex={i === selected ? 0 : -1}
              >
                <Image
                  src={src}
                  alt={`${title}, imagen ${i + 1}`}
                  fill
                  sizes="(max-width: 900px) 100vw, 1000px"
                  quality={60}
                  className={styles.img}
                  preload={i === 0}
                />
              </button>
            </div>
          ))}
        </div>
        <span className={styles.counter} aria-hidden="true">
          {String(selected + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </span>
        <span className={styles.ampliar} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
        </span>
      </div>

      <div className={styles.thumbs} ref={thumbRef}>
        <div className={styles.thumbContainer}>
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onThumb(i)}
              className={`${styles.thumb} ${
                i === selected ? styles.thumbActive : ""
              }`}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === selected ? "true" : undefined}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="160px"
                quality={50}
                className={styles.img}
              />
            </button>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogo}
        className={styles.visor}
        aria-label={`Fotos de ${title}`}
        onCancel={(e) => {
          e.preventDefault();
          cerrar();
        }}
        onKeyDown={onTecla}
        onClick={(e) => {
          if (e.target === e.currentTarget) cerrar();
        }}
      >
        {abierto && (
          <>
            <div
              className={styles.visorEscena}
              onClick={(e) => {
                // Clic en el fondo, fuera de la foto
                if (e.target === e.currentTarget) cerrar();
              }}
              onTouchStart={(e) => {
                const t = e.touches[0];
                toque.current = { x: t.clientX, y: t.clientY };
              }}
              onTouchEnd={(e) => {
                const ini = toque.current;
                toque.current = null;
                if (!ini) return;
                const t = e.changedTouches[0];
                const dx = t.clientX - ini.x;
                const dy = t.clientY - ini.y;
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) mover(dx < 0 ? 1 : -1);
              }}
            >
              <div className={styles.visorFoto} key={actual}>
                <Image
                  src={images[actual]}
                  alt={`${title}, imagen ${actual + 1}`}
                  fill
                  sizes="100vw"
                  className={styles.visorImg}
                />
              </div>
            </div>

            <p className={styles.visorContador} aria-live="polite">
              {actual + 1} / {total}
            </p>
            <button
              ref={botonCerrar}
              type="button"
              className={`${styles.visorBoton} ${styles.visorCerrar}`}
              onClick={cerrar}
              aria-label="Cerrar visor"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            {total > 1 && (
              <>
                <button type="button" className={`${styles.visorBoton} ${styles.visorPrev}`} onClick={() => mover(-1)} aria-label="Foto anterior">
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
                <button type="button" className={`${styles.visorBoton} ${styles.visorNext}`} onClick={() => mover(1)} aria-label="Foto siguiente">
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </>
        )}
      </dialog>
    </div>
  );
}
