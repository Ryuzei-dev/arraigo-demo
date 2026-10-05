import Image from "next/image";
import styles from "./HeroBackground.module.css";

/** Fondo de la portada: foto a sangre con un acercamiento lento en CSS (sin JavaScript).
 *  next/image sirve el tamaño y formato justos para cada pantalla y la precarga. */
export default function HeroBackground({ image }: { image: string }) {
  return (
    <div className={styles.bg} data-animar>
      <div className={styles.img}>
        <Image src={image} alt="" fill preload fetchPriority="high" sizes="100vw" quality={60} className={styles.foto} />
      </div>
    </div>
  );
}
