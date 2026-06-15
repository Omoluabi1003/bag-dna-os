export type Column<T>={key:keyof T;label:string;render?:(row:T)=>React.ReactNode};
export function DataTable<T extends {id?:string}>({columns,rows}:{columns:Column<T>[];rows:T[]}) {
 return <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-mist">{columns.map(c=><th className="pb-3 pr-4" key={String(c.key)}>{c.label}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr className="border-b border-white/[.05] text-[11px]" key={r.id??i}>{columns.map(c=><td className="py-4 pr-4" key={String(c.key)}>{c.render?c.render(r):String(r[c.key])}</td>)}</tr>)}</tbody></table></div>;
}
