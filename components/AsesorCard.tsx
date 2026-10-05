import Link from "next/link";
import { whatsappAsesor, type Asesor } from "@/lib/asesores";
import { IconoTelefono, IconoWhatsapp } from "@/components/IconosContacto";
import styles from "./AsesorCard.module.css";

export default function AsesorCard({ a, conPerfil = true }: { a: Asesor; conPerfil?: boolean }) {
  return (
    <article className={styles.card}>
      <div className={styles.cabeza}>
        <span className={styles.avatar} aria-hidden="true">
          {a.iniciales}
        </span>
        <div className={styles.quien}>
          <h3 className={styles.nombre}>
            {conPerfil ? <Link href={`/asesores/${a.slug}`}>{a.nombre}</Link> : a.nombre}
          </h3>
          <p className={styles.rol}>{a.rol}</p>
        </div>
      </div>

      <dl className={styles.datos}>
        <div>
          <dt>Especialidad</dt>
          <dd>{a.especialidad}</dd>
        </div>
        <div>
          <dt>Zonas</dt>
          <dd>{a.zonas.join(", ")}</dd>
        </div>
      </dl>

      <div className={styles.acciones}>
        <a
          href={whatsappAsesor(a, `Hola ${a.nombre.split(" ")[0]}, quiero asesoría inmobiliaria.`)}
          className={`btn btn-gold ${styles.boton}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconoWhatsapp /> WhatsApp
        </a>
        <a href={`tel:+${a.telefono}`} className={`btn btn-ghost ${styles.boton}`}>
          <IconoTelefono /> Llamar
        </a>
      </div>

      {conPerfil && (
        <Link href={`/asesores/${a.slug}`} className={styles.perfil}>
          Ver perfil de {a.nombre.split(" ")[0]} <span className="arrow" aria-hidden="true">→</span>
        </Link>
      )}
    </article>
  );
}
