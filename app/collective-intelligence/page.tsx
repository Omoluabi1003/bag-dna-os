import Link from "next/link";
import { AppShell } from "@/components/shell";
import { Badge, SectionHeading } from "@/components/ui";
import { buildCollectiveIntelligence } from "@/lib/intelligence";
import { CollectiveNetworkView } from "@/components/intelligence/CollectiveNetworkView";

export default function Page() {
  const data = buildCollectiveIntelligence();
  return (
    <AppShell title="Collective Intelligence Network™" eyebrow="Intelligence Flow · airport-to-airport sharing">
      <section className="mb-6 rounded-[28px] border border-white/[.08] bg-white/[.035] p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.22em] text-gold">Operational Preview</p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-[-.03em] text-ivory">Anonymized airport-to-airport intelligence propagates alerts without exposing passenger identity.</h2>
          </div>
          <Badge tone="emerald">Seeded Intelligence</Badge>
        </div>
      </section>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <CollectiveNetworkView network={data} />
        <section className="glass p-5">
          <SectionHeading eyebrow="Workflow" title="What operators do next" />
          <div className="space-y-3 text-xs leading-6 text-mist">
            <p>1. Confirm the score explanation and evidence signals.</p>
            <p>2. Compare the recommendation against custody, passenger, and checkpoint context.</p>
            <p>3. Promote the decision into the connected BAG-DNA workflow.</p>
          </div>
          <Link href="/airport-reputation" className="mt-5 inline-flex rounded-xl bg-cyan px-4 py-3 text-xs font-black text-ink">Rank airport reputation →</Link>
        </section>
      </div>
      <footer className="mt-7 rounded-2xl border border-white/[.08] bg-white/[.025] p-5 text-xs text-mist">Readiness Layer: this page is wired to the intelligence engines and can accept live airport, airline, and insurer data feeds.</footer>
    </AppShell>
  );
}
