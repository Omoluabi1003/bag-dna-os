import type { MissionBriefing, ReplayEvent } from "@/types/phoenix";

export function explainMission(events: ReplayEvent[], base: MissionBriefing): MissionBriefing {
  const missing = events.filter(event => event.evidenceState === "missing").length;
  const untrusted = events.filter(event => event.evidenceState === "untrusted").length;
  return { ...base, confidence: Math.min(97, 80 + missing * 8 + untrusted * 4) };
}

export function evidenceSummary(briefing: MissionBriefing) {
  return [`DEMO EVIDENCE SUMMARY`, briefing.anomaly, ...briefing.evidence.map(item => `${item.id} · ${item.label}: ${item.detail}`), `Recommended: ${briefing.action}`, `Confidence: ${briefing.confidence}% (deterministic local rules)`].join("\n");
}
