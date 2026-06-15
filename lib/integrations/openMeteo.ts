import { withFallback, type IntegrationResult } from "./types";

export interface AviationWeather {
  temperatureC: number;
  windKph: number;
  precipitationMm: number;
  visibilityM: number;
  risk: "Low" | "Moderate" | "Elevated";
}

export const mockLagosWeather: AviationWeather = {
  temperatureC: 29,
  windKph: 18,
  precipitationMm: 0.4,
  visibilityM: 9200,
  risk: "Moderate",
};

export async function getAirportWeather(
  latitude = 6.5774,
  longitude = 3.3212,
): Promise<IntegrationResult<AviationWeather>> {
  return withFallback("Open-Meteo", async () => {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current: "temperature_2m,wind_speed_10m,precipitation,visibility",
      timezone: "UTC",
    });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("Open-Meteo request failed");
    const payload = await response.json() as { current?: Record<string, number> };
    const current = payload.current;
    if (!current) throw new Error("Open-Meteo returned no current conditions");
    const windKph = current.wind_speed_10m ?? 0;
    const precipitationMm = current.precipitation ?? 0;
    const visibilityM = current.visibility ?? 10000;
    return {
      temperatureC: current.temperature_2m ?? 0,
      windKph,
      precipitationMm,
      visibilityM,
      risk: windKph > 35 || precipitationMm > 8 || visibilityM < 3000
        ? "Elevated"
        : windKph > 20 || precipitationMm > 2 || visibilityM < 7000
          ? "Moderate"
          : "Low",
    };
  }, mockLagosWeather);
}
