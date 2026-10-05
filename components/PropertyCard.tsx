import Image from "next/image";
import Link from "next/link";
import BotonGuardar from "./BotonGuardar";
import {
  etiquetaEstado,
  formatoMoneda,
  formatoPrecio,
  precioM2,
  type Propiedad,
} from "@/lib/properties";
import styles from "./PropertyCard.module.css";

/**
 * Tarjeta de propiedad. Toda la tarjeta es clicable mediante el enlace del título
 * (pseudo-elemento extendido); los botones de guardar quedan fuera del enlace.
 * `index` se acepta por compatibilidad con llamadas existentes, ya no se muestra.
 */
export default function PropertyCard({
  p,
  preload = false,
}: {
  p: Propiedad;
  index?: number;
  /** Solo la primera tarjeta visible del catálogo: es el elemento más grande al cargar */
  preload?: boolean;
}) {
  const m2 = precioM2(p);
  const rebajada = p.estado === "rebajada" && p.precioAnterior && p.precioAnterior > p.precio;
  const sufijo = p.operacion === "renta" ? " / mes" : "";

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {p.imagenes[0] && (
          <Image
            src={p.imagenes[0]}
            alt=""
            fill
            sizes="(max-width: 800px) 100vw, 400px"
            quality={60}
            preload={preload}
            className={styles.img}
          />
        )}
        <div className={styles.badges}>
          <span className={styles.op} data-op={p.operacion}>
            {p.operacion === "venta" ? "En venta" : "En renta"}
          </span>
          {p.estado && (
            <span className={styles.estado} data-estado={p.estado}>
              {etiquetaEstado[p.estado]}
            </span>
          )}
        </div>
        <div className={styles.acciones}>
          <BotonGuardar slug={p.slug} titulo={p.titulo} lista="favoritos" />
          <BotonGuardar slug={p.slug} titulo={p.titulo} lista="comparar" />
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.top}>
          <span className={styles.cat}>{p.categoria}</span>
          <span className={styles.loc}>{p.colonia}</span>
        </div>
        <h3 className={styles.title}>
          <Link href={`/propiedades/${p.slug}`} className={styles.enlace}>
            {p.titulo}
          </Link>
        </h3>
        <p className={styles.summary}>{p.resumen}</p>

        <div className={styles.specs}>
          {p.recamaras != null && <span>{p.recamaras} rec</span>}
          {p.banos != null && <span>{p.banos} baños</span>}
          {p.m2Construccion != null && <span>{p.m2Construccion} m²</span>}
          {p.m2Terreno != null && p.m2Construccion == null && (
            <span>{p.m2Terreno} m² terreno</span>
          )}
        </div>

        <div className={styles.foot}>
          <div className={styles.precios}>
            {rebajada && (
              <s className={styles.antes}>
                <span className={styles.sr}>Precio anterior: </span>
                {formatoMoneda(p.precioAnterior!, p.moneda)}
                {sufijo}
              </s>
            )}
            <span className={styles.price}>
              {rebajada && <span className={styles.sr}>Precio actual: </span>}
              {formatoPrecio(p)}
            </span>
            {m2 != null && (
              <span className={styles.m2}>
                {formatoMoneda(m2, p.moneda)}/m²{p.operacion === "renta" ? " al mes" : ""}
              </span>
            )}
          </div>
          <span className={styles.go} aria-hidden="true">
            Ver ficha <span className="arrow">→</span>
          </span>
        </div>
      </div>
    </article>
  );
}
