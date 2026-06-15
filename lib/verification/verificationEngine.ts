import { compareVisualFingerprints } from "@/lib/fingerprint/visualFingerprintEngine";
import { calculateBagIntegrityScore } from "@/lib/trust/bagIntegrityScore";
import type { CheckpointName, DigitalBaggageIdentity, VerificationResult } from "@/lib/schema/bagDnaSchema";

export interface VerificationInput {
  rfidUid: string; nfcUid: string; qrPayload: string; weightKg: number;
  sealStatus: DigitalBaggageIdentity["seal"]["status"];
  actualCheckpoint: CheckpointName; expectedCheckpoint: CheckpointName;
  staffAssignedZone: string; staffActualZone: string;
  visualProfile: DigitalBaggageIdentity["physicalProfile"];
}

export function verifyBag(record: DigitalBaggageIdentity, input: VerificationInput): VerificationResult {
  const visual = compareVisualFingerprints(record.physicalProfile, input.visualProfile);
  const checks = {
    rfid: input.rfidUid === record.rfid.uid,
    nfc: input.nfcUid === record.nfc.uid,
    rotatingQr: input.qrPayload === record.qr.payload,
    weight: Math.abs(input.weightKg - record.physicalProfile.weightKg) <= 1.5,
    visualFingerprint: visual.matchPercentage >= 85,
    tamperSeal: input.sealStatus === "intact" || input.sealStatus === "authorized inspection",
    routeConsistency: input.actualCheckpoint === input.expectedCheckpoint,
    custodyContinuity: !record.custodyEvents.some((event) => event.unauthorizedGap),
    staffCompliance: input.staffAssignedZone === input.staffActualZone,
  };
  const failures = Object.entries(checks).filter(([, pass]) => !pass).map(([name]) => name);
  const integrity = calculateBagIntegrityScore({ verifiedIdentityEvents: Object.values(checks).filter(Boolean).length, mismatchEvents: failures.length, custodyEvents: record.custodyEvents, sealStatus: input.sealStatus });
  const decision = failures.length === 0 ? "pass" : failures.length === 1 ? "monitor" : failures.length <= 3 ? "investigate" : "fail";
  const reasons = failures.length ? failures.map((failure) => `${failure.replace(/([A-Z])/g, " $1")} did not match the issued baggage identity`) : ["All digital, physical, route, seal, custody, and staff controls agree."];
  const recommendedAction = decision === "pass" ? "Authorize custody transfer and append a verified ledger event." : decision === "monitor" ? "Allow controlled movement and require verification at the next checkpoint." : decision === "investigate" ? "Hold the bag in a secure zone and reconcile identity evidence." : "Quarantine the bag, stop custody transfer, and notify aviation security.";
  return { bagDnaId: record.bagDnaId, score: integrity.score, decision, checks, reasons, recommendedAction, integrity };
}
