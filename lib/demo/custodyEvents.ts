import { demoBags } from "./bags";

export type CustodyEvent = { id: string; bagId: string; flight: string; airport: string; type: string; actor: string; source: string; zone: string; timestamp: string; previousHash: string; eventHash: string; verified: boolean; seal: string; risk: string; geo: string };
const types = ["Identity issued", "Bag accepted", "Security screened", "Sortation scan", "Custody transferred", "Aircraft load reconciliation"];
const actors = ["Check-in agent A17", "BAG-DNA registry", "Screening lane 04", "Sortation PLC 12", "Ramp team R8"];
const hash = (n: number) => `sha256:${(n * 2654435761 >>> 0).toString(16).padStart(8, "0")}${"a7f3c9e1".repeat(4)}`;
export const custodyEvents: CustodyEvent[] = Array.from({ length: 96 }, (_, index) => {
  const bag = demoBags[index % demoBags.length];
  return { id: `EVT-2026-${String(8800 + index)}`, bagId: bag.id, flight: bag.flight, airport: bag.origin, type: types[index % types.length], actor: actors[index % actors.length], source: index % 2 ? "BAG-DNA demo ledger" : "Simulated checkpoint", zone: bag.zone, timestamp: `2026-07-29T${String(9 + Math.floor(index / 18)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")}:00Z`, previousHash: index ? hash(index - 1) : "GENESIS", eventHash: hash(index), verified: index % 23 !== 7, seal: bag.seal, risk: bag.risk, geo: `${bag.origin} operational boundary` };
});
