export type DemoAirport = { code: "MIA" | "FLL" | "ATL"; icao: string; name: string; latitude: number; longitude: number; zone: string };

export const demoAirports: DemoAirport[] = [
  { code: "MIA", icao: "KMIA", name: "Miami International Airport", latitude: 25.7959, longitude: -80.287, zone: "South Terminal" },
  { code: "FLL", icao: "KFLL", name: "Fort Lauderdale–Hollywood International", latitude: 26.0726, longitude: -80.1527, zone: "Terminal 3" },
  { code: "ATL", icao: "KATL", name: "Hartsfield–Jackson Atlanta International", latitude: 33.6407, longitude: -84.4277, zone: "Concourse E" },
];
