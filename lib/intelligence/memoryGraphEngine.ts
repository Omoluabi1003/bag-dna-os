import { intelligenceCase } from "@/lib/data/intelligenceSeed";

type MemoryInput = Partial<typeof intelligenceCase>;
export type MemoryGraphOutput = { learnedPatterns: string[]; patternFrequency: Record<string, number>; similarity: number; confidence: number; patternSimilarity: number; memoryConfidence: number; recommendedControls: string[]; recurringRiskClusters: string[] };

export function buildMemoryGraph(events: MemoryInput[] = [intelligenceCase]): MemoryGraphOutput {
  const safeEvents = Array.isArray(events) ? events : [];
  const patternFrequency = { repeatedSealFailures: 0, repeatedCustodyGaps: 0, repeatedRouteAnomalies: 0, repeatedStaffAnomalies: 0 };
  for (const event of safeEvents) {
    if (event?.sealStatus && event.sealStatus !== "intact") patternFrequency.repeatedSealFailures += 1;
    if ((event?.custodyContinuity ?? 100) < 95) patternFrequency.repeatedCustodyGaps += 1;
    if (event?.routeConsistent === false) patternFrequency.repeatedRouteAnomalies += 1;
    if (event?.staffZoneCompliant === false) patternFrequency.repeatedStaffAnomalies += 1;
  }
  const total = safeEvents.length || 1;
  const hits = Object.values(patternFrequency).reduce((sum, value) => sum + value, 0);
  const similarity = Math.round(Math.min(100, (hits / total) * 35));
  const confidence = Math.round(Math.min(100, total * 20 + hits * 10));
  const learnedPatterns = Object.entries(patternFrequency).filter(([, count]) => count > 0).map(([name, count]) => `${name}: ${count}`);
  return { learnedPatterns: learnedPatterns.length ? learnedPatterns : ["No repeated anomaly patterns learned from current inputs"], patternFrequency, similarity, confidence, patternSimilarity: similarity, memoryConfidence: confidence, recommendedControls: hits ? ["Increase verification on repeated anomaly dimensions", "Review affected custody route before release"] : ["Continue monitoring; no learned anomaly control required"], recurringRiskClusters: Object.entries(patternFrequency).filter(([, count]) => count > 0).map(([name]) => name) };
}
