import { publicDatasetCatalog } from "@/lib/data/publicDatasetCatalog";
export async function getOpenDataCatalog() {
  return { loading: false, degraded: true, explanation: "Live public data is attempted only where supported; fallback intelligence keeps the operator view complete.", sources: publicDatasetCatalog };
}
