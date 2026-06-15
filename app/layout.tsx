import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://bag-dna-os.vercel.app");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BAG-DNA OS™ | Aviation Baggage Intelligence",
    template: "%s | BAG-DNA OS™",
  },
  description:
    "Digital Baggage Identity and Chain-of-Custody Intelligence Platform",
  applicationName: "BAG-DNA OS",
  alternates: { canonical: "/" },
  keywords: ["aviation baggage intelligence", "digital baggage identity", "Nigeria aviation", "airport GIS", "chain of custody"],
  manifest: `${basePath}/manifest.webmanifest`,
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico` },
      { url: `${basePath}/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
      { url: `${basePath}/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: `${basePath}/apple-touch-icon.png`,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "BAG-DNA OS™",
    title: "BAG-DNA OS™",
    description: "The Digital Identity Layer for Every Checked Bag.",
    images: [
      {
        url: `${basePath}/bag-dna-logo.png`,
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
    images: [`${basePath}/bag-dna-logo.png`],
  },
  robots: { index: true, follow: true },
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
