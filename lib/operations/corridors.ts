import { getAirportByCode, validateAirportCoordinates } from "./airports";
export { airportRegistry, getAirportByCode, validateAirportCoordinates, type Airport } from "./airports";

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
  corridor("LHR", "DXB", "Middle East", "international", 465),
  corridor("DXB", "LHR", "Middle East", "international", 465),
  corridor("DOH", "JFK", "Middle East", "international", 840),
  corridor("LOS", "LHR", "Africa", "international", 390),
  corridor("LOS", "ATL", "Africa", "international", 760),
  corridor("JNB", "DXB", "Africa", "international", 480),
  corridor("SIN", "SYD", "Asia-Pacific", "regional", 470),
  corridor("GRU", "MIA", "South America", "international", 505),
];

export const defaultOperationalCorridor = operationalCorridors[0];

export function resolveCorridor(selected: OperationalCorridor) {
  const origin = getAirportByCode(selected.originAirportCode);
  const destination = getAirportByCode(selected.destinationAirportCode);
  if (!origin || !destination) {
    if (process.env.NODE_ENV !== "production") console.warn(`Corridor ${selected.id} references an unknown airport`);
    return undefined;
  }
  validateAirportCoordinates(origin); validateAirportCoordinates(destination);
  return { origin, destination };
}

export function resolveCorridorAirports(selected: OperationalCorridor) {
  const resolved = resolveCorridor(selected);
  if (!resolved) throw new Error(`Route unavailable: corridor ${selected.id} cannot be resolved`);
  return resolved;
}

export function searchCorridors(query: string, category: "all" | "domestic" | "international" = "all") {
  const normalized = query.trim().toLocaleLowerCase();
  return operationalCorridors.filter((item) => {
    const resolved = resolveCorridor(item);
    if (!resolved) return false;
    const { origin, destination } = resolved;
    const categoryMatches = category === "all" || (category === "domestic" ? item.category === "domestic" : item.category !== "domestic");
    const searchable = [item.displayName, origin.city, origin.country, destination.city, destination.country].join(" ").toLocaleLowerCase();
    return categoryMatches && searchable.includes(normalized);
  });
}
