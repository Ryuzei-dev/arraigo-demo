import Link from "next/link";
import type { Metadata } from "next";
import HeroPagina from "@/components/HeroPagina";
import AsesorCard from "@/components/AsesorCard";
import Reveal from "@/components/Reveal";
import { asesores } from "@/lib/asesores";
import styles from "./asesores.module.css";

export const metadata: Metadata = {
  title: "Asesores",
  description:
    "Conoce a los asesores de Arraigo en Uruapan: casas y departamentos, terrenos y locales, rentas y administración. Escríbeles directo por WhatsApp.",
  alternates: { canonical: "/asesores" },
};

export default function AsesoresPage() {
  return (
    <>
      <HeroPagina
        migas={[{ label: "Inicio", href: "/" }, { label: "Asesores" }]}
        titulo={
          <>
            Un asesor que <span className="italic-gold">responde</span>.
          </>
        }
        entrada="Cada operación tiene un asesor asignado de principio a fin. Escríbele directo o pídenos que te pongamos en contacto con quien conoce tu zona."
      />

      <section className={`section ${styles.lista}`}>
        <div className="wrap">
          <div className={styles.rejilla}>
            {asesores.map((a, i) => (
              <Reveal key={a.slug} delay={i * 80}>
                <AsesorCard a={a} />
              </Reveal>
            ))}
          </div>
          <p className={styles.nota}>
            ¿No sabes con quién hablar?{" "}
            <Link href="/contacto">Cuéntanos qué necesitas</Link> y te asignamos al asesor indicado.
          </p>
        </div>
      </section>
    </>
  );
}
