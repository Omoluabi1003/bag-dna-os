"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, ChevronDown, CircleHelp, Menu, Search, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";
import { navItems } from "@/lib/data";

export function AppShell({ children, title, eyebrow = "Hartsfield-Jackson Atlanta International" }: {
  children: React.ReactNode; title: string; eyebrow?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink">
      <aside className={`fixed inset-y-0 left-0 z-50 w-[272px] border-r border-white/[.08] bg-[#081927]/90 p-5 shadow-2xl backdrop-blur-2xl transition-transform lg:translate-x-0 lg:shadow-none ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between">
          <Logo />
          <button className="text-mist lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={20}/></button>
        </div>
        <div className="mt-9 flex items-center gap-3 rounded-2xl border border-white/[.08] bg-white/[.04] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,.04)]">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gold/10 text-gold"><ShieldCheck size={16}/></div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold text-ivory">ATL Command</p>
            <p className="text-[9px] text-mist">Enterprise environment</p>
          </div>
          <ChevronDown size={13} className="text-mist"/>
        </div>
        <p className="mb-3 mt-8 text-[9px] font-bold uppercase tracking-[.2em] text-mist/60">Mission control</p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-medium transition ${pathname === item.href ? "bg-white/[.08] text-ivory shadow-[inset_0_1px_0_rgba(255,255,255,.05)]" : "text-mist hover:bg-white/[.04] hover:text-ivory"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${pathname === item.href ? "bg-cyan shadow-[0_0_8px_#6ed8e0]" : "bg-slate-600"}`}/>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 border-t border-white/[.07] pt-4">
          <Link href="/about" className="flex items-center gap-3 text-[11px] text-mist hover:text-ivory"><CircleHelp size={15}/> About ETL GIS</Link>
          <div className="mt-4 flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-cyan/10 text-[10px] font-bold text-cyan">AO</div>
            <div><p className="text-[11px] font-bold">A. Okon</p><p className="text-[9px] text-mist">Security operator</p></div>
          </div>
        </div>
      </aside>
      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-40 flex h-[76px] items-center justify-between border-b border-white/[.07] bg-ink/75 px-5 backdrop-blur-2xl md:px-10">
          <div className="flex items-center gap-3">
            <button className="text-mist lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={20}/></button>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[.14em] text-gold">{eyebrow}</p>
              <h1 className="mt-1 font-display text-[17px] font-semibold tracking-[-.01em] text-ivory">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden h-10 items-center gap-2 rounded-xl border border-white/[.08] bg-white/[.04] px-3.5 text-[11px] text-mist transition hover:bg-white/[.07] md:flex"><Search size={14}/> Search assets <kbd className="ml-3 text-[9px]">⌘ K</kbd></button>
            <button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[.08] bg-white/[.025] text-mist transition hover:bg-white/[.06]"><Bell size={15}/><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-red-400"/></button>
            <div className="hidden items-center gap-2 px-2 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/><span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">Systems nominal</span></div>
          </div>
        </header>
        <main className="min-h-[calc(100vh-76px)] p-5 md:p-10">{children}</main>
      </div>
    </div>
  );
}
