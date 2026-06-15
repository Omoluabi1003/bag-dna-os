import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return (
    <Link href="/" className="group flex min-w-0 items-center gap-3.5" aria-label="BAG-DNA OS home">
      <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/15 bg-white/[.08] p-1 shadow-[0_8px_24px_rgba(0,0,0,.2),inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-xl transition duration-300 group-hover:scale-[1.03] group-hover:bg-white/[.11] md:h-12 md:w-12">
        <Image
          src={`${basePath}/bag-dna-logo.png`}
          alt="BAG-DNA OS logo"
          width={48}
          height={48}
          className="h-full w-full object-contain"
          priority
        />
      </span>
      {!compact && (
        <span className="min-w-0 whitespace-nowrap leading-none">
          <span className="block font-display text-[15px] font-semibold tracking-[.08em] text-ivory md:text-base">BAG-DNA</span>
          <span className="mt-1.5 block text-[7px] font-semibold tracking-[.2em] text-mist sm:text-[8px] sm:tracking-[.24em]">OPERATING SYSTEM</span>
        </span>
      )}
    </Link>
  );
}
