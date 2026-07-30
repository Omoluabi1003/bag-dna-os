export interface CoreConfig {
  readonly nodeEnv: "development" | "test" | "production";
  readonly appVersion: string;
  readonly telemetryEnabled: boolean;
}

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
};

export const loadCoreConfig = (
  environment: Readonly<Record<string, string | undefined>> = process.env,
): CoreConfig => {
  const nodeEnv = environment.NODE_ENV ?? "development";

  if (!(["development", "test", "production"] as const).includes(nodeEnv as CoreConfig["nodeEnv"])) {
    throw new Error(`Unsupported NODE_ENV '${nodeEnv}'.`);
  }

  return {
    nodeEnv: nodeEnv as CoreConfig["nodeEnv"],
    appVersion: environment.NEXT_PUBLIC_APP_VERSION ?? "0.1.0",
    telemetryEnabled: parseBoolean(environment.TELEMETRY_ENABLED, true),
  };
};
