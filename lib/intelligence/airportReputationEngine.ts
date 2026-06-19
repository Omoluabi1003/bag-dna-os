import { airportReputationSeed } from "@/lib/data/airportReputationSeed";
export type AirportReputationOutput = { airport: string; airportTrustIndex: number | "N/A"; baggageIntegrityPerformance: number | "N/A"; custodyReliability: number | "N/A"; passengerProtectionScore: number | "N/A"; operationalPressure: number | "N/A"; riskTrend: string; recommendedImprovement: string; recommendation: string };

export function scoreAirportReputation(rows: readonly unknown[] = airportReputationSeed): AirportReputationOutput[] {
  if (!Array.isArray(rows) || rows.length === 0) return [{ airport: "Unknown", airportTrustIndex: "N/A", baggageIntegrityPerformance: "N/A", custodyReliability: "N/A", passengerProtectionScore: "N/A", operationalPressure: "N/A", riskTrend: "Unknown", recommendedImprovement: "Monitor", recommendation: "Monitor" }];
  return rows.map((row) => {
    const r = Array.isArray(row) ? row : [];
    const recommendation = String(r?.[7] ?? "Monitor");
    return { airport: String(r?.[0] ?? "Unknown"), airportTrustIndex: typeof r?.[1] === "number" ? r[1] : "N/A", baggageIntegrityPerformance: typeof r?.[2] === "number" ? r[2] : "N/A", custodyReliability: typeof r?.[3] === "number" ? r[3] : "N/A", passengerProtectionScore: typeof r?.[4] === "number" ? r[4] : "N/A", operationalPressure: typeof r?.[5] === "number" ? r[5] : "N/A", riskTrend: String(r?.[6] ?? "Unknown"), recommendedImprovement: recommendation, recommendation };
  });
}
