import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { ETIQUETA } from "@/lib/queries";

/**
 * Webhook de Sanity: al publicar, editar o borrar una propiedad, renueva las páginas que la usan.
 * Se configura en sanity.io/manage > API > Webhooks con el mismo secreto que SANITY_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  const secreto = process.env.SANITY_REVALIDATE_SECRET;
  if (!secreto) return NextResponse.json({ ok: false, error: "Falta SANITY_REVALIDATE_SECRET" }, { status: 500 });
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secreto, true);
    if (!isValidSignature) return NextResponse.json({ ok: false, error: "Firma inválida" }, { status: 401 });
    if (body?._type !== "propiedad") return NextResponse.json({ ok: true, ignorado: body?._type ?? null });
    revalidateTag(ETIQUETA, { expire: 0 });
    return NextResponse.json({ ok: true, renovado: ETIQUETA });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 400 });
  }
}
