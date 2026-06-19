import { Badge, Progress } from "@/components/ui";
export function IntelligenceScoreCard({ title, score, band, explanation, action }: { title: string; score?: number | string | null; band: string; explanation?: string; action?: string }) {
  const parsed = typeof score === "number" ? score : Number.parseFloat(String(score ?? 0));
  const n = Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : 0;
  return <article className="glass p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-gold">{title}</p><h3 className="mt-2 text-4xl font-semibold text-ivory">{n}<span className="text-sm text-mist"> / 100</span></h3></div><Badge tone={n >= 95 ? "emerald" : n >= 85 ? "cyan" : n >= 70 ? "amber" : "red"}>{band}</Badge></div><div className="mt-4"><Progress value={n} tone={n >= 90 ? "emerald" : n >= 70 ? "amber" : "red"} /></div><p className="mt-4 text-xs leading-5 text-mist">{explanation ?? "No evidence"}</p><p className="mt-4 rounded-2xl border border-cyan/20 bg-cyan/[.06] p-3 text-xs leading-5 text-cyan">{action ?? "Monitor"}</p></article>;
}
