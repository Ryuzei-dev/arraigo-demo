import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: `https://arraigo-demo.vercel.app${it.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className={styles.crumbs} aria-label="Migas de pan">
        {items.map((it, i) => (
          <span key={i} className={styles.item}>
            {it.href ? (
              <Link href={it.href} className={styles.link}>
                {it.label}
              </Link>
            ) : (
              <span className={styles.current} aria-current="page">
                {it.label}
              </span>
            )}
            {i < items.length - 1 && (
              <span className={styles.sep} aria-hidden="true">
                /
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
