"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Un solo observador para todos los [data-reveal] de la página (se reinicia al navegar).
 * También marca con "enVista" los [data-animar], para que las animaciones continuas
 * (hero, cinta de fotos) solo corran mientras se ven.
 */
export default function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.visible)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
    );
    els.forEach((el) => io.observe(el));

    const animados = document.querySelectorAll<HTMLElement>("[data-animar]");
    const ioAnim = new IntersectionObserver((entradas) => {
      for (const e of entradas) e.target.classList.toggle("enVista", e.isIntersecting);
    });
    animados.forEach((el) => ioAnim.observe(el));

    return () => {
      io.disconnect();
      ioAnim.disconnect();
    };
  }, [pathname]);
  return null;
}
