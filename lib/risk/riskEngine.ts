export type RiskInputs = {
  routeRisk:number; weightMismatch:boolean; visualMismatch:boolean; sealBroken:boolean;
  custodyDelayMinutes:number; unauthorizedZone:boolean; staffAnomaly:boolean;
  previousCorridorIncidents:number; passengerClaimDispute:boolean; screeningException:boolean;
};
export type RiskBand = "Low" | "Monitor" | "Elevated" | "High" | "Critical";

export function calculateRisk(input: RiskInputs) {
  const reasons:string[] = [];
  let score = Math.min(25, input.routeRisk);
  const add = (condition:boolean, points:number, reason:string) => { if(condition){ score += points; reasons.push(reason); } };
  add(input.weightMismatch, 12, "Weight differs from the enrolled identity profile");
  add(input.visualMismatch, 18, "Computer-vision fingerprint mismatch");
  add(input.sealBroken, 16, "Seal break occurred outside an authorized inspection");
  add(input.custodyDelayMinutes > 12, Math.min(10, input.custodyDelayMinutes / 3), "Custody dwell exceeded the operational threshold");
  add(input.unauthorizedZone, 15, "Bag entered an unauthorized airport zone");
  add(input.staffAnomaly, 10, "Handling actor was outside assigned duties");
  add(input.previousCorridorIncidents > 4, 6, "Corridor has an elevated recent incident history");
  add(input.passengerClaimDispute, 8, "Passenger claim verification is disputed");
  add(input.screeningException, 10, "Security screening generated an exception");
  score = Math.round(Math.min(100, score));
  const band:RiskBand = score < 20 ? "Low" : score < 40 ? "Monitor" : score < 60 ? "Elevated" : score < 80 ? "High" : "Critical";
  const recommendedAction = band === "Critical" ? "Place bag on security hold and initiate physical identity reconciliation." : band === "High" ? "Route to secondary inspection and supervisor review." : band === "Elevated" ? "Increase verification frequency at the next custody checkpoints." : "Continue standard custody monitoring.";
  return { overallScore:score, riskBand:band, reasons:reasons.length ? reasons : ["No material anomalies detected"], recommendedAction };
}

export type PublicRiskContext = {
  weatherRisk?: number;
  airportReadinessRisk?: number;
  corridorPressure?: number;
  countryReadinessRisk?: number;
  aircraftMovementContext?: number;
  threatPatternSimilarity?: number;
  custodyMismatchEvents?: number;
};

export function calculatePublicDataRisk(input: RiskInputs, context: PublicRiskContext = {}) {
  const base = calculateRisk(input);
  const publicReasons: string[] = [];
  const weighted = [
    [context.weatherRisk, 0.10, "Weather conditions add handling uncertainty"],
    [context.airportReadinessRisk, 0.14, "Airport readiness context requires tighter verification"],
    [context.corridorPressure, 0.12, "Corridor pressure is above normal operating baseline"],
    [context.countryReadinessRisk, 0.10, "Country readiness indicators increase protection priority"],
    [context.aircraftMovementContext, 0.08, "Aircraft movement context suggests operational disruption"],
    [context.threatPatternSimilarity, 0.18, "Pattern resembles known simulated baggage integrity threats"],
    [context.custodyMismatchEvents ? Math.min(100, context.custodyMismatchEvents * 18) : undefined, 0.16, "Custody mismatch events are present"],
  ] as const;
  const publicLift = weighted.reduce((sum, [value, weight, reason]) => {
    if (typeof value === "number" && value > 35) publicReasons.push(reason);
    return sum + (typeof value === "number" ? value * weight : 0);
  }, 0);
  const overallScore = Math.round(Math.min(100, base.overallScore * 0.78 + publicLift));
  const riskBand: RiskBand = overallScore < 20 ? "Low" : overallScore < 40 ? "Monitor" : overallScore < 60 ? "Elevated" : overallScore < 80 ? "High" : "Critical";
  return { ...base, overallScore, riskBand, publicContextReasons: publicReasons, recommendedAction: publicReasons.length ? `${base.recommendedAction} Include public-data context in the review narrative.` : base.recommendedAction };
}
