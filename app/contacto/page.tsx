import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import styles from "./contacto.module.css";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos para comprar, vender o rentar tu propiedad en Uruapan, Michoacán. Teléfono (452) 000 0000 y WhatsApp.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className="wrap">
          <h1 className={`display-xl ${styles.title}`}>
            Hablemos de tu<br />
            <span className="italic-gold">patrimonio</span>.
          </h1>
          <p className={styles.sub}>
            Cuéntanos qué buscas y un asesor te contactará. Sin compromiso, con
            respuestas honestas.
          </p>
        </div>
      </section>

      <section className={`section ${styles.body}`} style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className={styles.layout}>
            <div className={styles.info}>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>Teléfono</span>
                <a href="tel:+524520000000" className={styles.infoValue}>
                  (452) 000 0000
                </a>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>WhatsApp</span>
                <a
                  href="https://wa.me/524520000000"
                  className={styles.infoValue}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Escríbenos directo
                </a>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>Correo</span>
                <a
                  href="mailto:contacto@arraigo.example"
                  className={styles.infoValue}
                >
                  contacto@arraigo.example
                </a>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>Ubicación</span>
                <span className={styles.infoValue}>Uruapan, Michoacán, México</span>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>Horario</span>
                <span className={styles.infoValue}>
                  Lunes a viernes, 9:00 a 19:00
                  <br />
                  Sábado, 10:00 a 14:00
                </span>
              </div>
            </div>

            <div className={styles.formCol}>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
