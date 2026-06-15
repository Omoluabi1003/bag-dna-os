export type DataMode = "live" | "mock" | "degraded";

export interface IntegrationResult<T> {
  data: T;
  mode: DataMode;
  source: string;
  message?: string;
}

export async function withFallback<T>(
  source: string,
  request: () => Promise<T>,
  fallback: T,
): Promise<IntegrationResult<T>> {
  try {
    return { data: await request(), mode: "live", source };
  } catch {
    return {
      data: fallback,
      mode: "degraded",
      source,
      message: "Live service unavailable; deterministic beta data is shown.",
    };
  }
}
