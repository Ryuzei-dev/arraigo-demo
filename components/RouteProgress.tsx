"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./RouteProgress.module.css";

export default function RouteProgress() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(false);
  const trickle = useRef<number | null>(null);
  const hide = useRef<number | null>(null);

  const start = () => {
    if (hide.current) {
      clearTimeout(hide.current);
      hide.current = null;
    }
    setActive(true);
    setWidth(10);
    if (trickle.current) clearInterval(trickle.current);
    trickle.current = window.setInterval(() => {
      setWidth((w) => (w < 90 ? w + Math.max(1, (92 - w) * 0.12) : w));
    }, 250);
  };

  const finish = () => {
    if (trickle.current) {
      clearInterval(trickle.current);
      trickle.current = null;
    }
    setWidth(100);
    hide.current = window.setTimeout(() => {
      setActive(false);
      setWidth(0);
    }, 320);
  };

  // Inicia al hacer clic en un enlace interno que cambia de página.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (a.getAttribute("target") === "_blank") return;
      try {
        const url = new URL(a.href, location.href);
        if (url.origin !== location.origin) return;
        // Solo cambios de ruta (no mismo pathname / anclas / cambios de query).
        if (url.pathname === location.pathname) return;
      } catch {
        return;
      }
      start();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Termina cuando la ruta ya cambió.
  useEffect(() => {
    finish();
    return () => {
      if (trickle.current) clearInterval(trickle.current);
      if (hide.current) clearTimeout(hide.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      className={`${styles.bar} ${active ? styles.active : ""}`}
      style={{ width: `${width}%` }}
      aria-hidden="true"
    />
  );
}
