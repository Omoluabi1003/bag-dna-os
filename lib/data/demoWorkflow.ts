import { bindBagIdentity } from "@/lib/tagging/tagBindingEngine";
import { activateSeal } from "@/lib/seals/sealEngine";
import type { BagPhysicalProfile, CheckpointName, DigitalBaggageIdentity, EvidenceLedgerEvent, FlightRef, PassengerIdentityRef } from "@/lib/schema/bagDnaSchema";

const people = [
  ["Omoluabi Paul", "Lagos", "LOS", "London", "LHR", "BA 074", "navy", 18.4],
  ["Abdulazeez Ekwunife", "Abuja", "ABV", "Dubai", "DXB", "EK 786", "black", 22.1],
  ["Regina Iyogun", "Lagos", "LOS", "Abuja", "ABV", "P4 712", "burgundy", 15.8],
  ["Daniel Osiagor", "Lagos", "LOS", "Toronto", "YYZ", "AC 905", "silver", 24.2],
  ["Carine Sanadina", "Port Harcourt", "PHC", "Johannesburg", "JNB", "SA 061", "teal", 19.6],
] as const;

const stages: CheckpointName[] = ["Check-in Counter", "Conveyor Intake", "Screening", "Sorting Hub", "Loading Bay", "Aircraft Cargo Hold", "Arrival Scan", "Belt Assignment", "Passenger Claim"];
const hash = (value: string) => Array.from(value).reduce((a, c) => Math.imul(a ^ c.charCodeAt(0), 16777619), 2166136261).toString(16).replace("-", "").padStart(8, "0");

function makeRecord(person: typeof people[number], index: number): DigitalBaggageIdentity {
  const [name, , origin, , destination, flightNumber, color, weightKg] = person;
  const passenger: PassengerIdentityRef = { id: `PAX-${String(index + 1).padStart(4, "0")}`, name, passportRef: `PP-••${7400 + index}`, boardingPassRef: `BP-${flightNumber.replace(" ", "")}-${12 + index}A` };
  const flight: FlightRef = { flightNumber, origin, destination, departure: `2026-06-15T${String(9 + index).padStart(2, "0")}:30:00Z` };
  const physicalProfile: BagPhysicalProfile = { weightKg, dimensionsCm: [68, 45, 27], color, sizeClass: "Medium", shellType: index % 2 ? "Hard shell" : "Soft shell", handleType: "Telescopic dual-rail", wheelType: "Four spinner", scratches: index === 3 ? ["Lower-right scuff"] : [], stickers: index === 0 ? ["Green circular travel sticker"] : [], dents: [], markings: [`Handle tape ${color}`], brandIndicators: ["Front badge geometry"] };
  const bound = bindBagIdentity({ passenger, flight, physicalProfile });
  const seal = activateSeal(bound.bagDnaId, bound.tamperSealId);
  const custodyEvents = stages.slice(0, index === 2 ? 7 : 9).map((checkpoint, stageIndex) => ({
    id: `CST-${index + 1}-${stageIndex + 1}`, bagDnaId: bound.bagDnaId, checkpoint, actualCheckpoint: checkpoint,
    timestamp: `2026-06-15T${String(9 + index + Math.floor(stageIndex / 3)).padStart(2, "0")}:${String((stageIndex * 8) % 60).padStart(2, "0")}:00Z`,
    actor: { id: stageIndex < 5 ? `OPS-${210 + stageIndex}` : "AUTO-778", name: stageIndex < 5 ? "Authorized airport operator" : "Automated baggage system", role: "Baggage custody", assignedZone: checkpoint, actualZone: checkpoint },
    device: stageIndex % 2 ? "Zebra FX9600 RFID Gate" : "BAG-DNA MultiSensor V3", rfidMatch: true, nfcMatch: true, qrValid: true, weightMatch: true, visualMatch: 99 - stageIndex * 0.4, sealStatus: "intact" as const, timeSinceLastScanMinutes: stageIndex ? 8 : 0, unauthorizedGap: false, confidence: 99 - stageIndex * 0.3, eventHash: hash(`${bound.bagDnaId}-${checkpoint}`),
  }));
  const eventTypes = ["tag issuance", "fingerprint capture", "RFID scan", "NFC validation", "QR validation", "seal activation", "custody transfer", "passenger claim"];
  const ledger: EvidenceLedgerEvent[] = eventTypes.map((eventType, ledgerIndex) => ({ id: `EVT-${index + 1}-${ledgerIndex + 1}`, eventType, bagDnaId: bound.bagDnaId, actor: ledgerIndex < 2 ? "Check-in Agent" : "BAG-DNA Protocol", checkpoint: stages[Math.min(ledgerIndex, stages.length - 1)], timestamp: `2026-06-15T${String(9 + index).padStart(2, "0")}:${String(ledgerIndex * 6).padStart(2, "0")}:00Z`, verificationSummary: "Identity credentials, route, physical profile, and custody context verified", previousHash: ledgerIndex ? hash(`${bound.bagDnaId}-${ledgerIndex - 1}`) : "GENESIS", currentHash: hash(`${bound.bagDnaId}-${ledgerIndex}`), integrityStatus: "Verified" }));
  return { bagDnaId: bound.bagDnaId, passenger, flight, physicalProfile, tag: { id: `TAG-${bound.bagDnaId}`, encryptedToken: bound.encryptedToken, issuedAt: "2026-06-15T09:00:00Z", status: "Issued and Bound", visibleFlightNumber: flightNumber }, rfid: { uid: bound.rfidUid, status: "active" }, nfc: { uid: bound.nfcUid, status: "active" }, qr: { payload: bound.rotatingQrPayload, validFrom: "2026-06-15T09:00:00Z", validUntil: "2026-06-15T09:00:30Z", rotationSeconds: 30 }, seal, fingerprint: { id: bound.visualFingerprintId, bagDnaId: bound.bagDnaId, profile: physicalProfile, confidence: 98.7 - index * 0.3, capturedAt: "2026-06-15T09:02:00Z" }, custodyEvents, riskScore: [8, 14, 21, 18, 11][index], ledger };
}

export const demoBaggageRecords = people.map(makeRecord);
export const primaryDemoBag = demoBaggageRecords[0];
export const demoLedgerEvents = demoBaggageRecords.flatMap((record) => record.ledger);
