import { Badge, StatusDot } from "@/components/ui";
export function StatusBadge({ children, tone="emerald" }:{children:React.ReactNode;tone?:string}) {
  return <Badge tone={tone}><StatusDot tone={tone}/>{children}</Badge>;
}
