import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="relative grid h-10 w-10 place-items-center rounded-[13px] border border-white/10 bg-white/[.07] text-sm font-semibold text-ivory shadow-[inset_0_1px_0_rgba(255,255,255,.08)] transition group-hover:bg-white/[.11]">
        BD
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-cyan shadow-[0_0_12px_rgba(110,216,224,.8)]" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[15px] font-semibold tracking-[.08em] text-ivory">BAG-DNA</span>
          <span className="mt-1.5 block text-[8px] font-semibold tracking-[.24em] text-mist">OPERATING SYSTEM</span>
        </span>
      )}
    </Link>
  );
}
