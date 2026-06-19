import { publicDatasetCatalog } from "@/lib/data/publicDatasetCatalog";

export async function getimfDataIntelligence() {
  const source = publicDatasetCatalog.find((item) => item.id === "imf") ?? publicDatasetCatalog[0];
  return {
    source,
    loadingLabel: "Checking public intelligence availability",
    degradedLabel: "Showing continuity-safe fallback intelligence",
    userExplanation: source.explanation,
    records: [source],
  };
}
