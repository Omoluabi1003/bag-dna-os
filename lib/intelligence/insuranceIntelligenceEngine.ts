import { intelligenceCase } from "@/lib/data/intelligenceSeed";
import { insuranceSeed } from "@/lib/data/insuranceSeed";
import { calculateIntegrityScore } from "./integrityScoreEngine";
import { calculateIdentityConfidence } from "./identityConfidenceEngine";
import { detectThreatPatterns } from "./threatGraphEngine";
export type InsuranceIntelligenceOutput = { claimRiskScore: number; estimatedClaimExposure: string; fraudProbability: number; evidenceStrength: number; recommendedClaimAction: string; insurerSummary: string; claimExposure: string };
const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function calculateInsuranceIntelligence(input = intelligenceCase): InsuranceIntelligenceOutput {
  const integrity = calculateIntegrityScore(input).score;
  const identityConfidence = calculateIdentityConfidence(input).confidencePercentage;
  const threatConfidence = detectThreatPatterns(input).threatConfidence;
  let claimRiskScore = (100 - integrity) * 0.3 + (100 - identityConfidence) * 0.3 + threatConfidence * 0.25 + ((input.sealStatus === "intact" ? 0 : 20) + ((input.custodyContinuity ?? 100) >= 95 ? 0 : 15)) * 0.15;
  claimRiskScore = clamp(claimRiskScore);
  const exposure = input.baggageValueBand === "premium" ? insuranceSeed.premiumExposureUsd : insuranceSeed.baseExposureUsd;
  const evidenceStrength = clamp((integrity + identityConfidence + (100 - threatConfidence)) / 3);
  const claimExposure = claimRiskScore >= 60 ? "High" : claimRiskScore >= 30 ? "Moderate" : "Low";
  return { claimRiskScore, estimatedClaimExposure: `$${exposure.toLocaleString()}`, fraudProbability: claimRiskScore, evidenceStrength, recommendedClaimAction: claimRiskScore < 25 ? "Auto-approve low-risk claim path with evidence ledger attached." : "Route to adjuster with identity, threat, seal, and custody evidence attached.", insurerSummary: `Fraud probability ${claimRiskScore}%. Claim exposure ${claimExposure}. Evidence strength ${evidenceStrength}% derived from integrity, identity, seal, threat, and custody inputs.`, claimExposure };
}
