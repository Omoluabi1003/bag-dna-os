import type { BagPhysicalProfile } from "@/lib/schema/bagDnaSchema";

const fields: (keyof BagPhysicalProfile)[] = ["color", "sizeClass", "shellType", "handleType", "wheelType", "scratches", "stickers", "dents", "markings", "brandIndicators"];
const normalize = (value: unknown) => Array.isArray(value) ? value.map(String).sort().join("|").toLowerCase() : String(value).trim().toLowerCase();

export function compareVisualFingerprints(original: BagPhysicalProfile, current: BagPhysicalProfile) {
  const mismatchReasons = fields.filter((field) => normalize(original[field]) !== normalize(current[field])).map((field) => `${String(field).replace(/([A-Z])/g, " $1").toLowerCase()} differs from issued profile`);
  const weightDelta = Math.abs(original.weightKg - current.weightKg);
  if (weightDelta > 1.5) mismatchReasons.push(`weight changed by ${weightDelta.toFixed(1)} kg`);
  const matchPercentage = Math.max(0, Math.round(100 - mismatchReasons.length * 8.5));
  return { matchPercentage, confidenceScore: Math.max(0, Math.round(matchPercentage * .98)), mismatchReasons, status: matchPercentage >= 85 ? "match" as const : "mismatch" as const };
}

export function createVisualFingerprintProfile(bagDnaId: string, profile: BagPhysicalProfile, capturedAt = new Date().toISOString()) {
  return { id: `VFP-${bagDnaId.replaceAll("-", "").slice(-8)}`, bagDnaId, profile, confidence: 98.7, capturedAt };
}
