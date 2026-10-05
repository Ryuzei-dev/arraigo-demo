import Image from "next/image";
import styles from "./ImageMarquee.module.css";

const slides = [
  { src: "/fotos/casas.jpg", label: "Casas" },
  { src: "/fotos/patios.jpg", label: "Patios" },
  { src: "/fotos/departamentos.jpg", label: "Departamentos" },
  { src: "/fotos/terrenos.jpg", label: "Terrenos" },
  { src: "/fotos/interiores.jpg", label: "Interiores" },
  { src: "/fotos/fraccionamientos.jpg", label: "Fraccionamientos" },
  { src: "/fotos/haciendas.jpg", label: "Haciendas" },
];

/** Cinta de fotos en movimiento continuo con CSS (la lista va dos veces para no tener corte) */
export default function ImageMarquee() {
  const vuelta = [...slides, ...slides];
  return (
    <div className={styles.wrap} data-animar>
      <div className={styles.container}>
        {vuelta.map((s, i) => (
          <div className={styles.slide} key={i} aria-hidden={i >= slides.length}>
            <Image src={s.src} alt={i >= slides.length ? "" : s.label} fill sizes="(max-width: 700px) 260px, 420px" quality={50} className={styles.img} />
            <span className={styles.tag}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
