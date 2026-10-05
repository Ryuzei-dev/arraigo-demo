"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Chatbot = dynamic(() => import("./Chatbot"), { ssr: false });

/** Carga el asistente cuando el navegador ya terminó lo importante (no compite con la portada) */
export default function ChatbotDiferido() {
  const [listo, setListo] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) {
      w.requestIdleCallback(() => setListo(true), { timeout: 3000 });
    } else {
      const t = setTimeout(() => setListo(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);
  return listo ? <Chatbot /> : null;
}
