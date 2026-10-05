import { defineType, defineField } from "sanity";

/**
 * Schema "propiedad" para el CMS de Arraigo.
 * Mapea 1:1 con el tipo Propiedad que hoy usa el sitio (lib/properties.ts).
 * Aún no está conectado: se activa cuando definamos el Project ID de Sanity.
 */
export const propiedad = defineType({
  name: "propiedad",
  title: "Propiedad",
  type: "document",
  groups: [
    { name: "principal", title: "Principal", default: true },
    { name: "detalles", title: "Detalles" },
    { name: "media", title: "Fotos y ubicación" },
  ],
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      group: "principal",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "principal",
      options: { source: "titulo", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "categoria",
      title: "Categoría",
      type: "string",
      group: "principal",
      options: {
        list: ["Casa", "Departamento", "Terreno", "Local", "Oficina", "Bodega"],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "operacion",
      title: "Operación",
      type: "string",
      group: "principal",
      options: {
        list: [
          { title: "Venta", value: "venta" },
          { title: "Renta", value: "renta" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "precio",
      title: "Precio",
      type: "number",
      group: "principal",
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "moneda",
      title: "Moneda",
      type: "string",
      group: "principal",
      initialValue: "MXN",
      options: {
        list: ["MXN", "USD"],
        layout: "radio",
      },
    }),
    defineField({
      name: "destacada",
      title: "Destacada (aparece en inicio)",
      type: "boolean",
      group: "principal",
      initialValue: false,
    }),

    // --- Detalles ---
    defineField({
      name: "resumen",
      title: "Resumen (para las tarjetas)",
      type: "text",
      rows: 2,
      group: "detalles",
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: "descripcion",
      title: "Descripción (párrafos)",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      group: "detalles",
    }),
    defineField({
      name: "recamaras",
      title: "Recámaras",
      type: "number",
      group: "detalles",
    }),
    defineField({
      name: "banos",
      title: "Baños",
      type: "number",
      group: "detalles",
    }),
    defineField({
      name: "estacionamientos",
      title: "Estacionamientos",
      type: "number",
      group: "detalles",
    }),
    defineField({
      name: "m2Construccion",
      title: "m² de construcción",
      type: "number",
      group: "detalles",
    }),
    defineField({
      name: "m2Terreno",
      title: "m² de terreno",
      type: "number",
      group: "detalles",
    }),
    defineField({
      name: "amenidades",
      title: "Amenidades",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "detalles",
    }),

    // --- Media y ubicación ---
    defineField({
      name: "imagenes",
      title: "Fotos",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      group: "media",
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "colonia",
      title: "Colonia / zona",
      type: "string",
      group: "media",
    }),
    defineField({
      name: "ubicacion",
      title: "Ciudad / Estado",
      type: "string",
      group: "media",
      initialValue: "Uruapan, Michoacán",
    }),
    defineField({
      name: "geo",
      title: "Ubicación en el mapa",
      description: "Arrastra el pin al punto exacto del inmueble.",
      type: "geopoint",
      group: "media",
    }),
    // Campos opcionales: si se dejan vacíos, el sitio usa lib/extras.ts
    defineField({
      name: "asesor",
      title: "Asesor asignado",
      type: "string",
      group: "principal",
      options: {
        list: [
          { title: "Laura Méndez", value: "laura-mendez" },
          { title: "Andrés Villalobos", value: "andres-villalobos" },
          { title: "Sofía Cárdenas", value: "sofia-cardenas" },
        ],
      },
    }),
    defineField({
      name: "estado",
      title: "Estado (etiqueta en la tarjeta)",
      type: "string",
      group: "principal",
      options: {
        list: [
          { title: "Nueva", value: "nueva" },
          { title: "Precio rebajado", value: "rebajada" },
          { title: "Apartada", value: "apartada" },
          { title: "Vendida", value: "vendida" },
          { title: "Rentada", value: "rentada" },
        ],
      },
    }),
    defineField({
      name: "precioAnterior",
      title: "Precio anterior (si se rebajó)",
      type: "number",
      group: "principal",
    }),
    defineField({
      name: "tourUrl",
      title: "Tour 360 o video (URL para insertar)",
      type: "url",
      group: "media",
    }),
  ],
  preview: {
    select: {
      title: "titulo",
      subtitle: "colonia",
      media: "imagenes.0",
      operacion: "operacion",
    },
    prepare({ title, subtitle, media, operacion }) {
      return {
        title,
        subtitle: `${operacion === "renta" ? "Renta" : "Venta"} · ${subtitle ?? ""}`,
        media,
      };
    },
  },
});
