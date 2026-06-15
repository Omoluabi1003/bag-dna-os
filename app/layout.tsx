import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BAG-DNA OS | Aviation Baggage Intelligence",
  description:
    "Digital baggage identity, chain-of-custody, geospatial operations and AI risk intelligence for modern aviation.",
  applicationName: "BAG-DNA OS",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#071522",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
