import type { ThreatGraphOutput } from "@/lib/intelligence";
export function ThreatGraphView({ threat }: { threat: ThreatGraphOutput }) {
  const matches = threat.matchedThreats?.length ? threat.matchedThreats : [{ id: "None", name: "No threat signature", confidence: 0, severity: "Clear" }];
  const evidence = threat.evidence?.length ? threat.evidence : ["No evidence"];
  return <div className="glass p-5"><p className="text-[10px] uppercase tracking-widest text-gold">Threat Graph</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{matches.map((t) => <div key={t.id} className="rounded-2xl border border-red-400/20 bg-red-400/[.06] p-4"><b className="text-red-200">{t.id}</b><p className="mt-2 text-sm text-white">{t.name}</p><p className="mt-1 text-xs text-mist">{t.confidence}% · {t.severity}</p></div>)}</div><ul className="mt-4 space-y-2 text-xs text-mist">{evidence.map((e) => <li key={e}>• {e}</li>)}</ul></div>;
}
