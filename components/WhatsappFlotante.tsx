"use client";

import { usePathname } from "next/navigation";
import styles from "./WhatsappFlotante.module.css";

/**
 * SIN MONTAR: desde que existe components/Chatbot.tsx, WhatsApp es una opción dentro del
 * asistente y solo hay un botón flotante. Se conserva por si se quiere volver al botón simple.
 *
 * Botón flotante de WhatsApp en celular. No aparece en contacto (ya es la página de contacto),
 * en la ficha de propiedad (tiene su propia barra con el precio) ni en el Studio.
 */
export default function WhatsappFlotante() {
  const pathname = usePathname();
  if (pathname.startsWith("/contacto") || pathname.startsWith("/studio") || /^\/propiedades\/[^/]+/.test(pathname)) {
    return null;
  }
  return (
    <a
      className={styles.flotante}
      href={`https://wa.me/524520000000?text=${encodeURIComponent("Hola, quiero asesoría inmobiliaria.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.2 21.8l4.9-1.3A9.8 9.8 0 1 0 12 2.2Zm0 17.9a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.1 8.1 0 1 1 12 20.1Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z" />
      </svg>
    </a>
  );
}
