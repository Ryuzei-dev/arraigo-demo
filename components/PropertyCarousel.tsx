"use client";

import { useEffect, useRef, useState } from "react";
import PropertyCard from "./PropertyCard";
import type { Propiedad } from "@/lib/properties";
import styles from "./PropertyCarousel.module.css";

/**
 * Carrusel de propiedades con scroll nativo y scroll-snap: el navegador lo mueve en su
 * propio hilo (fluido en táctil y con trackpad). Las flechas solo aparecen con ratón.
 */
export default function PropertyCarousel({ items }: { items: Propiedad[] }) {
  const pista = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(items.length > 1);

  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    let pendiente = 0;
    const medir = () => {
      pendiente = 0;
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    const alMover = () => {
      if (!pendiente) pendiente = requestAnimationFrame(medir);
    };
    medir();
    el.addEventListener("scroll", alMover, { passive: true });
    const ro = new ResizeObserver(alMover);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", alMover);
      ro.disconnect();
      cancelAnimationFrame(pendiente);
    };
  }, []);

  const mover = (dir: 1 | -1) => {
    const el = pista.current;
    const slide = el?.firstElementChild as HTMLElement | null;
    if (!el || !slide) return;
    const paso = slide.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
    el.scrollBy({ left: dir * paso, behavior: "smooth" });
  };

  return (
    <div className={styles.wrap}>
      <div
        ref={pista}
        className={styles.pista}
        tabIndex={0}
        role="region"
        aria-label="Propiedades destacadas, desliza para ver más"
      >
        {items.map((p, i) => (
          <div className={styles.slide} key={p.slug}>
            <PropertyCard p={p} index={i} />
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <span className={styles.hint}>Desliza para ver más</span>
        <div className={styles.btns}>
          <button aria-label="Anterior" className={styles.arrow} disabled={!canPrev} onClick={() => mover(-1)}>
            ←
          </button>
          <button aria-label="Siguiente" className={styles.arrow} disabled={!canNext} onClick={() => mover(1)}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}
