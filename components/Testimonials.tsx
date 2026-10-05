"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { testimonios } from "@/lib/content";
import styles from "./Testimonials.module.css";

export default function Testimonials() {
  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: false,
  });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
  }, [embla, onSelect]);

  return (
    <div className={styles.wrap}>
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {testimonios.map((t, i) => (
            <blockquote className={styles.slide} key={i}>
              <span className={styles.mark}>&ldquo;</span>
              <p className={styles.cita}>{t.cita}</p>
              <footer className={styles.author}>
                <span className={styles.avatar}>{t.nombre.charAt(0)}</span>
                <span>
                  <strong>{t.nombre}</strong>
                  <small>{t.rol}</small>
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>

      <div className={styles.dots}>
        {testimonios.map((_, i) => (
          <button
            key={i}
            aria-label={`Testimonio ${i + 1}`}
            className={`${styles.dot} ${i === selected ? styles.dotActive : ""}`}
            onClick={() => embla?.scrollTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
