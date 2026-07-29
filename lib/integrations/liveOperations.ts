export type FeedMode = "live" | "degraded";

export type AircraftTrack = {
  icao24: string;
  callsign: string;
  country: string;
  longitude: number;
  latitude: number;
  altitudeM: number;
  velocityKph: number;
  heading: number;
  onGround: boolean;
  lastContact: number;
};

export type AirportWeather = {
  station: string;
  observedAt: string;
  flightCategory: string;
  temperatureC: number | null;
  windDirection: number | null;
  windSpeedKt: number | null;
  visibilityMi: number | null;
  raw: string;
};

export type SurfaceWeather = {
  temperatureC: number | null;
  windKph: number | null;
  visibilityKm: number | null;
  precipitationMm: number | null;
  weatherCode: number | null;
};

export type LiveOperationsSnapshot = {
  generatedAt: string;
  mode: FeedMode;
  sources: {
    openSky: FeedMode;
    aviationWeather: FeedMode;
    openMeteo: FeedMode;
  };
  aircraft: AircraftTrack[];
  airportWeather: AirportWeather[];
  surfaceWeather: SurfaceWeather;
  notices: string[];
};

const OPENSKY_URL = "https://opensky-network.org/api/states/all?lamin=24.2&lomin=-84.0&lamax=35.5&lomax=-78.0";
const METAR_URL = "https://aviationweather.gov/api/data/metar?ids=KMIA,KFLL,KATL&format=json&hours=2";
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast?latitude=25.7959&longitude=-80.2870&current=temperature_2m,wind_speed_10m,visibility,precipitation,weather_code&wind_speed_unit=kmh&timezone=UTC";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { "User-Agent": "BAG-DNA-OS/1.0 public-data-console" },
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json() as Promise<T>;
}

function parseAircraft(payload: { states?: unknown[][] }): AircraftTrack[] {
  return (payload.states ?? [])
    .map((state) => {
      const longitude = Number(state[5]);
      const latitude = Number(state[6]);
      if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return null;
      return {
        icao24: String(state[0] ?? "unknown"),
        callsign: String(state[1] ?? "").trim() || String(state[0] ?? "UNKNOWN").toUpperCase(),
        country: String(state[2] ?? "Unknown"),
        lastContact: Number(state[4] ?? 0),
        longitude,
        latitude,
        altitudeM: Math.max(0, Number(state[7] ?? state[13] ?? 0)),
        onGround: Boolean(state[8]),
        velocityKph: Math.max(0, Math.round(Number(state[9] ?? 0) * 3.6)),
        heading: Number(state[10] ?? 0),
      } satisfies AircraftTrack;
    })
    .filter((item): item is AircraftTrack => Boolean(item))
    .sort((a, b) => b.lastContact - a.lastContact)
    .slice(0, 40);
}

function parseMetars(payload: Array<Record<string, unknown>>): AirportWeather[] {
  return payload.map((item) => ({
    station: String(item.icaoId ?? item.stationId ?? "UNKNOWN"),
    observedAt: String(item.reportTime ?? item.obsTime ?? ""),
    flightCategory: String(item.fltCat ?? "N/A"),
    temperatureC: item.temp === null || item.temp === undefined ? null : Number(item.temp),
    windDirection: item.wdir === null || item.wdir === undefined ? null : Number(item.wdir),
    windSpeedKt: item.wspd === null || item.wspd === undefined ? null : Number(item.wspd),
    visibilityMi: item.visib === null || item.visib === undefined ? null : Number(item.visib),
    raw: String(item.rawOb ?? "Observation available"),
  }));
}

function parseOpenMeteo(payload: { current?: Record<string, unknown> }): SurfaceWeather {
  const current = payload.current ?? {};
  const numberOrNull = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : null;
  return {
    temperatureC: numberOrNull(current.temperature_2m),
    windKph: numberOrNull(current.wind_speed_10m),
    visibilityKm: numberOrNull(current.visibility) === null ? null : Number(current.visibility) / 1000,
    precipitationMm: numberOrNull(current.precipitation),
    weatherCode: numberOrNull(current.weather_code),
  };
}

export async function getLiveOperationsSnapshot(): Promise<LiveOperationsSnapshot> {
  const [openSky, metars, openMeteo] = await Promise.allSettled([
    fetchJson<{ states?: unknown[][] }>(OPENSKY_URL),
    fetchJson<Array<Record<string, unknown>>>(METAR_URL),
    fetchJson<{ current?: Record<string, unknown> }>(OPEN_METEO_URL),
  ]);

  const notices: string[] = [];
  if (openSky.status === "rejected") notices.push("OpenSky anonymous feed is rate-limited or temporarily unavailable.");
  if (metars.status === "rejected") notices.push("NOAA Aviation Weather observations are temporarily unavailable.");
  if (openMeteo.status === "rejected") notices.push("Open-Meteo surface conditions are temporarily unavailable.");

  const sources = {
    openSky: openSky.status === "fulfilled" ? "live" : "degraded",
    aviationWeather: metars.status === "fulfilled" ? "live" : "degraded",
    openMeteo: openMeteo.status === "fulfilled" ? "live" : "degraded",
  } as const;

  return {
    generatedAt: new Date().toISOString(),
    mode: Object.values(sources).every((value) => value === "live") ? "live" : "degraded",
    sources,
    aircraft: openSky.status === "fulfilled" ? parseAircraft(openSky.value) : [],
    airportWeather: metars.status === "fulfilled" ? parseMetars(metars.value) : [],
    surfaceWeather: openMeteo.status === "fulfilled" ? parseOpenMeteo(openMeteo.value) : {
      temperatureC: null,
      windKph: null,
      visibilityKm: null,
      precipitationMm: null,
      weatherCode: null,
    },
    notices,
  };
}
