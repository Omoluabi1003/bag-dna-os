import { publicDatasetCatalog } from "@/lib/data/publicDatasetCatalog";

export async function getawsOpenDataIntelligence() {
  const source = publicDatasetCatalog.find((item) => item.id === "aws") ?? publicDatasetCatalog[0];
  return {
    source,
    loadingLabel: "Checking public intelligence availability",
    degradedLabel: "Showing continuity-safe fallback intelligence",
    userExplanation: source.explanation,
    records: [source],
  };
}
