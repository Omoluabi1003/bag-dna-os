import type { SealStatus, TamperSeal } from "@/lib/schema/bagDnaSchema";

export function activateSeal(bagDnaId: string, sealId: string, actor = "Passenger"): TamperSeal {
  return { id: sealId, bagDnaId, status: "intact", activatedBy: actor, activatedAt: "2026-06-15T08:15:00Z", lastEvent: "Seal activated and cryptographically bound" };
}
export function updateSeal(seal: TamperSeal, status: SealStatus, authorized = false) {
  const alert = status === "broken" && !authorized;
  return { seal: { ...seal, status, lastEvent: alert ? "Unauthorized opening detected" : `Seal status updated: ${status}` }, alert, passengerMessage: alert ? "Your bag seal requires security review." : `Seal is ${status}.` };
}
export const authorizeInspection = (seal: TamperSeal, actor: string) => ({ ...seal, status: "authorized inspection" as const, lastEvent: `Inspection authorized for ${actor}` });
export const recordSealBreak = (seal: TamperSeal, authorized = false) => updateSeal(seal, "broken", authorized);
export const detectUnauthorizedOpening = (seal: TamperSeal, authorized = false) => seal.status === "broken" && !authorized;
