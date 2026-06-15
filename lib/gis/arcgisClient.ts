export const arcgisConfig = {
  portalUrl: process.env.NEXT_PUBLIC_ARCGIS_PORTAL_URL ?? "",
  apiKey: process.env.NEXT_PUBLIC_ARCGIS_API_KEY ?? "",
};

export async function getOperationalFeatures(layerId:string) {
  if (!arcgisConfig.portalUrl || !arcgisConfig.apiKey) return { layerId, mode:"mock", features:[] };
  const url = `${arcgisConfig.portalUrl}/sharing/rest/content/items/${layerId}?f=json&token=${arcgisConfig.apiKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("ArcGIS operational layer request failed");
  return response.json();
}

// Integration path:
// ArcGIS Enterprise / Online: authoritative airport layers, identities, and secured web maps.
// ArcGIS Velocity: streaming RFID, sensor, vehicle, and geofence telemetry.
// ArcGIS Indoors: terminal-level positioning, floor plans, and restricted-space routing.
// ArcGIS Experience Builder: configurable agency and airport stakeholder workspaces.
