import type { MetadataRoute } from "next";
import { getColonias, getPropiedades } from "@/lib/queries";
import { asesores } from "@/lib/asesores";
import { guias } from "@/lib/guias";
import { servicios } from "@/lib/servicios";

const base = "https://arraigo-demo.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const estaticas: MetadataRoute.Sitemap = ([
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/propiedades`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/servicios`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/nosotros`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contacto`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/vender`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/asesores`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/colonias`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/guias`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/preguntas`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/aviso-de-privacidad`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terminos`, changeFrequency: "yearly", priority: 0.2 },
  ] as const).map((r) => ({ ...r, lastModified: now }));

  const serviciosUrls: MetadataRoute.Sitemap = servicios.map((s) => ({
    url: `${base}/servicios/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const propiedades = await getPropiedades();
  const propiedadesUrls: MetadataRoute.Sitemap = propiedades.map((p) => ({
    url: `${base}/propiedades/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const asesoresUrls: MetadataRoute.Sitemap = asesores.map((a) => ({
    url: `${base}/asesores/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const guiasUrls: MetadataRoute.Sitemap = guias.map((g) => ({
    url: `${base}/guias/${g.slug}`,
    lastModified: new Date(g.revisada),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const coloniasUrls: MetadataRoute.Sitemap = (await getColonias()).map((c) => ({
    url: `${base}/colonias/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...estaticas,
    ...serviciosUrls,
    ...propiedadesUrls,
    ...coloniasUrls,
    ...asesoresUrls,
    ...guiasUrls,
  ];
}
