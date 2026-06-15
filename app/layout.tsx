import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "BAG-DNA OS™",
  description:
    "Digital Baggage Identity and Chain-of-Custody Intelligence Platform",
  applicationName: "BAG-DNA OS",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    siteName: "BAG-DNA OS™",
    title: "BAG-DNA OS™",
    description: "The Digital Identity Layer for Every Checked Bag.",
    images: [
      {
        url: "/bag-dna-logo.png",
        width: 1024,
        height: 1024,
        alt: "BAG-DNA OS logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BAG-DNA OS™",
    description: "The Digital Identity Layer for Every Checked Bag.",
    images: ["/bag-dna-logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0C1A2A",
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
