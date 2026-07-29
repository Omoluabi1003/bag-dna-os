import { download } from "./csv";
export function exportEvidence(filename: string, evidence: unknown) { download(filename, "application/json", JSON.stringify(evidence, null, 2)); }
