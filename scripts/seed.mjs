/**
 * Sube las 6 propiedades demo a Sanity (documentos + imágenes).
 * Uso:  node --env-file=.env.local scripts/seed.mjs
 * Requiere SANITY_WRITE_TOKEN (rol Editor) en .env.local.
 */
import { createClient } from "@sanity/client";

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error(
    "\n✗ Falta SANITY_WRITE_TOKEN en .env.local.\n" +
      "  Crea un token (rol Editor) en el dashboard de Sanity → API → Tokens,\n" +
      "  agrégalo como  SANITY_WRITE_TOKEN=sk...  y vuelve a ejecutar.\n"
  );
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "dowvic4b",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
});

const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

const propiedades = [
  {
    slug: "casa-residencial-las-lomas",
    titulo: "Casa Residencial Las Lomas",
    categoria: "Casa",
    operacion: "venta",
    precio: 5850000,
    moneda: "MXN",
    ubicacion: "Uruapan, Michoacán",
    colonia: "Fracc. Las Lomas",
    lat: 19.429,
    lng: -102.041,
    recamaras: 3,
    banos: 3,
    estacionamientos: 2,
    m2Construccion: 280,
    m2Terreno: 360,
    destacada: true,
    resumen:
      "Residencia de autor en el exclusivo fraccionamiento Las Lomas, con jardín, alberca y acabados de primera.",
    descripcion: [
      "Una casa pensada para vivir con amplitud y luz. Los espacios sociales se abren al jardín y la alberca a través de grandes ventanales que difuminan el interior y el exterior.",
      "Tres recámaras con vestidor, la principal con baño completo y balcón privado. Cocina integral equipada, sala de TV y estudio independiente ideal para trabajar desde casa.",
    ],
    amenidades: [
      "Alberca climatizada",
      "Jardín maduro",
      "Cocina integral",
      "Vestidores",
      "Seguridad 24/7",
      "Cisterna",
    ],
    imagenes: [
      u("photo-1600596542815-ffad4c1539a9"),
      u("photo-1600585154340-be6161a56a0c"),
      u("photo-1600607687939-ce8a6c25118c"),
      u("photo-1600566753086-00f18fb6b3ea"),
    ],
  },
  {
    slug: "departamento-centro-historico",
    titulo: "Departamento Centro Histórico",
    categoria: "Departamento",
    operacion: "renta",
    precio: 18500,
    moneda: "MXN",
    ubicacion: "Uruapan, Michoacán",
    colonia: "Centro Histórico",
    lat: 19.4116,
    lng: -102.0526,
    recamaras: 2,
    banos: 2,
    estacionamientos: 1,
    m2Construccion: 95,
    destacada: true,
    resumen:
      "Departamento amueblado en el corazón del centro histórico. Ideal para inversión o para vivir a un paso de todo.",
    descripcion: [
      "Vivir en el centro sin renunciar al confort. Este departamento amueblado combina la calidez de un edificio con historia y una remodelación contemporánea.",
      "Espacios abiertos, doble altura en la estancia y una terraza con vista a los tejados del centro. Entregado listo para habitar.",
    ],
    amenidades: [
      "Amueblado",
      "Terraza",
      "Doble altura",
      "Elevador",
      "Internet incluido",
    ],
    imagenes: [
      u("photo-1502672260266-1c1ef2d93688"),
      u("photo-1493809842364-78817add7ffb"),
      u("photo-1522708323590-d24dbb6b0267"),
      u("photo-1560448204-e02f11c3d0e2"),
    ],
  },
  {
    slug: "terreno-comercial-zona-industrial",
    titulo: "Terreno Comercial Zona Industrial",
    categoria: "Terreno",
    operacion: "venta",
    precio: 3200000,
    moneda: "MXN",
    ubicacion: "Uruapan, Michoacán",
    colonia: "Zona Industrial",
    lat: 19.445,
    lng: -102.03,
    m2Terreno: 1200,
    destacada: true,
    resumen:
      "Terreno ideal para desarrollo comercial o industrial. Excelente ubicación con acceso a carretera principal y servicios.",
    descripcion: [
      "Una oportunidad de inversión con frente amplio sobre vía principal y todos los servicios a pie de terreno.",
      "Uso de suelo mixto que admite desarrollo comercial, industrial ligero o naves. Plano y listo para construir.",
    ],
    amenidades: [
      "Frente a carretera",
      "Todos los servicios",
      "Uso de suelo mixto",
      "Terreno plano",
    ],
    imagenes: [
      u("photo-1500382017468-9049fed747ef"),
      u("photo-1416879595882-3373a0480b5b"),
      u("photo-1592982537447-7440770cbfc9"),
    ],
  },
  {
    slug: "local-comercial-plaza-morelos",
    titulo: "Local Comercial Plaza Morelos",
    categoria: "Local",
    operacion: "renta",
    precio: 32000,
    moneda: "MXN",
    ubicacion: "Uruapan, Michoacán",
    colonia: "Av. Morelos",
    lat: 19.418,
    lng: -102.055,
    m2Construccion: 140,
    banos: 1,
    resumen:
      "Local a pie de avenida con gran afluencia peatonal. Perfecto para retail, gastronomía o servicios.",
    descripcion: [
      "Ubicación inmejorable sobre una de las avenidas de mayor tránsito de la ciudad. Fachada amplia y escaparate a la calle.",
      "Espacio diáfano listo para adaptar a tu concepto, con instalación eléctrica reforzada y baño.",
    ],
    amenidades: [
      "Alta afluencia",
      "Escaparate",
      "Espacio diáfano",
      "Instalación reforzada",
    ],
    imagenes: [
      u("photo-1441986300917-64674bd600d8"),
      u("photo-1604709177225-055f99402ea3"),
      u("photo-1567521464027-f127ff144326"),
    ],
  },
  {
    slug: "oficinas-corporativo-la-huerta",
    titulo: "Oficinas Corporativo La Huerta",
    categoria: "Oficina",
    operacion: "renta",
    precio: 45000,
    moneda: "MXN",
    ubicacion: "Uruapan, Michoacán",
    colonia: "La Huerta",
    lat: 19.43,
    lng: -102.06,
    m2Construccion: 210,
    banos: 2,
    estacionamientos: 4,
    resumen:
      "Oficinas premium en corporativo, con recepción, salas de junta y estacionamiento asignado.",
    descripcion: [
      "Un espacio de trabajo a la altura de tu empresa. Piso completo con privados, área abierta y dos salas de juntas.",
      "Edificio con recepción, control de acceso y estacionamiento asignado para colaboradores y visitas.",
    ],
    amenidades: [
      "Salas de junta",
      "Recepción",
      "Control de acceso",
      "Estacionamiento",
      "Fibra óptica",
    ],
    imagenes: [
      u("photo-1497366754035-f200968a6e72"),
      u("photo-1524758631624-e2822e304c36"),
      u("photo-1497366811353-6870744d04b2"),
    ],
  },
  {
    slug: "bodega-industrial-libramiento",
    titulo: "Bodega Industrial Libramiento",
    categoria: "Bodega",
    operacion: "venta",
    precio: 7900000,
    moneda: "MXN",
    ubicacion: "Uruapan, Michoacán",
    colonia: "Libramiento Oriente",
    lat: 19.45,
    lng: -102.02,
    m2Construccion: 850,
    m2Terreno: 1400,
    resumen:
      "Bodega con altura libre, oficinas y andén de carga. Logística óptima sobre el libramiento.",
    descripcion: [
      "Nave industrial con estructura metálica, gran altura libre y piso reforzado para maquinaria pesada.",
      "Incluye módulo de oficinas, andén de carga y amplio patio de maniobras con acceso para tráileres.",
    ],
    amenidades: [
      "Andén de carga",
      "Altura libre 8m",
      "Patio de maniobras",
      "Oficinas",
      "Piso reforzado",
    ],
    imagenes: [
      u("photo-1553413077-190dd305871c"),
      u("photo-1586528116311-ad8dd3c8310d"),
      u("photo-1581091226825-a6a2a5aee158"),
    ],
  },
];

