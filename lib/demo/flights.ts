export type DemoFlight = { id: string; origin: string; destination: string; departure: string; gate: string };
export const demoFlights: DemoFlight[] = [
  { id: "BD2184", origin: "MIA", destination: "ATL", departure: "14:25Z", gate: "D32" },
  { id: "BD410", origin: "FLL", destination: "ATL", departure: "15:10Z", gate: "E7" },
  { id: "BD991", origin: "ATL", destination: "MIA", departure: "16:40Z", gate: "E12" },
  { id: "BD622", origin: "MIA", destination: "FLL", departure: "17:05Z", gate: "D18" },
];
