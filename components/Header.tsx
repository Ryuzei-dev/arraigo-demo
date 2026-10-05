"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLista } from "@/lib/guardados";
import { IconoCorazon } from "@/components/IconosContacto";
import styles from "./Header.module.css";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/vender", label: "Vender" },
  { href: "/servicios", label: "Servicios" },
  { href: "/asesores", label: "Asesores" },
  { href: "/guias", label: "Guías" },
  { href: "/contacto", label: "Contacto" },
];

// Solo en el menú de celular, debajo de los principales
const secundarios = [
  { href: "/colonias", label: "Colonias" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/preguntas", label: "Preguntas frecuentes" },
  { href: "/favoritos", label: "Favoritos" },
];

const esActivo = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

function CambioTema({ enMenu = false }: { enMenu?: boolean }) {
  const [oscuro, setOscuro] = useState(false);
  useEffect(() => setOscuro(document.documentElement.dataset.tema === "oscuro"), []);
  const cambiar = () => {
    const nuevo = !oscuro;
    setOscuro(nuevo);
    if (nuevo) document.documentElement.dataset.tema = "oscuro";
    else delete document.documentElement.dataset.tema;
    try {
      if (nuevo) localStorage.setItem("tema", "oscuro");
      else localStorage.removeItem("tema");
    } catch {}
  };
  if (enMenu)
    return (
      <button type="button" className={styles.temaMenu} onClick={cambiar} role="switch" aria-checked={oscuro}>
        <span>Modo oscuro</span>
        <span className={styles.interruptor} aria-hidden="true" />
      </button>
    );
  return (
    <button type="button" className={styles.tema} onClick={cambiar} aria-pressed={oscuro} aria-label={oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"} title={oscuro ? "Modo claro" : "Modo oscuro"}>
      {oscuro ? (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
      )}
    </button>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const favoritos = useLista("favoritos");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Esc cierra el menú de celular
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (pathname.startsWith("/studio")) return null;

  const nFav = favoritos.length;

  return (
    <>
      {/* En el inicio, sobre la foto del hero, la barra va en claro (tono oscuro de fondo) */}
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${pathname === "/" && !scrolled ? "tono-oscuro " + styles.sobreFoto : ""}`}>
        <div className={styles.inner}>
          <Link prefetch={false} href="/" className={styles.brand}>
            <span className={styles.name}>Arraigo</span>
          </Link>

          <nav className={styles.nav} aria-label="Principal">
            {links.map((l) => {
              const active = esActivo(pathname, l.href);
              return (
                <Link
                  prefetch={l.href === "/propiedades" ? undefined : false}
                  key={l.href}
                  href={l.href}
                  className={`${styles.link} ${active ? styles.active : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.right}>
            <CambioTema />
            <a href="tel:+524520000000" className={styles.phone}>
              (452) 000 0000
            </a>
            <Link prefetch={false}
              href="/favoritos"
              className={`${styles.fav} ${nFav > 0 ? styles.favConN : ""} ${esActivo(pathname, "/favoritos") ? styles.favActivo : ""}`}
              aria-label={nFav ? `Favoritos, ${nFav} guardadas` : "Favoritos"}
              title="Favoritos"
            >
              <IconoCorazon size={20} />
              {nFav > 0 && (
                <span className={styles.favN} aria-hidden="true">
                  {nFav}
                </span>
              )}
            </Link>
            <button
              className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              aria-controls="menu-movil"
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay del menú móvil: fuera del <header> para no quedar atrapado
          por el backdrop-filter (containing block) al hacer scroll. */}
      <nav
        id="menu-movil"
        className={`${styles.mobile} ${open ? styles.mobileOpen : ""}`}
        aria-label="Menú"
        inert={!open}
      >
        <div className={styles.mobileInner}>
          {links.map((l, i) => (
            <Link prefetch={false}
              key={l.href}
              href={l.href}
              className={`${styles.mobileLink} ${esActivo(pathname, l.href) ? styles.mobileActivo : ""}`}
              aria-current={esActivo(pathname, l.href) ? "page" : undefined}
              style={{ transitionDelay: open ? `${60 + i * 35}ms` : "0ms" }}
            >
              {l.label}
            </Link>
          ))}
          <div className={styles.mobileSecundarios}>
            {secundarios.map((l) => (
              <Link prefetch={false}
                key={l.href}
                href={l.href}
                className={`${styles.mobileSec} ${esActivo(pathname, l.href) ? styles.mobileActivo : ""}`}
                aria-current={esActivo(pathname, l.href) ? "page" : undefined}
              >
                {l.label}
                {l.href === "/favoritos" && nFav > 0 && <span className={styles.mobileN}>{nFav}</span>}
              </Link>
            ))}
          </div>
          <div className={styles.mobileAcciones}>
            <Link prefetch={false} href="/contacto" className="btn btn-gold">
              Agendar asesoría sin costo
            </Link>
            <a href="tel:+524520000000" className={styles.mobilePhone}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M6.6 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.1 6.1l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              (452) 000 0000
            </a>
          </div>
          <CambioTema enMenu />
        </div>
      </nav>
    </>
  );
}
