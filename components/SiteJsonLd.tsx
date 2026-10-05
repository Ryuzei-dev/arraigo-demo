const base = "https://arraigo-demo.vercel.app";

/**
 * Datos estructurados globales (se inyectan en todas las páginas).
 * RealEstateAgent = negocio local inmobiliario → SEO local (NAP, horarios, zona).
 * WebSite = identidad del sitio para Google.
 */
export default function SiteJsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "@id": `${base}/#organization`,
      name: "Arraigo",
      alternateName: "Arraigo Asesoría & Venta",
      description:
        "Asesoría profesional en compra, venta y renta de inmuebles en Uruapan, Michoacán.",
      url: base,
      logo: `${base}/icon.svg`,
      image: `${base}/opengraph-image`,
      telephone: "+52-452-000-0000",
      email: "contacto@arraigo.example",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Uruapan",
        addressRegion: "Michoacán",
        addressCountry: "MX",
      },
      areaServed: {
        "@type": "City",
        name: "Uruapan",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "19:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "10:00",
          closes: "14:00",
        },
      ],
      sameAs: [] as string[],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${base}/#website`,
      url: base,
      name: "Arraigo",
      inLanguage: "es-MX",
      publisher: { "@id": `${base}/#organization` },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
