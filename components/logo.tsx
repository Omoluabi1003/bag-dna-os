import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="BAG-DNA OS home">
      <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[13px] bg-[#0C1A2A] shadow-[0_0_0_1px_rgba(148,163,184,.28),0_5px_16px_rgba(0,0,0,.18)] transition group-hover:scale-[1.03]">
        <Image
          src="/bag-dna-logo.png"
          alt=""
          width={40}
          height={40}
          className="h-full w-full object-contain"
          priority
        />
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
