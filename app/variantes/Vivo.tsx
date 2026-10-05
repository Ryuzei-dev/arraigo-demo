"use client";

import { useEffect } from "react";

/**
 * Comportamiento del prototipo, todo con listeners pasivos y rAF:
 * hora de Uruapan en la barra, cifras que cuentan, texto que se "llena" con el scroll,
 * filtro del carril, foto que sigue al cursor en la lista y el número fijo del proceso.
 */
export default function Vivo() {
  useEffect(() => {
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const limpiar: (() => void)[] = [];

    // Hora local de Uruapan
    const hora = document.querySelector<HTMLElement>("[data-hora]");
    const pintarHora = () => {
      if (!hora) return;
      const h = new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Mexico_City" }).format(new Date());
      hora.textContent = `Uruapan · ${h}`;
    };
    pintarHora();
    const reloj = setInterval(pintarHora, 30000);
    limpiar.push(() => clearInterval(reloj));

    // Cifras que cuentan al entrar
    const ojoCifras = new IntersectionObserver((es) => {
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
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-contar]").forEach((el) => ojoCifras.observe(el));
    limpiar.push(() => ojoCifras.disconnect());

    // Declaración: cada palabra se enciende conforme avanza el scroll
    const decl = document.querySelector<HTMLElement>("[data-llenar]");
    if (decl && !decl.dataset.listo) {
      decl.dataset.listo = "1";
      decl.innerHTML = decl.textContent!.trim().split(/\s+/).map((w) => `<span>${w}</span>`).join(" ");
    }
    const palabras = decl ? [...decl.querySelectorAll("span")] : [];

    // Proceso: qué paso está en el centro
    const proceso = document.querySelector<HTMLElement>("[data-proceso]");
    const nums = [...document.querySelectorAll<HTMLElement>("[data-num]")];
    const pasos = [...document.querySelectorAll<HTMLElement>("[data-paso]")];
    const avance = document.querySelector<HTMLElement>("[data-avance]");
    const foto = document.querySelector<HTMLElement>("[data-hero-foto]");

    let pendiente = false;
    const medir = () => {
      pendiente = false;
      const vh = innerHeight;
      if (decl) {
        const r = decl.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
        const n = Math.round(p * palabras.length);
        palabras.forEach((w, i) => w.classList.toggle("on", i < n));
      }
      if (proceso && pasos.length) {
        let activo = 0;
        pasos.forEach((p, i) => {
          if (p.getBoundingClientRect().top < vh * 0.55) activo = i;
        });
        nums.forEach((n, i) => n.classList.toggle("on", i === activo));
        pasos.forEach((p, i) => p.classList.toggle("on", i === activo));
        const r = proceso.getBoundingClientRect();
        const prog = Math.min(1, Math.max(0, (vh * 0.5 - r.top) / (r.height - vh * 0.5)));
        if (avance) avance.style.transform = `scaleX(${prog})`;
      }
      // Barra: transparente sobre el hero, sólida al bajar
      document.querySelector("[data-barra]")?.classList.toggle("solida", scrollY > vh * 0.85);
      if (foto && !quieto) {
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
    filtro?.querySelectorAll<HTMLButtonElement>("button").forEach((b) =>
      b.addEventListener("click", () => {
        filtro.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        fichas.forEach((f) => f.classList.toggle("fuera", b.dataset.op !== "todas" && f.dataset.op !== b.dataset.op));
      })
    );

    // Lista: la foto sigue al cursor (solo mouse)
    const lista = document.querySelector<HTMLElement>("[data-compras]");
    const seguidor = document.querySelector<HTMLImageElement>("[data-seguidor]");
    if (lista && seguidor && matchMedia("(pointer: fine)").matches) {
      let x = 0, y = 0, cola = false;
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
      lista.addEventListener("pointermove", mover);
      lista.addEventListener("pointerover", (e) => {
        const li = (e.target as HTMLElement).closest<HTMLElement>("li");
        if (!li) return;
        if (seguidor.src !== li.dataset.foto) seguidor.src = li.dataset.foto!;
        seguidor.classList.add("on");
      });
      lista.addEventListener("pointerleave", () => seguidor.classList.remove("on"));
    }

    return () => limpiar.forEach((f) => f());
  }, []);
  return null;
}
