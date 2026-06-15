import type { BagPhysicalProfile, FlightRef, PassengerIdentityRef } from "@/lib/schema/bagDnaSchema";

export interface BindBagIdentityInput { passenger: PassengerIdentityRef; flight: FlightRef; physicalProfile: BagPhysicalProfile; issuedAt?: string; }
export interface BoundBagIdentity { bagDnaId: string; encryptedToken: string; rfidUid: string; nfcUid: string; rotatingQrPayload: string; tamperSealId: string; visualFingerprintId: string; custodyEventId: string; identityConfidenceScore: number; }

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) result = Math.imul(result ^ value.charCodeAt(index), 16777619);
  return (result >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

export function bindBagIdentity(input: BindBagIdentityInput): BoundBagIdentity {
  const seed = `${input.passenger.id}|${input.passenger.passportRef}|${input.flight.flightNumber}|${input.flight.origin}|${input.flight.destination}|${input.physicalProfile.weightKg}`;
  const a = hash(seed);
  const b = hash(`${seed}|physical`);
  return {
    bagDnaId: `BD-${a.slice(0, 4)}-${b.slice(0, 4)}`,
    encryptedToken: `enc.v1.${hash(`${seed}|identity`)}.${hash(`${seed}|itinerary`)}`,
    rfidUid: `E2-80-${a.match(/.{1,2}/g)?.join("-")}`,
    nfcUid: `04:${b.match(/.{1,2}/g)?.join(":")}`,
    rotatingQrPayload: `bagdna://verify/${a}${b}?window=30`,
    tamperSealId: `SEAL-${hash(`${seed}|seal`).slice(0, 8)}`,
    visualFingerprintId: `VFP-${hash(`${seed}|vision`).slice(0, 8)}`,
    custodyEventId: `CST-${hash(`${seed}|custody`).slice(0, 8)}`,
    identityConfidenceScore: 98 + (parseInt(a.slice(-2), 16) % 18) / 10,
  };
}

