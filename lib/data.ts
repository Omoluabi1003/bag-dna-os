export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export const bags = [
  { id: "BD-7A92-1184", tag: "DL 004921", passenger: "Amara Okafor", flight: "DL 184", route: "ATL → LHR", status: "Loaded", zone: "Ramp B-14", risk: 12, level: "Low" as RiskLevel, color: "emerald" },
  { id: "BD-8C11-4072", tag: "BA 207318", passenger: "Liam Chen", flight: "BA 226", route: "ATL → LHR", status: "Screening", zone: "CBRA-04", risk: 68, level: "High" as RiskLevel, color: "amber" },
  { id: "BD-2F68-9351", tag: "KL 778204", passenger: "Sofia Martins", flight: "KL 622", route: "ATL → AMS", status: "Transferred", zone: "Pier F", risk: 24, level: "Low" as RiskLevel, color: "cyan" },
  { id: "BD-5D04-6209", tag: "AF 112983", passenger: "Noah Williams", flight: "AF 031", route: "ATL → CDG", status: "Exception", zone: "Hold E-7", risk: 91, level: "Critical" as RiskLevel, color: "red" },
  { id: "BD-1B77-4438", tag: "UA 845510", passenger: "Elena Rossi", flight: "UA 883", route: "ATL → FRA", status: "Reconciled", zone: "Gate F03", risk: 31, level: "Medium" as RiskLevel, color: "blue" },
];

export const flights = [
  { code: "DL 184", route: "ATL / LHR", departure: "18:42", gate: "F12", bags: 286, loaded: 261, status: "Boarding" },
  { code: "BA 226", route: "ATL / LHR", departure: "19:05", gate: "F03", bags: 248, loaded: 191, status: "Loading" },
  { code: "AF 031", route: "ATL / CDG", departure: "19:28", gate: "E16", bags: 219, loaded: 177, status: "On time" },
  { code: "KL 622", route: "ATL / AMS", departure: "20:10", gate: "F08", bags: 204, loaded: 122, status: "Screening" },
];

export const custodyEvents = [
  { time: "16:04:12", title: "Identity minted", place: "ATL · Terminal S", actor: "Delta DCS", detail: "Bag identity cryptographically bound to passenger PNR.", state: "complete" },
  { time: "16:08:47", title: "Acceptance scan", place: "Counter 42 · Zone S2", actor: "Agent ATL-0284", detail: "Weight 18.4 kg · dimensions verified.", state: "complete" },
  { time: "16:17:03", title: "Security screening", place: "CBRA-04", actor: "TSA EDS-17", detail: "Level 1 clear · CT signature archived.", state: "complete" },
  { time: "16:31:28", title: "Sortation transfer", place: "BHS Junction J-19", actor: "Auto-sort AS-04", detail: "Route validated for DL 184 / ULD AKE-4812.", state: "complete" },
  { time: "16:43:51", title: "Ramp custody", place: "Ramp B-14", actor: "Handler RMP-771", detail: "Physical custody transferred; seal intact.", state: "active" },
  { time: "Pending", title: "Aircraft loaded", place: "Gate F12", actor: "Awaiting scan", detail: "Target compartment: hold 4.", state: "pending" },
];

export const alerts = [
  { id: "ALT-2931", title: "Chain-of-custody break", detail: "BD-5D04-6209 · Hold E-7", time: "2 min", severity: "Critical" },
  { id: "ALT-2928", title: "Route deviation detected", detail: "ULD AKE-1188 · Pier F", time: "8 min", severity: "High" },
  { id: "ALT-2924", title: "Extended zone dwell", detail: "12 bags · CBRA-04", time: "14 min", severity: "Medium" },
  { id: "ALT-2919", title: "Identity reconciliation", detail: "BA 226 · 3 records", time: "21 min", severity: "Review" },
];

export const zones = [
  { name: "Terminal South", code: "S2", x: 18, y: 68, load: 82, status: "Nominal" },
  { name: "CBRA Screening", code: "C4", x: 38, y: 52, load: 94, status: "Elevated" },
  { name: "Pier F Sortation", code: "PF", x: 58, y: 38, load: 71, status: "Nominal" },
  { name: "Ramp B", code: "RB", x: 73, y: 54, load: 64, status: "Nominal" },
  { name: "Gate F12", code: "F12", x: 86, y: 27, load: 88, status: "Watch" },
];

export const heatPoints = [
  { x: 21, y: 69, value: 16 }, { x: 37, y: 53, value: 85 },
  { x: 49, y: 48, value: 34 }, { x: 61, y: 38, value: 61 },
  { x: 73, y: 55, value: 28 }, { x: 84, y: 29, value: 73 },
];

export const riskFactors = [
  { label: "Custody continuity", value: 92, trend: "+8.4%", tone: "red" },
  { label: "Route conformity", value: 76, trend: "+3.1%", tone: "amber" },
  { label: "Identity confidence", value: 18, trend: "−2.2%", tone: "emerald" },
  { label: "Screening anomaly", value: 64, trend: "+6.7%", tone: "amber" },
];

export const navItems = [
  { label: "Operations", href: "/dashboard" },
  { label: "Tagging Station", href: "/tagging" },
  { label: "Checkpoint Scanner", href: "/scanner" },
  { label: "AI Fingerprint", href: "/fingerprint" },
  { label: "Mismatch Lab", href: "/mismatch-lab" },
  { label: "Nigeria Intelligence", href: "/intelligence" },
  { label: "Identity Registry", href: "/registry" },
  { label: "Chain of Custody", href: "/custody" },
  { label: "AI Risk", href: "/risk" },
  { label: "Digital Twin", href: "/digital-twin" },
  { label: "Passenger Portal", href: "/passenger" },
  { label: "Evidence Ledger", href: "/ledger" },
  { label: "Tamper Seals", href: "/tamper-seals" },
  { label: "Staff Monitoring", href: "/staff-monitoring" },
  { label: "Security Modules", href: "/secure-tags" },
  { label: "Pilot Strategy", href: "/pilot" },
  { label: "Beta Readiness", href: "/beta" },
  { label: "API Roadmap", href: "/integrations" },
  { label: "Investor Readiness", href: "/investors" },
];
