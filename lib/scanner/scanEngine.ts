import { compareVisualFingerprints } from "@/lib/fingerprint/visualFingerprintEngine";
import type { CheckpointScan, DigitalBaggageIdentity } from "@/lib/schema/bagDnaSchema";

export function scanBag(record: DigitalBaggageIdentity, scan: CheckpointScan) {
  const rfidMatch = scan.credential === record.rfid.uid;
  const nfcMatch = scan.credential === record.nfc.uid;
  const qrValid = scan.credential === record.qr.payload;
  const credentialMatch = rfidMatch || nfcMatch || qrValid;
  const weightMatch = Math.abs(scan.weightKg - record.physicalProfile.weightKg) <= 1.5;
  const visual = scan.visualProfile ? compareVisualFingerprints(record.physicalProfile, scan.visualProfile) : { matchPercentage: record.fingerprint.confidence, mismatchReasons: [] };
  const sealMatch = scan.sealStatus === "intact" || scan.sealStatus === "authorized inspection";
  const expected = record.custodyEvents.find((event) => !record.custodyEvents.some((prior) => prior.timestamp > event.timestamp))?.checkpoint ?? scan.checkpoint;
  const alerts = [
    !credentialMatch && "Credential is not bound to this BAG-DNA identity",
    !weightMatch && "Weight exceeds ±1.5 kg tolerance",
    visual.matchPercentage < 85 && "Visual fingerprint mismatch",
    !sealMatch && "Seal integrity failure",
  ].filter(Boolean) as string[];
  return { verified: alerts.length === 0, confidence: Math.max(12, 100 - alerts.length * 21), expectedCheckpoint: expected, actualCheckpoint: scan.checkpoint, rfidMatch, nfcMatch, qrValid, weightMatch, visualMatch: visual.matchPercentage, sealMatch, alerts, mismatchReasons: visual.mismatchReasons };
}

