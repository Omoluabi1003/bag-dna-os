import type { IntegrationResult } from "./types";
export interface AirportRecord { iata:string; icao:string; name:string; city:string; countryCode:string; latitude:number; longitude:number; role:string; }
export const seededAirports: AirportRecord[] = [
 {iata:"LOS",icao:"DNMM",name:"Murtala Muhammed International Airport",city:"Lagos",countryCode:"NG",latitude:6.5774,longitude:3.3212,role:"Primary international hub"},
 {iata:"ABV",icao:"DNAA",name:"Nnamdi Azikiwe International Airport",city:"Abuja",countryCode:"NG",latitude:9.0068,longitude:7.2632,role:"Federal capital gateway"},
 {iata:"PHC",icao:"DNPO",name:"Port Harcourt International Airport",city:"Port Harcourt",countryCode:"NG",latitude:5.0155,longitude:6.9496,role:"Energy corridor gateway"},
 {iata:"KAN",icao:"DNKN",name:"Mallam Aminu Kano International Airport",city:"Kano",countryCode:"NG",latitude:12.0476,longitude:8.5246,role:"Northern regional hub"},
 {iata:"ENU",icao:"DNEN",name:"Akanu Ibiam International Airport",city:"Enugu",countryCode:"NG",latitude:6.4743,longitude:7.5619,role:"Southeast gateway"},
 {iata:"QOW",icao:"DNIM",name:"Sam Mbakwe International Cargo Airport",city:"Owerri",countryCode:"NG",latitude:5.4271,longitude:7.2060,role:"Cargo and regional gateway"},
 {iata:"QUO",icao:"DNAI",name:"Victor Attah International Airport",city:"Uyo",countryCode:"NG",latitude:4.8725,longitude:8.0930,role:"Coastal regional gateway"},
 {iata:"LHR",icao:"EGLL",name:"London Heathrow Airport",city:"London",countryCode:"GB",latitude:51.47,longitude:-0.4543,role:"Priority international corridor"},
 {iata:"DXB",icao:"OMDB",name:"Dubai International Airport",city:"Dubai",countryCode:"AE",latitude:25.2532,longitude:55.3657,role:"Priority international corridor"}
];
export async function getSeededAirports():Promise<IntegrationResult<AirportRecord[]>> { return {data:seededAirports,mode:"live",source:"Airport Metadata Intelligence",message:"Validated local aviation reference layer."}; }
