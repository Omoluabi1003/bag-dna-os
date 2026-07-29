import { demoFlights } from "./flights";

export type DemoBag = { id: string; passengerRef: string; flight: string; origin: string; destination: string; status: "In custody" | "Exception" | "Delivered"; holder: string; zone: string; seal: "Intact" | "Review"; risk: "Low" | "Medium" | "High"; lastScan: string; chainVerified: boolean; fingerprint: string };

const holders = ["Airline check-in", "Screening authority", "Ramp operations", "Transfer team"];
const zones = ["D Check-in", "CBIS screening", "Sortation pier", "Transfer induction"];

export const demoBags: DemoBag[] = Array.from({ length: 36 }, (_, index) => {
  const flight = demoFlights[index % demoFlights.length];
  const exception = index % 9 === 4;
  return {
    id: `BDO-${flight.origin}-2026-${String(184 + index).padStart(6, "0")}`,
    passengerRef: `PAX-••${String(4100 + index).slice(-4)}`,
    flight: flight.id, origin: flight.origin, destination: flight.destination,
    status: exception ? "Exception" : index % 8 === 0 ? "Delivered" : "In custody",
    holder: holders[index % holders.length], zone: zones[index % zones.length],
    seal: exception && index % 2 === 0 ? "Review" : "Intact",
    risk: exception ? (index % 3 === 0 ? "High" : "Medium") : "Low",
    lastScan: `${String(10 + (index % 8)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")}:00Z`,
    chainVerified: !exception, fingerprint: `${["Hard shell", "Soft shell", "Hybrid"][index % 3]} · ${["navy", "charcoal", "teal"][index % 3]} · ${18 + index % 9}.${index % 10} kg`,
  };
});
