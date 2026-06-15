"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton({ fallback = "/dashboard" }: { fallback?: string }) {
  const router = useRouter();
  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push(fallback);
  }
  return <button type="button" onClick={goBack} aria-label="Back to Dashboard" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/[.05] px-3.5 text-[11px] font-semibold text-slate-200 transition hover:border-cyan/40 hover:bg-white/[.09] hover:text-white"><ArrowLeft size={14}/> Back to Dashboard</button>;
}
