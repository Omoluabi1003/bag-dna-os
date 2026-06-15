import { ledgerRecords } from "@/lib/data/ledger";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
export function LedgerTable(){return <DataTable rows={ledgerRecords} columns={[{key:"id",label:"Event ID"},{key:"bagId",label:"BAG-DNA ID"},{key:"action",label:"Action"},{key:"timestamp",label:"Timestamp"},{key:"location",label:"Location"},{key:"actor",label:"Actor"},{key:"current",label:"Current hash"},{key:"status",label:"Integrity",render:r=><StatusBadge tone={r.status==="Verified"?"emerald":"amber"}>{r.status}</StatusBadge>}]}/>}
