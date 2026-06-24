import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Titan's Gym";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(220,38,38,0.35), rgba(10,10,10,0) 55%)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            border: "2px solid rgba(220,38,38,0.5)",
            borderRadius: 999,
            padding: "10px 28px",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: "#dc2626",
              display: "flex",
            }}
          />
          <span style={{ color: "#dc2626", fontSize: 28, fontWeight: 700, letterSpacing: 4 }}>
            LA LIBERTAD · SANTA ELENA
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 144,
            fontWeight: 900,
            color: "#f8fafc",
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          TITAN&apos;S&nbsp;<span style={{ color: "#dc2626", display: "flex" }}>GYM</span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 34,
            color: "#a1a1aa",
            fontWeight: 500,
          }}
        >
          Entrena con constancia. Vive como un titán.
        </div>
      </div>
    ),
    { ...size }
  );
}
