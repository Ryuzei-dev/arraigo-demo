import styles from "./PropertyMap.module.css";

export default function PropertyMap({
  lat,
  lng,
  colonia,
  ubicacion,
  titulo,
}: {
  lat: number;
  lng: number;
  colonia: string;
  ubicacion: string;
  titulo: string;
}) {
  const q = `${lat},${lng}`;
  const embed = `https://www.google.com/maps?q=${q}&z=15&hl=es&output=embed`;
  const link = `https://www.google.com/maps/search/?api=1&query=${q}`;

  return (
    <div className={styles.wrap}>
      <div className={styles.frame}>
        <iframe
          src={embed}
          title={`Ubicación de ${titulo}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className={styles.bar}>
        <div className={styles.info}>
          <span className={styles.pin}>◈</span>
          <div>
            <strong>{colonia}</strong>
            <span>{ubicacion}</span>
          </div>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
        >
          Ver en Google Maps <span className="arrow">↗</span>
        </a>
      </div>
    </div>
  );
}
