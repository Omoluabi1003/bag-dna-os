export type EvidenceState = "verified" | "missing" | "untrusted";

export interface EvidenceReference { id: string; label: string; detail: string; state: EvidenceState }
export interface RiskFactor { label: string; contribution: number; reason: string }
export interface ReplayEvent { id: string; time: string; airport: "MIA" | "ATL"; zone: string; state: string; holder: string; confidence: number; evidenceState: EvidenceState; detail: string; x: number; y: number }
export interface MissionBriefing { situation: string; anomaly: string; impact: string; action: string; confidence: number; reasons: string[]; evidence: EvidenceReference[] }
export interface JourneyReplayState { index: number; playing: boolean; speed: number }
export interface OperationalDecision { action: string; note: string; recordedAt: string }
export interface BagMemoryRecord { id: string; label: "DEMO DATA"; status: string; flight: string; route: string; seal: string; risk: number; events: ReplayEvent[]; briefing: MissionBriefing }
