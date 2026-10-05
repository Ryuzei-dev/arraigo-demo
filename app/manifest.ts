import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Arraigo · Asesoría y venta inmobiliaria",
    short_name: "Arraigo",
    description:
      "Asesoría profesional en compra, venta y renta de inmuebles en Uruapan, Michoacán.",
    start_url: "/",
    display: "standalone",
    background_color: "#14110f",
    theme_color: "#14110f",
    lang: "es-MX",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
