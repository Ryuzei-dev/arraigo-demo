import styles from "./HeroVideo.module.css";

export default function HeroVideo({ embedSrc }: { embedSrc: string }) {
  return (
    <div className={styles.bg}>
      <iframe
        className={styles.frame}
        src={embedSrc}
        title="Arraigo"
        loading="eager"
        referrerPolicy="origin"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      />
    </div>
  );
}
