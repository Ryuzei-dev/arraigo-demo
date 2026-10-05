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
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.inner}>
          <Link prefetch={false} href="/" className={styles.brand}>
            <span className={styles.mark} aria-hidden="true">
              A
            </span>
            <span className={styles.name}>
              Arraigo
              <small>Asesoría &amp; Venta</small>
            </span>
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
            <a href="tel:+524520000000" className={styles.phone}>
              (452) 000 0000
            </a>
            <Link prefetch={false}
              href="/favoritos"
              className={`${styles.fav} ${esActivo(pathname, "/favoritos") ? styles.favActivo : ""}`}
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
          {links.map((l) => (
            <Link prefetch={false}
              key={l.href}
              href={l.href}
              className={`${styles.mobileLink} ${esActivo(pathname, l.href) ? styles.mobileActivo : ""}`}
              aria-current={esActivo(pathname, l.href) ? "page" : undefined}
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
          <a href="tel:+524520000000" className={styles.mobilePhone}>
            Llámanos: (452) 000 0000
          </a>
        </div>
      </nav>
    </>
  );
}
