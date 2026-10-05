"use client";

import Image from "next/image";
import Link from "next/link";
import { useLista } from "@/lib/guardados";
import styles from "./VistosRecientes.module.css";

export interface ItemVisto {
  slug: string;
  titulo: string;
  colonia: string;
  precio: string;
  imagen?: string;
}

/** Tira horizontal con hasta 6 propiedades vistas en este navegador. Se oculta si no hay. */
export default function VistosRecientes({
  items,
  excluir,
}: {
  items: ItemVisto[];
  /** Slug a omitir (por ejemplo, la ficha abierta) */
  excluir?: string;
}) {
  const vistos = useLista("vistos");
  const lista = vistos
    .filter((s) => s !== excluir)
    .map((s) => items.find((i) => i.slug === s))
    .filter((i): i is ItemVisto => Boolean(i))
    .slice(0, 6);

  if (!lista.length) return null;

  return (
    <section className={styles.vistos} aria-labelledby="vistos-titulo">
      <h2 id="vistos-titulo" className={styles.titulo}>
        Vistas recientemente
      </h2>
      <ul className={styles.tira}>
        {lista.map((p) => (
          <li key={p.slug} className={styles.item}>
            <Link href={`/propiedades/${p.slug}`} className={styles.tarjeta}>
              <span className={styles.foto}>
                {p.imagen && (
                  <Image src={p.imagen} alt="" fill sizes="220px" className={styles.img} />
                )}
              </span>
              <span className={styles.texto}>
                <strong>{p.titulo}</strong>
                <span>{p.colonia}</span>
                <em>{p.precio}</em>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
