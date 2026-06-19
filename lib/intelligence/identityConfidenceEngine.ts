import { intelligenceCase } from "@/lib/data/intelligenceSeed";

type IntelligenceInput = typeof intelligenceCase;
export type IdentityConfidenceOutput = { confidencePercentage: number; identityStatus: string; mismatchReasons: string[]; verificationSummary: string; recommendedAction: string };
const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function calculateIdentityConfidence(input: IntelligenceInput = intelligenceCase): IdentityConfidenceOutput {
  let score = 40;
  const positive: string[] = [];
  const mismatchReasons: string[] = [];
  const apply = (ok: boolean, plus: number, minus: number, good: string, bad: string) => { if (ok) { score += plus; positive.push(good); } else { score -= minus; mismatchReasons.push(bad); } };
  apply(Boolean(input.rfidMatch), 8, 25, "RFID match +8", "RFID mismatch -25");
  apply(Boolean(input.nfcMatch), 8, 25, "NFC match +8", "NFC mismatch -25");
  apply(Boolean(input.qrValid), 4, 0, "QR valid +4", "QR invalid");
  apply((input.visualDnaMatch ?? 0) > 96, 10, 20, "Visual DNA above 96% +10", "Visual mismatch -20");
  apply((input.weightDeltaKg ?? Number.POSITIVE_INFINITY) < 0.5, 6, 12, "Weight within tolerance +6", "Weight anomaly -12");
  apply(Boolean(input.dimensionsMatch), 4, 8, "Dimensions match +4", "Dimension mismatch -8");
  apply(input.sealStatus === "intact", 8, 20, "Seal intact +8", "Broken seal -20");
  apply(Boolean(input.routeConsistent), 4, 10, "Route consistent +4", "Route inconsistency -10");
  apply((input.custodyContinuity ?? 0) >= 95, 8, 15, "Custody continuity +8", "Custody gap -15");
  const confidencePercentage = clamp(score);
  const identityStatus = confidencePercentage >= 98 ? "Original bag verified" : confidencePercentage >= 90 ? "Same bag highly likely" : confidencePercentage >= 75 ? "Identity requires review" : "Potential substitution detected";
  return { confidencePercentage, identityStatus, mismatchReasons, verificationSummary: `${identityStatus}. Positive signals: ${positive.join(", ") || "none"}. Negative signals: ${mismatchReasons.join(", ") || "none"}.`, recommendedAction: confidencePercentage >= 90 ? "Release through verified custody with evidence ledger attached." : "Hold bag for manual identity investigation before passenger or claim release." };
}
