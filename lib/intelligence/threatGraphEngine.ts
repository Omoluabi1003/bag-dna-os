import { intelligenceCase } from "@/lib/data/intelligenceSeed";

type IntelligenceInput = typeof intelligenceCase;
export type ThreatGraphOutput = { matchedThreats: { id: string; name: string; confidence: number; severity: string }[]; threatConfidence: number; severity: string; evidence: string[]; recommendedAction: string; similarHistoricalPatterns: string[] };

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const severityFor = (failures: number, confidence: number) => failures >= 3 || confidence >= 75 ? "Critical" : failures === 2 || confidence >= 45 ? "High" : failures === 1 ? "Guarded" : "Clear";

export function detectThreatPatterns(input: IntelligenceInput = intelligenceCase): ThreatGraphOutput {
  const matchedThreats: ThreatGraphOutput["matchedThreats"] = [];
  const evidence: string[] = [];
  const historical = new Set<string>();
  const weatherPressure = Number.isFinite(input.weatherPressure) ? input.weatherPressure : 0;
  const addThreat = (id: string, name: string, baseConfidence: number, reason: string, pattern: string) => {
    const escalation = matchedThreats.length * 8 + Math.max(0, weatherPressure) * 0.5;
    const confidence = clamp(baseConfidence + escalation);
    matchedThreats.push({ id, name, confidence, severity: severityFor(matchedThreats.length + 1, confidence) });
    evidence.push(reason);
    historical.add(pattern);
  };

  if (input.sealStatus !== "intact") addThreat("SEAL-COMPROMISE", "Seal Compromise Signature", 55, `Seal status is ${input.sealStatus ?? "unknown"}, not intact.`, "Repeated seal failures on comparable custody paths");
  if (!input.rfidMatch) addThreat("TAG-IDENTITY", "Tag Identity Threat", 60, "RFID did not match the issued BAG-DNA tag identity.", "Repeated tag identity mismatches");
  if (input.visualDnaMatch < 96) addThreat("PHYSICAL-SUBSTITUTION", "Physical Substitution Threat", 58, `Visual DNA match is ${input.visualDnaMatch ?? "unknown"}%, below the 96% threshold.`, "Physical substitution patterns after visual mismatch");
  if (input.custodyContinuity < 95) addThreat("CUSTODY-BLACKOUT", "Custody Blackout Threat", 50, `Custody continuity is ${input.custodyContinuity ?? "unknown"}%, below the 95% threshold.`, "Repeated custody gaps on similar routes");
  if (!input.nfcMatch) addThreat("NFC-IDENTITY", "NFC Credential Threat", 55, "NFC secure token did not match the issued identity.", "Repeated secure-token mismatch patterns");
  if (!input.qrValid) addThreat("QR-TOKEN", "QR Validation Threat", 35, "Rotating QR token is not valid.", "Expired or invalid token patterns");
  if (input.weightDeltaKg >= 0.5) addThreat("WEIGHT-ANOMALY", "Weight Anomaly Threat", 35, `Weight changed by ${input.weightDeltaKg} kg, beyond tolerance.`, "Unexpected weight-delta patterns");
  if (!input.routeConsistent) addThreat("ROUTE-ANOMALY", "Route Anomaly Threat", 40, "Observed route is inconsistent with manifest.", "Repeated route anomaly patterns");
  if (!input.staffZoneCompliant) addThreat("STAFF-ZONE", "Staff Zone Anomaly Threat", 35, "Handling staff zone assignment is not compliant.", "Repeated staff-zone anomaly patterns");
  if (!input.claimVerified) evidence.push("Claim verification is still pending; this is review evidence, not a threat signature by itself.");

  const threatConfidence = matchedThreats.length ? clamp(matchedThreats.reduce((sum, t) => sum + t.confidence, 0) / matchedThreats.length + (matchedThreats.length - 1) * 6) : 0;
  const severity = severityFor(matchedThreats.length, threatConfidence);
  return {
    matchedThreats,
    threatConfidence,
    severity,
    evidence: evidence.length ? evidence : ["No evidence"],
    recommendedAction: matchedThreats.length ? "Hold for investigator review; verify identity, seal, custody trail, route, and claim evidence before release." : "No threat signatures detected; continue normal verified-custody release.",
    similarHistoricalPatterns: matchedThreats.length ? [...historical] : ["None"],
  };
}
