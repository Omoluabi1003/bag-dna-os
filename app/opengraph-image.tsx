import { ImageResponse } from "next/og";

export const alt =
  "BAG-DNA OS — The digital identity layer for every checked bag";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          backgroundColor: "#071522",
          backgroundImage:
            "radial-gradient(circle at 76% 28%, rgba(110,216,224,.18), transparent 28%), radial-gradient(circle at 12% 88%, rgba(215,169,59,.14), transparent 34%)",
          color: "#f8fafc",
          display: "flex",
          fontFamily: "Arial, Helvetica, sans-serif",
          height: "100%",
          overflow: "hidden",
          padding: "68px 76px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgba(110,216,224,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(110,216,224,.055) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
            display: "flex",
            inset: 0,
            maskImage:
              "linear-gradient(90deg, transparent 18%, black 68%, transparent)",
            position: "absolute",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            position: "relative",
            width: "100%",
          }}
        >
          <div style={{ alignItems: "center", display: "flex" }}>
            <div
              style={{
                alignItems: "center",
                background:
                  "linear-gradient(145deg, rgba(255,255,255,.12), rgba(255,255,255,.035))",
                border: "1px solid rgba(255,255,255,.18)",
                borderRadius: 20,
                display: "flex",
                height: 76,
                justifyContent: "center",
                marginRight: 22,
                width: 76,
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  border: "3px solid #6ed8e0",
                  borderRadius: 12,
                  display: "flex",
                  height: 43,
                  justifyContent: "center",
                  transform: "rotate(45deg)",
                  width: 43,
                }}
              >
                <div
                  style={{
                    background: "#d7a93b",
                    borderRadius: 99,
                    display: "flex",
                    height: 12,
                    width: 12,
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: 2,
                }}
              >
                BAG-DNA OS
              </div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 4,
                  marginTop: 8,
                }}
              >
                AVIATION IDENTITY INFRASTRUCTURE
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", width: 880 }}>
            <div
              style={{
                color: "#6ed8e0",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 3,
                marginBottom: 20,
              }}
            >
              ISSUE · VERIFY · TRACK · PROTECT
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 62,
                fontWeight: 700,
                letterSpacing: -3,
                lineHeight: 1.04,
              }}
            >
              <div style={{ display: "flex" }}>The digital identity layer</div>
              <div style={{ display: "flex" }}>for every checked bag.</div>
            </div>
          </div>

          <div
            style={{
              alignItems: "center",
              borderTop: "1px solid rgba(255,255,255,.12)",
              color: "#a9b7c6",
              display: "flex",
              fontSize: 17,
              justifyContent: "space-between",
              paddingTop: 22,
            }}
          >
            <div style={{ display: "flex" }}>
              Chain-of-custody intelligence for modern aviation
            </div>
            <div
              style={{
                color: "#d7a93b",
                display: "flex",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              bagdnaos.com
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
