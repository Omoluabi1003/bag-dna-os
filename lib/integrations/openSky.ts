import { withFallback, type IntegrationResult } from "./types";

export interface AircraftContext {
  callsign: string;
  originCountry: string;
  altitudeM: number;
  velocityMps: number;
  longitude: number;
  latitude: number;
}

export const mockAircraft: AircraftContext[] = [
  { callsign: "APK719", originCountry: "Nigeria", altitudeM: 9144, velocityMps: 232, longitude: 3.52, latitude: 6.81 },
  { callsign: "VIR412", originCountry: "United Kingdom", altitudeM: 10668, velocityMps: 244, longitude: 2.91, latitude: 7.14 },
  { callsign: "QTR1406", originCountry: "Qatar", altitudeM: 10058, velocityMps: 238, longitude: 7.18, latitude: 9.12 },
];

export async function getNigeriaAirspaceContext(): Promise<IntegrationResult<AircraftContext[]>> {
  return withFallback("OpenSky Network", async () => {
    const response = await fetch("https://opensky-network.org/api/states/all?lamin=4.0&lomin=2.0&lamax=14.0&lomax=15.0", {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("OpenSky request failed");
    const payload = await response.json() as { states?: unknown[][] };
    return (payload.states ?? []).slice(0, 12).map((state) => ({
      callsign: String(state[1] ?? "UNKNOWN").trim(),
      originCountry: String(state[2] ?? "Unknown"),
      longitude: Number(state[5] ?? 0),
      latitude: Number(state[6] ?? 0),
      altitudeM: Number(state[7] ?? 0),
      velocityMps: Number(state[9] ?? 0),
    }));
  }, mockAircraft);
}
