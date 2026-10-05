"use client";

import { useEffect } from "react";

/**
 * Comportamiento del inicio, con listeners pasivos y un solo rAF por cuadro:
 * cifras que cuentan, declaración que se enciende con el scroll, número fijo del proceso,
 * desplazamiento suave de la foto del hero, filtro del carril y foto que sigue al cursor.
 */
export default function InicioVivo() {
  useEffect(() => {
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const limpiar: (() => void)[] = [];

    // Cifras que cuentan al entrar
    const ojoCifras = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          ojoCifras.unobserve(el);
          const fin = Number(el.dataset.contar);
          const pre = el.dataset.prefijo ?? "";
          if (quieto || fin === 0) return;
          const t0 = performance.now();
          const paso = (t: number) => {
            const k = Math.min(1, (t - t0) / 1100);
            el.textContent = pre + Math.round(fin * (1 - Math.pow(1 - k, 3)));
            if (k < 1) requestAnimationFrame(paso);
          };
          requestAnimationFrame(paso);
        });
      },
      { threshold: 0.6 }
    );
    document.querySelectorAll("[data-contar]").forEach((el) => ojoCifras.observe(el));
    limpiar.push(() => ojoCifras.disconnect());

    // Declaración: cada palabra se enciende conforme avanza el scroll
    const decl = document.querySelector<HTMLElement>("[data-llenar]");
    if (decl && !decl.dataset.listo) {
      decl.dataset.listo = "1";
      decl.innerHTML = decl.textContent!.trim().split(/\s+/).map((w) => `<span>${w}</span>`).join(" ");
    }
    const palabras = decl ? [...decl.querySelectorAll("span")] : [];

    const proceso = document.querySelector<HTMLElement>("[data-proceso]");
    const nums = [...document.querySelectorAll<HTMLElement>("[data-num]")];
    const pasos = [...document.querySelectorAll<HTMLElement>("[data-paso]")];
    const avance = document.querySelector<HTMLElement>("[data-avance]");
    const foto = document.querySelector<HTMLElement>("[data-hero-foto]");

    let pendiente = false;
    const medir = () => {
      pendiente = false;
      const vh = innerHeight;
      if (decl && palabras.length) {
        const r = decl.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) {
          const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
          const n = Math.round(p * palabras.length);
          palabras.forEach((w, i) => w.classList.toggle("on", i < n));
        }
      }
      if (proceso && pasos.length) {
        const r = proceso.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) {
          let activo = 0;
          pasos.forEach((p, i) => {
            if (p.getBoundingClientRect().top < vh * 0.55) activo = i;
          });
          nums.forEach((n, i) => n.classList.toggle("on", i === activo));
          pasos.forEach((p, i) => p.classList.toggle("on", i === activo));
          const prog = Math.min(1, Math.max(0, (vh * 0.5 - r.top) / (r.height - vh * 0.5)));
          if (avance) avance.style.transform = `scaleX(${prog})`;
        }
      }
      if (foto && !quieto && scrollY < vh * 1.2) {
        const y = Math.min(scrollY, vh);
        foto.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(${1.08 - (y / vh) * 0.06})`;
      }
    };
    const pedir = () => {
      if (!pendiente) {
        pendiente = true;
        requestAnimationFrame(medir);
      }
    };
    addEventListener("scroll", pedir, { passive: true });
    addEventListener("resize", pedir);
    medir();
    limpiar.push(() => {
      removeEventListener("scroll", pedir);
      removeEventListener("resize", pedir);
    });

    // Filtro del carril
    const filtro = document.querySelector<HTMLElement>("[data-filtro]");
    const fichas = [...document.querySelectorAll<HTMLElement>("[data-carril] [data-op]")];
    const botones = filtro ? [...filtro.querySelectorAll<HTMLButtonElement>("button")] : [];
    const alFiltrar = (b: HTMLButtonElement) => () => {
      botones.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      fichas.forEach((f) => f.classList.toggle("fuera", b.dataset.op !== "todas" && f.dataset.op !== b.dataset.op));
    };
    const manejadores = botones.map((b) => {
      const h = alFiltrar(b);
      b.addEventListener("click", h);
      return () => b.removeEventListener("click", h);
    });
    limpiar.push(...manejadores);

    // Lista: la foto sigue al cursor (solo con mouse)
    const lista = document.querySelector<HTMLElement>("[data-compras]");
    const seguidor = document.querySelector<HTMLImageElement>("[data-seguidor]");
    if (lista && seguidor && matchMedia("(pointer: fine)").matches) {
      let x = 0;
      let y = 0;
      let cola = false;
      const mover = (e: PointerEvent) => {
        x = e.clientX;
        y = e.clientY;
        if (cola) return;
        cola = true;
        requestAnimationFrame(() => {
          cola = false;
          seguidor.style.transform = `translate3d(${x + 24}px, ${y - 120}px, 0)`;
        });
      };
      const entrar = (e: PointerEvent) => {
        const li = (e.target as HTMLElement).closest<HTMLElement>("li");
        if (!li) return;
        if (!seguidor.src.endsWith(li.dataset.foto!)) seguidor.src = li.dataset.foto!;
        seguidor.classList.add("on");
      };
      const salir = () => seguidor.classList.remove("on");
      lista.addEventListener("pointermove", mover);
      lista.addEventListener("pointerover", entrar);
      lista.addEventListener("pointerleave", salir);
      limpiar.push(() => {
        lista.removeEventListener("pointermove", mover);
        lista.removeEventListener("pointerover", entrar);
        lista.removeEventListener("pointerleave", salir);
      });
    }

    return () => limpiar.forEach((f) => f());
  }, []);
  return null;
}
