"use client";

import { useState } from "react";
import { faqs } from "@/lib/content";
import styles from "./Faq.module.css";

export default function Faq({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={`${styles.list} ${light ? styles.onLight : ""}`}>
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}>
            <button
              className={styles.q}
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span>{f.q}</span>
              <span className={styles.icon} aria-hidden="true">
                {isOpen ? "–" : "+"}
              </span>
            </button>
            {/* Altura animada con CSS (grid-template-rows); sin librería */}
            <div className={styles.answerWrap} aria-hidden={!isOpen}>
              <div className={styles.answerInner}>
                <p className={styles.answer}>{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
