"use client";

import { useEffect } from "react";
import { registrarVisto } from "@/lib/guardados";

/** Anota la propiedad en "vistos recientemente" al abrir la ficha */
export default function RegistrarVisto({ slug }: { slug: string }) {
  useEffect(() => {
    registrarVisto(slug);
  }, [slug]);
  return null;
}
