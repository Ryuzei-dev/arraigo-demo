// Pasa a Sanity los datos que antes vivían en lib/extras.ts (asesor, estado, precio anterior, tour).
// Uso:  node scripts/migrar-extras.mjs            -> solo muestra qué escribiría
//       node scripts/migrar-extras.mjs --aplicar  -> escribe (requiere SANITY_WRITE_TOKEN en .env.local)
// Usa setIfMissing: si un campo ya tiene valor en Sanity, no se toca.
import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

for (const linea of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = linea.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const TOUR_DEMO = "https://kuula.co/share/collection/7fzdM?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1";
const datos = {
  "casa-residencial-las-lomas": { asesor: "laura-mendez", estado: "nueva", tourUrl: TOUR_DEMO },
  "departamento-centro-historico": { asesor: "sofia-cardenas", estado: "rebajada", precioAnterior: 20000 },
  "terreno-comercial-zona-industrial": { asesor: "andres-villalobos" },
  "local-comercial-plaza-morelos": { asesor: "andres-villalobos", estado: "apartada" },
  "oficinas-corporativo-la-huerta": { asesor: "sofia-cardenas" },
  "bodega-industrial-libramiento": { asesor: "andres-villalobos", estado: "rebajada", precioAnterior: 8400000 },
};

const aplicar = process.argv.includes("--aplicar");
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: aplicar ? process.env.SANITY_WRITE_TOKEN : undefined,
});
if (aplicar && !process.env.SANITY_WRITE_TOKEN) {
  console.error("Falta SANITY_WRITE_TOKEN en .env.local");
  process.exit(1);
}

const docs = await client.fetch(`*[_type == "propiedad"]{ _id, "slug": slug.current, asesor, estado, precioAnterior, tourUrl }`);
// Si hay un borrador abierto en el Studio, también se completa para que no oculte el cambio
const borradores = new Set(await client.fetch(`*[_id in path("drafts.**")]._id`));
const tx = client.transaction();
let cambios = 0;
for (const d of docs) {
  const nuevos = datos[d.slug];
  if (!nuevos) continue;
  const faltan = Object.fromEntries(Object.entries(nuevos).filter(([k]) => d[k] == null));
  if (!Object.keys(faltan).length) continue;
  console.log(`${d.slug} (${d._id})`, faltan);
  tx.patch(d._id, (p) => p.setIfMissing(faltan));
  if (borradores.has(`drafts.${d._id}`)) tx.patch(`drafts.${d._id}`, (p) => p.setIfMissing(faltan));
  cambios++;
}
if (!cambios) console.log("Nada que migrar: todo ya está en Sanity.");
else if (!aplicar) console.log(`
${cambios} propiedades por actualizar. Nada se escribió. Para aplicar: node scripts/migrar-extras.mjs --aplicar`);
else {
  await tx.commit();
  console.log(`Listo: ${cambios} propiedades actualizadas.`);
}
