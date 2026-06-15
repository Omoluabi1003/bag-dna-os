import type { BagIntegrityScore, CustodyEvent, MismatchAlert, SealStatus } from "@/lib/schema/bagDnaSchema";

export interface IntegritySignals {
  verifiedIdentityEvents: number;
  mismatchEvents?: MismatchAlert[] | number;
  custodyGaps?: number;
  unauthorizedZoneEntries?: number;
  sealStatus?: SealStatus;
  custodyEvents?: CustodyEvent[];
}

export function getIntegrityBand(score: number): BagIntegrityScore["band"] {
  if (score >= 90) return "Verified";
  if (score >= 75) return "Monitor";
  if (score >= 60) return "Elevated";
  if (score >= 40) return "Investigate";
  return "Critical";
}

export function calculateBagIntegrityScore(signals: IntegritySignals): BagIntegrityScore {
  const mismatches = typeof signals.mismatchEvents === "number" ? signals.mismatchEvents : signals.mismatchEvents?.length ?? 0;
  const inferredGaps = signals.custodyEvents?.filter((event) => event.unauthorizedGap).length ?? 0;
  const custodyGaps = (signals.custodyGaps ?? 0) + inferredGaps;
  const unauthorized = signals.unauthorizedZoneEntries ?? signals.custodyEvents?.filter((event) => event.actor.assignedZone !== event.actor.actualZone).length ?? 0;
  const positiveSignals = [`${signals.verifiedIdentityEvents} verified identity events`];
  const deductions: string[] = [];
  let score = Math.min(100, 70 + signals.verifiedIdentityEvents * 3);
  if (mismatches) { score -= mismatches * 14; deductions.push(`${mismatches} identity mismatch event${mismatches === 1 ? "" : "s"}`); }
  if (custodyGaps) { score -= custodyGaps * 12; deductions.push(`${custodyGaps} custody continuity gap${custodyGaps === 1 ? "" : "s"}`); }
  if (unauthorized) { score -= unauthorized * 16; deductions.push(`${unauthorized} unauthorized zone entr${unauthorized === 1 ? "y" : "ies"}`); }
  if (signals.sealStatus === "broken" || signals.sealStatus === "invalid") { score -= 24; deductions.push(`tamper seal ${signals.sealStatus}`); }
  if (signals.sealStatus === "intact") positiveSignals.push("tamper seal intact");
  score = Math.max(0, Math.min(100, Math.round(score)));
  return { score, band: getIntegrityBand(score), positiveSignals, deductions };
}
