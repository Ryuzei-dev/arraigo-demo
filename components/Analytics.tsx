"use client";

import Script from "next/script";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Google Analytics 4 (solo si NEXT_PUBLIC_GA_ID existe) y medición automática de clics
 * en WhatsApp, teléfono y correo en todo el sitio.
 */
export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    const alClic = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const pagina = window.location.pathname;
      if (href.startsWith("https://wa.me/")) track("click_whatsapp", { pagina });
      else if (href.startsWith("tel:")) track("click_telefono", { pagina });
      else if (href.startsWith("mailto:")) track("click_correo", { pagina });
    };
    document.addEventListener("click", alClic);
    return () => document.removeEventListener("click", alClic);
  }, []);

  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
