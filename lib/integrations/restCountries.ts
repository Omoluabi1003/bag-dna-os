import { withFallback, type IntegrationResult } from "./types";

export interface CountryContext {
  code: string;
  name: string;
  region: string;
  flag: string;
}

export const mockCountries: CountryContext[] = [
  { code: "NG", name: "Nigeria", region: "Africa", flag: "🇳🇬" },
  { code: "GB", name: "United Kingdom", region: "Europe", flag: "🇬🇧" },
  { code: "AE", name: "United Arab Emirates", region: "Asia", flag: "🇦🇪" },
];

export async function getCorridorCountries(): Promise<IntegrationResult<CountryContext[]>> {
  return withFallback("REST Countries", async () => {
    const response = await fetch("https://restcountries.com/v3.1/alpha?codes=ng,gb,ae&fields=cca2,name,region,flag", {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("REST Countries request failed");
    const payload = await response.json() as Array<{ cca2: string; name: { common: string }; region: string; flag: string }>;
    return payload.map((country) => ({ code: country.cca2, name: country.name.common, region: country.region, flag: country.flag }));
  }, mockCountries);
}
