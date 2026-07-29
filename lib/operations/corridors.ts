export type AirportTerminal = { name: string; metadata?: Record<string, string> };

export type Airport = {
  code: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  terminals?: AirportTerminal[];
};

export type CorridorCategory = "domestic" | "international" | "transatlantic" | "transpacific" | "regional" | "high-risk-demo";
export type CorridorRiskLevel = "nominal-demo" | "review-demo" | "high-demo";

export type OperationalCorridor = {
  id: string;
  originAirportCode: string;
  destinationAirportCode: string;
  displayName: string;
  region: "North America" | "Europe" | "Africa" | "Middle East" | "Asia-Pacific" | "South America";
  category: CorridorCategory;
  riskLevel: CorridorRiskLevel;
  estimatedDurationMinutes: number;
  scenario?: { id: string; label: string; caseId: string; hasCompleteCaseData: boolean };
};

// Demo seed records. A live operational airport provider can replace this registry
// without changing corridor consumers because routes reference stable IATA codes.
export const airportRegistry: Record<string, Airport> = {
  MIA: { code: "MIA", name: "Miami International Airport", city: "Miami", country: "United States", latitude: 25.7959, longitude: -80.287 },
  FLL: { code: "FLL", name: "Fort Lauderdale–Hollywood International Airport", city: "Fort Lauderdale", country: "United States", latitude: 26.0726, longitude: -80.1527 },
  ATL: { code: "ATL", name: "Hartsfield–Jackson Atlanta International Airport", city: "Atlanta", country: "United States", latitude: 33.6407, longitude: -84.4277 },
  JFK: { code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "United States", latitude: 40.6413, longitude: -73.7781 },
  LAX: { code: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "United States", latitude: 33.9416, longitude: -118.4085 },
  ORD: { code: "ORD", name: "O'Hare International Airport", city: "Chicago", country: "United States", latitude: 41.9742, longitude: -87.9073 },
  DFW: { code: "DFW", name: "Dallas Fort Worth International Airport", city: "Dallas–Fort Worth", country: "United States", latitude: 32.8998, longitude: -97.0403 },
  LHR: { code: "LHR", name: "Heathrow Airport", city: "London", country: "United Kingdom", latitude: 51.47, longitude: -0.4543 },
  FRA: { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany", latitude: 50.0379, longitude: 8.5622 },
  NRT: { code: "NRT", name: "Narita International Airport", city: "Tokyo", country: "Japan", latitude: 35.772, longitude: 140.3929 },
  MEX: { code: "MEX", name: "Mexico City International Airport", city: "Mexico City", country: "Mexico", latitude: 19.4361, longitude: -99.0719 },
  YYZ: { code: "YYZ", name: "Toronto Pearson International Airport", city: "Toronto", country: "Canada", latitude: 43.6777, longitude: -79.6248 },
  DXB: { code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "United Arab Emirates", latitude: 25.2532, longitude: 55.3657 },
  DOH: { code: "DOH", name: "Hamad International Airport", city: "Doha", country: "Qatar", latitude: 25.2731, longitude: 51.6081 },
  LOS: { code: "LOS", name: "Murtala Muhammed International Airport", city: "Lagos", country: "Nigeria", latitude: 6.5774, longitude: 3.3212 },
  JNB: { code: "JNB", name: "O. R. Tambo International Airport", city: "Johannesburg", country: "South Africa", latitude: -26.1337, longitude: 28.242 },
  SIN: { code: "SIN", name: "Singapore Changi Airport", city: "Singapore", country: "Singapore", latitude: 1.3644, longitude: 103.9915 },
  SYD: { code: "SYD", name: "Sydney Airport", city: "Sydney", country: "Australia", latitude: -33.9399, longitude: 151.1753 },
  GRU: { code: "GRU", name: "São Paulo/Guarulhos International Airport", city: "São Paulo", country: "Brazil", latitude: -23.4356, longitude: -46.4731 },
};

const corridor = (origin: string, destination: string, region: OperationalCorridor["region"], category: CorridorCategory, minutes: number): OperationalCorridor => ({
  id: `${origin.toLowerCase()}-${destination.toLowerCase()}`,
  originAirportCode: origin,
  destinationAirportCode: destination,
  displayName: `${origin} → ${destination}`,
  region,
  category,
  riskLevel: "nominal-demo",
  estimatedDurationMinutes: minutes,
});

// Demo registry boundary: this array can be populated by an API-backed adapter later.
export const operationalCorridors: OperationalCorridor[] = [
  { ...corridor("MIA", "ATL", "North America", "domestic", 120), riskLevel: "high-demo", scenario: { id: "missing-arrival-scan", label: "Missing Arrival Scan Investigation", caseId: "BDO-DEMO-001", hasCompleteCaseData: true } },
  corridor("FLL", "ATL", "North America", "domestic", 115),
  corridor("MIA", "JFK", "North America", "domestic", 185),
  corridor("MIA", "LAX", "North America", "domestic", 350),
  corridor("ATL", "JFK", "North America", "domestic", 140),
  corridor("ATL", "LHR", "Europe", "transatlantic", 490),
  corridor("JFK", "LHR", "Europe", "transatlantic", 420),
  corridor("LAX", "NRT", "Asia-Pacific", "transpacific", 690),
  corridor("ORD", "FRA", "Europe", "transatlantic", 505),
  corridor("DFW", "MEX", "North America", "international", 165),
  corridor("YYZ", "LHR", "Europe", "transatlantic", 425),
  corridor("DXB", "LHR", "Middle East", "international", 465),
  corridor("DOH", "JFK", "Middle East", "international", 840),
  corridor("LOS", "LHR", "Africa", "international", 390),
  corridor("LOS", "ATL", "Africa", "international", 760),
  corridor("JNB", "DXB", "Africa", "international", 480),
  corridor("SIN", "SYD", "Asia-Pacific", "regional", 470),
  corridor("GRU", "MIA", "South America", "international", 505),
];

export const defaultOperationalCorridor = operationalCorridors[0];

export function resolveCorridorAirports(selected: OperationalCorridor) {
  const origin = airportRegistry[selected.originAirportCode];
  const destination = airportRegistry[selected.destinationAirportCode];
  if (!origin || !destination) throw new Error(`Unknown airport in corridor ${selected.id}`);
  return { origin, destination };
}

export function searchCorridors(query: string, category: "all" | "domestic" | "international" = "all") {
  const normalized = query.trim().toLocaleLowerCase();
  return operationalCorridors.filter((item) => {
    const { origin, destination } = resolveCorridorAirports(item);
    const categoryMatches = category === "all" || (category === "domestic" ? item.category === "domestic" : item.category !== "domestic");
    const searchable = [item.displayName, origin.city, origin.country, destination.city, destination.country].join(" ").toLocaleLowerCase();
    return categoryMatches && searchable.includes(normalized);
  });
}