let seed = 1000;
const key = () => `k${(seed++).toString(36)}`;

async function subirImagenes(urls, slug) {
  const refs = [];
  for (let i = 0; i < urls.length; i++) {
    const res = await fetch(urls[i]);
    if (!res.ok) throw new Error(`imagen ${urls[i]} → HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const asset = await client.assets.upload("image", buf, {
      filename: `${slug}-${i + 1}.jpg`,
    });
    refs.push(asset._id);
    process.stdout.write("  ·");
  }
  return refs;
}

async function main() {
  console.log(
    `\nSubiendo ${propiedades.length} propiedades a ${client.config().projectId}/${client.config().dataset}…`
  );
  for (const p of propiedades) {
    console.log(`\n→ ${p.titulo}`);
    const refs = await subirImagenes(p.imagenes, p.slug);
    const doc = {
      _id: `propiedad-${p.slug}`,
      _type: "propiedad",
      titulo: p.titulo,
      slug: { _type: "slug", current: p.slug },
      categoria: p.categoria,
      operacion: p.operacion,
      precio: p.precio,
      moneda: p.moneda,
      destacada: !!p.destacada,
      resumen: p.resumen,
      descripcion: p.descripcion,
      amenidades: p.amenidades,
      recamaras: p.recamaras,
      banos: p.banos,
      estacionamientos: p.estacionamientos,
      m2Construccion: p.m2Construccion,
      m2Terreno: p.m2Terreno,
      colonia: p.colonia,
      ubicacion: p.ubicacion,
      geo: { _type: "geopoint", lat: p.lat, lng: p.lng },
      imagenes: refs.map((ref) => ({
        _type: "image",
        _key: key(),
        asset: { _type: "reference", _ref: ref },
      })),
    };
    for (const k of Object.keys(doc)) if (doc[k] === undefined) delete doc[k];
    await client.createOrReplace(doc);
    console.log(`  ✓ publicada (${refs.length} fotos)`);
  }
  console.log("\n✅ Listo. Recarga el sitio: ahora lee las propiedades reales del CMS.\n");
}

main().catch((e) => {
  console.error("\n✗ Error:", e.message);
  process.exit(1);
});
