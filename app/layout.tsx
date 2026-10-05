import type { Metadata, Viewport } from "next";
import { Fraunces, Newsreader, Space_Grotesk } from "next/font/google";
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

// Titulares. La cursiva va en una instancia aparte sin precarga: solo aparece en una palabra
// del hero y en números de sección, y así no compite con el CSS al cargar.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  style: ["normal"],
  variable: "--font-fraunces",
  display: "swap",
});
const frauncesItalic = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  style: ["italic"],
  variable: "--font-fraunces-italic",
  display: "swap",
  preload: false,
});

// Datos: etiquetas, precios, specs y botones (según el documento de marca)
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-grotesk",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal"],
  variable: "--font-newsreader",
  display: "swap",
});
const newsreaderItalic = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["italic"],
  variable: "--font-newsreader-italic",
  display: "swap",
  preload: false,
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
  themeColor: "#14110f",
  colorScheme: "dark",
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
    <html lang="es" className={`${fraunces.variable} ${frauncesItalic.variable} ${newsreader.variable} ${newsreaderItalic.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        {/* Marca que hay JavaScript antes de pintar: así las apariciones no parpadean */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
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
