"use client";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
export function NavBar({ onMenu }: { onMenu?:()=>void }) {
  return <header className="flex h-16 items-center justify-between border-b border-white/10 bg-ink/90 px-5 backdrop-blur-xl">
    <button onClick={onMenu} className="text-mist lg:hidden" aria-label="Open navigation"><Menu size={20}/></button>
    <Logo/><Link href="/dashboard" className="text-[10px] font-bold uppercase tracking-widest text-gold">Command center →</Link>
  </header>;
}
