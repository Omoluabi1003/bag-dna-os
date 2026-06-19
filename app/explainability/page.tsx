import { AppShell } from "@/components/shell";
import { SectionHeading } from "@/components/ui";
import { intelligenceCase } from "@/lib/data/intelligenceSeed";
import { buildTrustGraph, calculateIdentityConfidence, calculateIntegrityScore, detectThreatPatterns } from "@/lib/intelligence";

export default function ExplainabilityPage() {
  const integrity = calculateIntegrityScore();
  const identity = calculateIdentityConfidence();
  const threat = detectThreatPatterns();
  const trust = buildTrustGraph();
  const inputs = Object.entries(intelligenceCase).filter(([, value]) => ["string", "number", "boolean"].includes(typeof value));
  const positive = trust.trustEvents.filter((event) => event.impact > 0);
  const negative = trust.trustEvents.filter((event) => event.impact < 0);
  return <AppShell title="Explainability Center" eyebrow="Investigator reasoning"><div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]"><section className="glass p-6"><SectionHeading eyebrow="Inputs" title="Facts used by the reasoning engines" /><div className="grid gap-2 text-xs text-mist sm:grid-cols-2">{inputs.map(([key, value]) => <p key={key} className="rounded-2xl bg-white/[.04] p-3"><b className="text-ivory">{key}</b><br />{String(value)}</p>)}</div></section><section className="glass p-6"><SectionHeading eyebrow="Reasoning" title="Why is the bag trusted or suspicious?" /><div className="space-y-4 text-sm leading-6 text-mist"><p><b className="text-emerald-300">Why trusted:</b> {positive.map((event) => `${event.label} (${event.impact > 0 ? "+" : ""}${event.impact})`).join(", ") || "No positive factors"}.</p><p><b className="text-red-300">Why suspicious:</b> {negative.map((event) => `${event.label} (${event.impact})`).join(", ") || "No negative factors"}.</p><p><b className="text-gold">Why score was reduced:</b> {integrity.negativeFactors.join("; ") || "No material negative signal"}.</p><p><b className="text-cyan">Recommended action:</b> {threat.recommendedAction}</p></div></section></div><section className="glass mt-6 p-6"><SectionHeading eyebrow="Score impact" title="Positive and negative factors" /><div className="grid gap-4 md:grid-cols-3"><div><h3 className="text-sm font-semibold text-emerald-300">Positive factors</h3><ul className="mt-3 space-y-2 text-xs text-mist">{positive.map((event) => <li key={event.label}>+ {event.label}: {event.impact}</li>)}</ul></div><div><h3 className="text-sm font-semibold text-red-300">Negative factors</h3><ul className="mt-3 space-y-2 text-xs text-mist">{negative.length ? negative.map((event) => <li key={event.label}>− {event.label}: {event.impact}</li>) : <li>No negative factors</li>}</ul></div><div><h3 className="text-sm font-semibold text-cyan">Current outputs</h3><p className="mt-3 text-xs leading-6 text-mist">Integrity {integrity.score}/100 · Identity {identity.confidencePercentage}/100 · Threat confidence {threat.threatConfidence}/100 · Trust {trust.trustScore}/100.</p></div></div></section></AppShell>;
}
