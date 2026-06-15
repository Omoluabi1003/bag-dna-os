export type EvidenceInput = { id:string; bagId:string; action:string; timestamp:string; location:string; actor:string };
const hash = (value:string) => Array.from(value).reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0,0).toString(16).padStart(8,"0");
export function appendEvidence(previousHash:string, event:EvidenceInput) {
  const currentHash = hash(`${previousHash}|${JSON.stringify(event)}`);
  return { ...event, previousHash, currentHash, verificationStatus:"Verified" as const };
}
export function verifyEvidenceChain(records:{previousHash:string; currentHash:string}[]) {
  return records.every((record,index)=>index === 0 || record.previousHash === records[index-1].currentHash);
}
export function generateInvestigationPackage<T extends { bagDnaId: string; ledger: unknown[]; custodyEvents: unknown[] }>(record: T) {
  return { packageId: `EVID-${record.bagDnaId}-${Date.now()}`, generatedAt: new Date().toISOString(), bagDnaId: record.bagDnaId, custodyChain: record.custodyEvents, ledger: record.ledger, chainVerified: verifyEvidenceChain(record.ledger as {previousHash:string;currentHash:string}[]) };
}
