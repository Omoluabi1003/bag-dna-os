import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BAG-DNA OS | The Security & Intelligence Layer for Baggage",
  description:
    "CrowdStrike-grade baggage security, Palantir-grade intelligence, ArcGIS-grade operations and Stripe-like identity infrastructure for modern aviation.",
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
