import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function StatusDot({ tone = "emerald" }: { tone?: string }) {
  const tones: Record<string, string> = {
    emerald: "bg-emerald-400", amber: "bg-amber-400", red: "bg-red-400",
    cyan: "bg-cyan", blue: "bg-blue-400", slate: "bg-slate-400",
  };
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${tones[tone] || tones.slate}`} />;
}

export function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    amber: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    red: "border-red-400/20 bg-red-400/10 text-red-300",
    cyan: "border-cyan/20 bg-cyan/10 text-cyan",
    blue: "border-blue-400/20 bg-blue-400/10 text-blue-300",
    slate: "border-white/10 bg-white/5 text-mist",
  };
  return <span className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[10px] font-bold uppercase tracking-[.12em] ${tones[tone] || tones.slate}`}>{children}</span>;
}

export function MetricCard({ label, value, change, icon: Icon, detail }: {
  label: string; value: string; change?: string; icon: LucideIcon; detail?: string;
}) {
  const positive = !change?.startsWith("−");
  return (
    <div className="glass relative overflow-hidden p-5">
      <div className="absolute right-0 top-0 h-20 w-20 bg-cyan/[.03]" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-mist">{label}</p>
          <p className="mt-3 font-display text-3xl font-semibold text-ivory">{value}</p>
        </div>
        <div className="grid h-9 w-9 place-items-center border border-white/10 bg-white/[.03] text-cyan"><Icon size={16} /></div>
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px]">
        {change && <span className={positive ? "text-emerald-300" : "text-red-300"}>{positive ? <ArrowUpRight className="inline" size={12}/> : <ArrowDownRight className="inline" size={12}/>} {change}</span>}
        <span className="text-mist">{detail}</span>
      </div>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 text-[9px] font-bold uppercase tracking-[.22em] text-gold">{eyebrow}</p>}
        <h2 className="font-display text-xl font-semibold text-ivory">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Progress({ value, tone = "cyan" }: { value: number; tone?: string }) {
  const colors: Record<string, string> = { cyan: "bg-cyan", gold: "bg-gold", red: "bg-red-400", emerald: "bg-emerald-400", amber: "bg-amber-400" };
  return <div className="h-1 w-full bg-white/10"><div className={`h-full ${colors[tone] || colors.cyan}`} style={{ width: `${value}%` }} /></div>;
}
