import type { Metadata, Viewport } from "next";
import { Newsreader, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatbotDiferido from "@/components/ChatbotDiferido";
import CompareBar from "@/components/CompareBar";
import { getPropiedades } from "@/lib/queries";
import RevealObserver from "@/components/RevealObserver";
import Analytics from "@/components/Analytics";
import RouteProgress from "@/components/RouteProgress";
import SiteJsonLd from "@/components/SiteJsonLd";

// Titulares: Newsreader con eje óptico (fina en grande, firme en chico), con cursiva
const serif = Newsreader({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap",
});
// Texto, datos, botones y etiquetas: grotesca de alta legibilidad
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arraigo-demo.vercel.app"),
  // Google Search Console: el código de verificación va en NEXT_PUBLIC_GSC_VERIFICATION
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
  title: {
    default: "Arraigo · Asesoría y venta inmobiliaria en Uruapan",
    template: "%s · Arraigo",
  },
  description:
    "Compra, vende o renta en Uruapan, Michoacán, con asesoría inicial sin costo. Casas, departamentos, terrenos y locales; comisión solo al concretar.",
  keywords: [
    "inmobiliaria Uruapan",
    "bienes raíces Michoacán",
    "casas en venta Uruapan",
    "departamentos en renta",
    "terrenos",
    "Arraigo",
  ],
  authors: [{ name: "Arraigo" }],
  creator: "Arraigo",
  publisher: "Arraigo",
  category: "Real Estate",
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Arraigo",
    url: "/",
    title: "Arraigo · Raíces firmes para tu patrimonio",
    description:
      "Asesoría profesional en bienes raíces en Uruapan, Michoacán.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arraigo · Raíces firmes para tu patrimonio",
    description:
      "Asesoría profesional en bienes raíces en Uruapan, Michoacán.",
  },
  // Demo de portafolio: fuera de buscadores (al publicarse para un cliente, cambiar a index: true)
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#14110f" },
  ],
  colorScheme: "light dark",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // La barra del comparador vive en todo el sitio: se puede agregar desde la portada, el catálogo o la ficha
  const propiedades = await getPropiedades();
  const paraComparar = propiedades.map((p) => ({ slug: p.slug, titulo: p.titulo, imagen: p.imagenes[0] }));

  return (
    <html lang="es" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Marca que hay JavaScript antes de pintar: así las apariciones no parpadean */}
        {/* Tema: claro por defecto; el oscuro solo si la persona lo eligió. Antes de pintar, sin parpadeo */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');try{if(localStorage.getItem('tema')==='oscuro')document.documentElement.dataset.tema='oscuro'}catch(e){}",
          }}
        />
      </head>
      <body>
        <SiteJsonLd />
        <RouteProgress />
        <Header />
        <main>{children}</main>
        <Footer />
        <CompareBar items={paraComparar} />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.querySelectorAll('[data-reveal]').forEach(function(e){if(e.getBoundingClientRect().top<innerHeight)e.classList.add('visible')})",
          }}
        />
        {/* Asistente guiado; incluye WhatsApp como opción (sustituye al botón flotante) */}
        <ChatbotDiferido />
        <RevealObserver />
        <Analytics />
      </body>
    </html>
  );
}
