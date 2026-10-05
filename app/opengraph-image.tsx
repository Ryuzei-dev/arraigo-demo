import { ImageResponse } from "next/og";

export const alt = "Arraigo · Asesoría y venta inmobiliaria en Uruapan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "radial-gradient(120% 90% at 80% -10%, #3a2b12 0%, #14110f 55%)",
          color: "#efe9df",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <div
            style={{
              width: 78,
              height: 78,
              border: "3px solid #c79a47",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#c79a47",
              fontSize: 46,
              fontWeight: 700,
            }}
          >
            M
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 34, fontWeight: 700 }}>Arraigo</span>
            <span style={{ fontSize: 20, color: "#8c8177", letterSpacing: 4 }}>
              ASESORÍA & VENTA
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              lineHeight: 1.08,
            }}
          >
            <span>Compra o renta tu próximo</span>
            <span style={{ color: "#c79a47", fontStyle: "italic" }}>
              espacio.
            </span>
          </div>
          <span style={{ fontSize: 30, color: "#a99f92", marginTop: 28 }}>
            Bienes raíces en Uruapan, Michoacán · Raíces firmes para tu patrimonio
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
