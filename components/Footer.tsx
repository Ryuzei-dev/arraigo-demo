"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return null;

  return (
    <footer className={styles.footer}>
      {/* En contacto el cierre sobra: la página entera ya es el formulario */}
      {!pathname.startsWith("/contacto") && (
      <div className={styles.cta}>
        <div className="wrap">
          <h2 className="display-l" style={{ marginTop: 24 }}>
            ¿Listo para dar el<br />
            siguiente <span className="italic-gold">paso</span>?
          </h2>
          <div className={styles.ctaBtns}>
            <Link prefetch={false} href="/contacto" className="btn btn-gold">
              Agenda una asesoría <span className="arrow">→</span>
            </Link>
            <a
              href="https://wa.me/524520000000"
              className="btn btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </div>
      )}

      <div className="wrap">
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              <span className={styles.mark}>A</span>
              <span>Arraigo</span>
            </div>
            <p className={styles.tagline}>Raíces firmes para tu patrimonio.</p>
          </div>

          <nav className={styles.col} aria-label="Navega">
            <h2>Navega</h2>
            <Link prefetch={false} href="/propiedades">Propiedades</Link>
            <Link prefetch={false} href="/colonias">Colonias</Link>
            <Link prefetch={false} href="/asesores">Asesores</Link>
            <Link prefetch={false} href="/guias">Guías</Link>
            <Link prefetch={false} href="/preguntas">Preguntas frecuentes</Link>
            <Link prefetch={false} href="/nosotros">Nosotros</Link>
          </nav>

          <nav className={styles.col} aria-label="Operaciones">
            <h2>Operaciones</h2>
            <Link prefetch={false} href="/propiedades?operacion=venta">Comprar</Link>
            <Link prefetch={false} href="/vender">Vender tu propiedad</Link>
            <Link prefetch={false} href="/propiedades?operacion=renta">Rentar</Link>
            <Link prefetch={false} href="/servicios">Servicios</Link>
          </nav>

          <div className={styles.col}>
            <h2>Contacto</h2>
            <a href="tel:+524520000000">(452) 000 0000</a>
            <a href="mailto:contacto@arraigo.example">
              contacto@arraigo.example
            </a>
            <span>Uruapan, Michoacán, México</span>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>
            © 2026 Arraigo. Sitio de demostración hecho por{" "}
            <a href="https://lumikastudio.com" target="_blank" rel="noopener">
              LumikaStudio
            </a>
            .
          </span>
          <div className={styles.legal}>
            <Link prefetch={false} href="/aviso-de-privacidad">Aviso de privacidad</Link>
            <Link prefetch={false} href="/terminos">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
