import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return {
    name: "BAG-DNA OS",
    short_name: "BAG-DNA",
    description: "Digital baggage identity and aviation chain-of-custody intelligence.",
    start_url: `${basePath}/`,
    display: "standalone",
    background_color: "#071522",
    theme_color: "#0C1A2A",
    icons: [
      { src: `${basePath}/android-chrome-192x192.png`, sizes: "192x192", type: "image/png" },
      { src: `${basePath}/android-chrome-512x512.png`, sizes: "512x512", type: "image/png" },
    ],
  };
}
