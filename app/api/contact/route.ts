import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface Lead {
  nombre: string;
  telefono: string;
  correo?: string;
  operacion?: string;
  tipo?: string;
  mensaje?: string;
  propiedad?: string;
}

function esc(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function enviarCorreo(lead: Lead) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL || "Arraigo <onboarding@resend.dev>";
  if (!key || !to) return { sent: false, reason: "no-config" };

  const html = `
    <h2>Nuevo contacto · Arraigo</h2>
    <p><b>Nombre:</b> ${esc(lead.nombre)}</p>
    <p><b>Teléfono:</b> ${esc(lead.telefono)}</p>
    ${lead.correo ? `<p><b>Correo:</b> ${esc(lead.correo)}</p>` : ""}
    ${lead.operacion ? `<p><b>Quiere:</b> ${esc(lead.operacion)}</p>` : ""}
    ${lead.tipo ? `<p><b>Tipo de inmueble:</b> ${esc(lead.tipo)}</p>` : ""}
    ${lead.propiedad ? `<p><b>Propiedad de interés:</b> ${esc(lead.propiedad)}</p>` : ""}
    ${lead.mensaje ? `<p><b>Mensaje:</b><br>${esc(lead.mensaje)}</p>` : ""}
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Nuevo lead: ${lead.nombre} (${lead.operacion || "contacto"})`,
      html,
    }),
  });
  return { sent: res.ok, reason: res.ok ? "ok" : `resend-${res.status}` };
}

async function crearContactoHubspot(lead: Lead) {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return { created: false, reason: "no-config" };

  const [firstname, ...rest] = lead.nombre.trim().split(" ");
  const properties: Record<string, string> = {
    firstname,
    lastname: rest.join(" "),
    phone: lead.telefono,
    lifecyclestage: "lead",
  };
  if (lead.correo) properties.email = lead.correo;
  const notas = [
    lead.operacion && `Operación: ${lead.operacion}`,
    lead.tipo && `Tipo: ${lead.tipo}`,
    lead.propiedad && `Propiedad: ${lead.propiedad}`,
    lead.mensaje && `Mensaje: ${lead.mensaje}`,
  ]
    .filter(Boolean)
    .join(" · ");
  if (notas) properties.message = notas;

  const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ properties }),
  });
  // 409 = contacto ya existe: lo tratamos como éxito para no romper el flujo.
  const ok = res.ok || res.status === 409;
  return { created: ok, reason: ok ? "ok" : `hubspot-${res.status}` };
}

export async function POST(request: Request) {
  let body: Lead;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  if (!body.nombre?.trim() || !body.telefono?.trim()) {
    return NextResponse.json(
      { ok: false, error: "Nombre y teléfono son obligatorios" },
      { status: 422 }
    );
  }

  const configurado =
    !!process.env.RESEND_API_KEY || !!process.env.HUBSPOT_ACCESS_TOKEN;

  try {
    const [correo, hubspot] = await Promise.all([
      enviarCorreo(body).catch((e) => ({ sent: false, reason: String(e) })),
      crearContactoHubspot(body).catch((e) => ({ created: false, reason: String(e) })),
    ]);

    if (!configurado) {
      // Modo demo: sin llaves configuradas. Registramos el lead en el log del servidor.
      console.log("[lead demo]", JSON.stringify(body));
    }

    return NextResponse.json({
      ok: true,
      demo: !configurado,
      correo,
      hubspot,
    });
  } catch (e) {
    console.error("[contact] error", e);
    return NextResponse.json(
      { ok: false, error: "No se pudo procesar la solicitud" },
      { status: 500 }
    );
  }
}
