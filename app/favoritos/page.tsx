import type { Metadata } from "next";
import { getPropiedades } from "@/lib/queries";
import ListaFavoritos from "./ListaFavoritos";
import styles from "./favoritos.module.css";

export const metadata: Metadata = {
  title: "Tus favoritos",
  description: "Las propiedades que guardaste en este navegador para revisarlas después.",
  alternates: { canonical: "/favoritos" },
  robots: { index: false, follow: true },
};

export default async function FavoritosPage() {
  const todas = await getPropiedades();

  return (
    <>
      <section className={styles.head}>
        <div className="wrap">
          <h1 className={`display-l ${styles.title}`}>
            Tus <span className="italic-gold">favoritos</span>.
          </h1>
          <p className={styles.sub}>
            Guardamos tu lista en este navegador, sin cuenta ni registro.
          </p>
        </div>
      </section>
      <section className={`section ${styles.cuerpo}`}>
        <div className="wrap">
          <ListaFavoritos propiedades={todas} />
        </div>
      </section>
    </>
  );
}
