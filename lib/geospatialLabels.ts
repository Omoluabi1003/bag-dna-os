export type MapLabel = {
  name: string;
  abbreviation?: string;
  latitude: number;
  longitude: number;
  priority: number;
};

export const stateLabels: MapLabel[] = [
  { name: "Florida", abbreviation: "FL", latitude: 28.15, longitude: -82.25, priority: 100 },
  { name: "Georgia", abbreviation: "GA", latitude: 32.65, longitude: -83.45, priority: 100 },
];

export const placeLabels: MapLabel[] = [
  { name: "Miami", latitude: 25.7617, longitude: -80.1918, priority: 96 },
  { name: "Fort Lauderdale", latitude: 26.1224, longitude: -80.1373, priority: 82 },
  { name: "West Palm Beach", latitude: 26.7153, longitude: -80.0534, priority: 78 },
  { name: "Orlando", latitude: 28.5383, longitude: -81.3792, priority: 88 },
  { name: "Jacksonville", latitude: 30.3322, longitude: -81.6557, priority: 84 },
  { name: "Valdosta", latitude: 30.8327, longitude: -83.2785, priority: 86 },
  { name: "Atlanta", latitude: 33.749, longitude: -84.388, priority: 98 },
];

export const countyLabels: MapLabel[] = [
  { name: "Miami-Dade", latitude: 25.61, longitude: -80.50, priority: 100 },
  { name: "Broward", latitude: 26.15, longitude: -80.49, priority: 96 },
  { name: "Palm Beach", latitude: 26.65, longitude: -80.45, priority: 94 },
  { name: "Orange", latitude: 28.48, longitude: -81.32, priority: 86 },
  { name: "Duval", latitude: 30.33, longitude: -81.66, priority: 84 },
  { name: "Lowndes", latitude: 30.84, longitude: -83.27, priority: 92 },
  { name: "Clayton", latitude: 33.54, longitude: -84.36, priority: 94 },
  { name: "Fulton", latitude: 33.79, longitude: -84.47, priority: 98 },
  { name: "Alachua", latitude: 29.68, longitude: -82.36, priority: 72 },
  { name: "Columbia", latitude: 30.22, longitude: -82.62, priority: 74 },
  { name: "Echols", latitude: 30.71, longitude: -82.90, priority: 78 },
  { name: "Tift", latitude: 31.46, longitude: -83.53, priority: 76 },
  { name: "Crisp", latitude: 31.92, longitude: -83.77, priority: 74 },
  { name: "Houston", latitude: 32.46, longitude: -83.67, priority: 76 },
  { name: "Henry", latitude: 33.45, longitude: -84.15, priority: 80 },
];
