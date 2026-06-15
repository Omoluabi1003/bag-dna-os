import { Badge } from "@/components/ui";
export function RiskBadge({ score }:{score:number}) {
  const label=score>=80?"Critical":score>=60?"High":score>=40?"Elevated":score>=20?"Monitor":"Low";
  return <Badge tone={score>=80?"red":score>=40?"amber":"emerald"}>{label} · {score}</Badge>;
}
