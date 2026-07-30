export type Airport = Readonly<{
  iataCode: string;
  icaoCode: string;
  officialName: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}>;

// Broad country envelopes make an otherwise numerically valid lat/lon swap
// detectable without replacing airport positions with city centroids.
const COUNTRY_BOUNDS: Record<string, readonly [number, number, number, number]> = {
  "United States": [18, 72, -180, -60], "United Kingdom": [49, 61, -9, 2],
  Germany: [47, 56, 5, 16], Japan: [24, 46, 122, 154], Mexico: [14, 33, -119, -86],
  Canada: [41, 84, -141, -52], "United Arab Emirates": [22, 27, 51, 57], Qatar: [24, 27, 50, 52],
  Nigeria: [4, 14, 2, 15], "South Africa": [-35, -22, 16, 33], Singapore: [1, 2, 103, 105],
  Australia: [-44, -10, 112, 154], Brazil: [-34, 6, -74, -34],
};

export function validateAirportCoordinates(airport: Pick<Airport, "iataCode" | "country" | "latitude" | "longitude">) {
  const { latitude, longitude } = airport;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new Error(`${airport.iataCode}: missing airport coordinates`);
  if (latitude < -90 || latitude > 90) throw new Error(`${airport.iataCode}: latitude must be between -90 and 90`);
  if (longitude < -180 || longitude > 180) throw new Error(`${airport.iataCode}: longitude must be between -180 and 180`);
  const bounds = COUNTRY_BOUNDS[airport.country];
  if (bounds && (latitude < bounds[0] || latitude > bounds[1] || longitude < bounds[2] || longitude > bounds[3])) {
    throw new Error(`${airport.iataCode}: coordinates are outside ${airport.country}; latitude/longitude may be swapped`);
  }
  return { latitude, longitude } as const;
}

function airport(record: Airport): Airport {
  if (!/^[A-Z]{3}$/.test(record.iataCode) || !/^[A-Z0-9]{4}$/.test(record.icaoCode)) throw new Error(`Invalid airport code for ${record.officialName}`);
  validateAirportCoordinates(record);
  return Object.freeze(record);
}

const records = [
  ["MIA","KMIA","Miami International Airport","Miami","United States",25.7959,-80.2870], ["FLL","KFLL","Fort Lauderdale–Hollywood International Airport","Fort Lauderdale","United States",26.0726,-80.1527],
  ["ATL","KATL","Hartsfield–Jackson Atlanta International Airport","Atlanta","United States",33.6407,-84.4277], ["JFK","KJFK","John F. Kennedy International Airport","New York","United States",40.6413,-73.7781],
  ["LAX","KLAX","Los Angeles International Airport","Los Angeles","United States",33.9416,-118.4085], ["ORD","KORD","O'Hare International Airport","Chicago","United States",41.9742,-87.9073],
  ["DFW","KDFW","Dallas Fort Worth International Airport","Dallas–Fort Worth","United States",32.8998,-97.0403], ["LHR","EGLL","Heathrow Airport","London","United Kingdom",51.4700,-0.4543],
  ["FRA","EDDF","Frankfurt Airport","Frankfurt","Germany",50.0379,8.5622], ["NRT","RJAA","Narita International Airport","Tokyo","Japan",35.7720,140.3929],
  ["MEX","MMMX","Mexico City International Airport","Mexico City","Mexico",19.4361,-99.0719], ["YYZ","CYYZ","Toronto Pearson International Airport","Toronto","Canada",43.6777,-79.6248],
  ["DXB","OMDB","Dubai International Airport","Dubai","United Arab Emirates",25.2532,55.3657], ["DOH","OTHH","Hamad International Airport","Doha","Qatar",25.2731,51.6081],
  ["LOS","DNMM","Murtala Muhammed International Airport","Lagos","Nigeria",6.5774,3.3212], ["JNB","FAOR","O. R. Tambo International Airport","Johannesburg","South Africa",-26.1337,28.2420],
  ["SIN","WSSS","Singapore Changi Airport","Singapore","Singapore",1.3644,103.9915], ["SYD","YSSY","Sydney Airport","Sydney","Australia",-33.9399,151.1753],
  ["GRU","SBGR","São Paulo/Guarulhos International Airport","São Paulo","Brazil",-23.4356,-46.4731],
] as const;

export const airportRegistry: Readonly<Record<string, Airport>> = Object.freeze(Object.fromEntries(records.map(([iataCode, icaoCode, officialName, city, country, latitude, longitude]) => {
  const value = airport({ iataCode, icaoCode, officialName, city, country, latitude, longitude });
  return [iataCode, value];
})));

export function getAirportByCode(code: string): Airport | undefined {
  return airportRegistry[code.trim().toUpperCase()];
}
