import Link from "next/link";
import { navItems } from "@/lib/data";
export function Sidebar() {
  return <aside className="w-64 border-r border-white/10 bg-[#081927] p-5"><p className="mb-5 text-[9px] font-bold uppercase tracking-widest text-gold">Mission control</p>
    <nav className="space-y-1">{navItems.map(x=><Link className="block border-l-2 border-transparent px-3 py-2 text-xs text-mist hover:border-gold hover:text-ivory" key={x.href} href={x.href}>{x.label}</Link>)}</nav>
  </aside>;
}
