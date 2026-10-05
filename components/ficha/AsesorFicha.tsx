import Link from "next/link";
import type { Asesor } from "@/lib/asesores";
import { whatsappAsesor } from "@/lib/asesores";
import styles from "./ficha.module.css";

/** Tarjeta del asesor asignado a la propiedad (iniciales en lugar de foto) */
export default function AsesorFicha({
  asesor,
  titulo,
  url,
}: {
  asesor: Asesor;
  titulo: string;
  url: string;
}) {
  const primerNombre = asesor.nombre.split(" ")[0];
  return (
    <div className={styles.asesor}>
      <div className={styles.asesorCabecera}>
        <span className={styles.avatar} aria-hidden="true">
          {asesor.iniciales}
        </span>
        <div className={styles.asesorDatos}>
          <h3 className={styles.asesorNombre}>{asesor.nombre}</h3>
          <p className={styles.asesorRol}>{asesor.rol}</p>
          <p className={styles.asesorEsp}>{asesor.especialidad}</p>
        </div>
      </div>
      <div className={styles.asesorBotones}>
        <a
          href={whatsappAsesor(asesor, `Hola ${primerNombre}, me interesa ${titulo} (${url})`)}
          className={`btn btn-gold ${styles.enviar}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp a {primerNombre}
        </a>
        <div className={styles.asesorSecundarios}>
          <a href={`tel:+${asesor.telefono}`} className={`btn btn-ghost ${styles.enviar}`}>
            Llamar
          </a>
          {asesor.slug && (
            <Link href={`/asesores/${asesor.slug}`} className={`btn btn-ghost ${styles.enviar}`}>
              Ver perfil
            </Link>
          )}
        </div>
        <a href={`tel:+${asesor.telefono}`} className={styles.asesorTel}>
          {asesor.telefonoVisible}
        </a>
      </div>
    </div>
  );
}
