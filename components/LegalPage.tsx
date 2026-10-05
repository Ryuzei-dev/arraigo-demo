import styles from "./LegalPage.module.css";

export interface LegalSection {
  h: string;
  p: string[];
}

export default function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <section className={styles.head}>
        <div className={styles.grid} />
        <div className="wrap">
          <h1 className={`display-l ${styles.title}`}>{title}</h1>
          <p className={styles.updated}>Última actualización: {updated}</p>
        </div>
      </section>

      <section className={`section ${styles.body}`} style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className={styles.doc}>
            <p className={styles.intro}>{intro}</p>
            {sections.map((s, i) => (
              <div key={i} className={styles.block}>
                <h2 className={styles.h}>
                  <span className={styles.n}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.h}
                </h2>
                {s.p.map((par, j) => (
                  <p key={j}>{par}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
