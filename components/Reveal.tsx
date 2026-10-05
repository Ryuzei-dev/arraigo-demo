import type { CSSProperties, ReactNode } from "react";

/**
 * Aparición al entrar en pantalla, sin librerías: el CSS global oculta [data-reveal] solo cuando
 * hay JavaScript (clase "js" en <html>) y RevealObserver le agrega "visible" al entrar.
 * Sin JS o con "reducir movimiento", el bloque se ve desde el inicio.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 30,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      data-reveal
      suppressHydrationWarning
      style={{ "--reveal-delay": `${delay}ms`, "--reveal-y": `${y}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}
