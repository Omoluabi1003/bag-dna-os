import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="relative grid h-9 w-9 place-items-center border border-gold/60 bg-gold/5 text-sm font-bold text-gold">
        B
        <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-cyan" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[15px] font-bold tracking-[.18em] text-ivory">BAG-DNA</span>
          <span className="mt-1 block text-[8px] font-bold tracking-[.3em] text-mist">OPERATING SYSTEM</span>
        </span>
      )}
    </Link>
  );
}
