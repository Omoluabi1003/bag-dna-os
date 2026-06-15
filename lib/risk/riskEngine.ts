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
