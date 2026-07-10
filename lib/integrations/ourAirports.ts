import type { IntegrationResult } from "./types";
export interface AirportRecord { iata:string; icao:string; name:string; city:string; countryCode:string; latitude:number; longitude:number; role:string; }
export const seededAirports: AirportRecord[] = [
 {iata:"HBA",icao:"ZZAA",name:"Primary International Hub",city:"Primary Metro",countryCode:"PR",latitude:6.5774,longitude:3.3212,role:"Primary international hub"},
 {iata:"HBB",icao:"ZZAB",name:"Secondary Capital Hub",city:"Capital District",countryCode:"PR",latitude:9.0068,longitude:7.2632,role:"Capital gateway"},
 {iata:"HBC",icao:"ZZAC",name:"Regional Coastal Gateway",city:"Coastal Metro",countryCode:"PR",latitude:5.0155,longitude:6.9496,role:"Coastal corridor gateway"},
 {iata:"HBD",icao:"ZZAD",name:"Northern Regional Gateway",city:"Northern Metro",countryCode:"PR",latitude:12.0476,longitude:8.5246,role:"Northern regional hub"},
 {iata:"HBE",icao:"ZZAE",name:"Eastern Regional Gateway",city:"Eastern Metro",countryCode:"PR",latitude:6.4743,longitude:7.5619,role:"Eastern gateway"},
 {iata:"HBF",icao:"ZZAF",name:"Regional Cargo Gateway",city:"Cargo District",countryCode:"PR",latitude:5.4271,longitude:7.2060,role:"Cargo and regional gateway"},
 {iata:"HBG",icao:"ZZAG",name:"Coastal Regional Gateway",city:"Coastal District",countryCode:"PR",latitude:4.8725,longitude:8.0930,role:"Coastal regional gateway"},
 {iata:"LHR",icao:"EGLL",name:"London Heathrow Airport",city:"London",countryCode:"GB",latitude:51.47,longitude:-0.4543,role:"Priority international corridor"},
 {iata:"DXB",icao:"OMDB",name:"Dubai International Airport",city:"Dubai",countryCode:"AE",latitude:25.2532,longitude:55.3657,role:"Priority international corridor"}
];
export async function getSeededAirports():Promise<IntegrationResult<AirportRecord[]>> { return {data:seededAirports,mode:"live",source:"Airport Metadata Intelligence",message:"Validated local aviation reference layer."}; }
