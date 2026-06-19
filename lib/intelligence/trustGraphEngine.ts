import { intelligenceCase } from "@/lib/data/intelligenceSeed";
import { calculateIntegrityScore } from "./integrityScoreEngine";
export type GraphNode = { id: string; label: string; type: string; score?: number };
export type GraphEdge = { from: string; to: string; label: string; impact: number };
export type TrustEvent = { label: string; impact: number; reason: string };
export type TrustGraphOutput = { trustNodes: GraphNode[]; trustEdges: GraphEdge[]; trustEvents: TrustEvent[]; trustScore: number; trustBreaks: string[]; positiveTrustSignals: string[]; negativeTrustSignals: string[]; explanation: string; recommendedAction: string };

export function buildTrustGraph(input = intelligenceCase): TrustGraphOutput {
  const i = calculateIntegrityScore(input);
  const weatherPressure = Number.isFinite(input.weatherPressure) ? input.weatherPressure : 0;
  const trustEvents: TrustEvent[] = [
    { label: "RFID match", impact: input.rfidMatch ? 8 : -25, reason: input.rfidMatch ? "Issued RFID was observed." : "RFID mismatch reduced trust." },
    { label: "NFC match", impact: input.nfcMatch ? 8 : -25, reason: input.nfcMatch ? "Secure NFC token matched." : "NFC mismatch reduced trust." },
    { label: "QR valid", impact: input.qrValid ? 4 : 0, reason: input.qrValid ? "Rotating QR token is valid." : "Invalid QR adds review context." },
    { label: "Visual DNA", impact: input.visualDnaMatch > 96 ? 10 : -20, reason: input.visualDnaMatch > 96 ? "Visual profile matches check-in capture." : "Visual profile is below threshold." },
    { label: "Weight tolerance", impact: input.weightDeltaKg < 0.5 ? 6 : -12, reason: input.weightDeltaKg < 0.5 ? "Weight stayed within tolerance." : "Weight changed beyond tolerance." },
    { label: "Seal status", impact: input.sealStatus === "intact" ? 8 : -20, reason: input.sealStatus === "intact" ? "Seal remained intact." : "Broken seal reduced trust." },
    { label: "Route consistency", impact: input.routeConsistent ? 4 : -10, reason: input.routeConsistent ? "Route agrees with manifest." : "Route deviated from manifest." },
    { label: "Custody continuity", impact: input.custodyContinuity >= 95 ? 8 : -15, reason: input.custodyContinuity >= 95 ? "No custody blackout detected." : "Custody continuity fell below threshold." },
    { label: "Weather pressure", impact: -weatherPressure, reason: weatherPressure ? "Weather pressure can weaken operational certainty." : "No weather pressure applied." },
  ];
  const positiveTrustSignals = trustEvents.filter((e) => e.impact > 0).map((e) => `${e.label} ${e.impact > 0 ? "+" : ""}${e.impact}: ${e.reason}`);
  const negativeTrustSignals = trustEvents.filter((e) => e.impact < 0).map((e) => `${e.label} ${e.impact}: ${e.reason}`);
  const nodes = ["Passenger", "BAG-DNA ID", "Bag physical profile", "RFID", "NFC", "QR token", "Tamper seal", "Flight", "Airport", "Checkpoint", "Staff handler", "Custody event", "Weather context", "Aircraft movement", "Evidence ledger"].map((label, idx) => ({ id: `n${idx}`, label, type: label, score: idx === 1 ? i.score : undefined }));
  const edges: GraphEdge[] = trustEvents.map((event, idx) => ({ from: `n${idx % 7}`, to: `n${(idx % 7) + 1}`, label: event.label, impact: event.impact }));
  return { trustNodes: nodes, trustEdges: edges, trustEvents, trustScore: i.score, trustBreaks: i.negativeFactors, positiveTrustSignals, negativeTrustSignals, explanation: `Current trust score is ${i.score}. Score changed because positive evidence (${positiveTrustSignals.join("; ") || "none"}) was weighed against negative evidence (${negativeTrustSignals.join("; ") || "none"}).`, recommendedAction: i.recommendedAction };
}
