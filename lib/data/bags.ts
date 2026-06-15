export type RiskBand = "Low" | "Monitor" | "Elevated" | "High" | "Critical";
export type Bag = {
  id: string; passengerRef: string; passenger: string; flight: string; origin: string;
  destination: string; stage: string; weight: string; dimensions: string; visualScore: number;
  rfid: string; seal: string; risk: number; verification: string; location: string; updated: string;
};

export const bagRecords: Bag[] = [
  { id:"BD-7A92-1184", passengerRef:"PNR •••8K2", passenger:"Amara Okafor", flight:"DL 184", origin:"ATL", destination:"LHR", stage:"Aircraft loaded", weight:"18.4 kg · match", dimensions:"68×44×27 cm", visualScore:98.7, rfid:"Online", seal:"Intact", risk:12, verification:"Verified", location:"Gate F12 · Hold 4", updated:"17:02:41 UTC" },
  { id:"BD-8C11-4072", passengerRef:"PNR •••2Q9", passenger:"Liam Chen", flight:"BA 226", origin:"ATL", destination:"LHR", stage:"Security screening", weight:"22.1 kg · +0.2", dimensions:"72×48×29 cm", visualScore:93.2, rfid:"Online", seal:"Intact", risk:68, verification:"Review", location:"CBRA-04", updated:"16:58:17 UTC" },
  { id:"BD-2F68-9351", passengerRef:"PNR •••4M7", passenger:"Sofia Martins", flight:"KL 622", origin:"ATL", destination:"AMS", stage:"Sorting hub", weight:"16.8 kg · match", dimensions:"64×42×25 cm", visualScore:97.4, rfid:"Online", seal:"Intact", risk:24, verification:"Verified", location:"Pier F · J-19", updated:"16:56:02 UTC" },
  { id:"BD-5D04-6209", passengerRef:"PNR •••9A1", passenger:"Noah Williams", flight:"AF 031", origin:"ATL", destination:"CDG", stage:"Exception review", weight:"25.6 kg · +3.8", dimensions:"76×51×31 cm", visualScore:61.3, rfid:"Mismatch", seal:"Broken", risk:91, verification:"Hold", location:"Secure Hold E-7", updated:"17:01:08 UTC" },
  { id:"BD-1B77-4438", passengerRef:"PNR •••6L5", passenger:"Elena Rossi", flight:"UA 883", origin:"ATL", destination:"FRA", stage:"Loading bay", weight:"19.2 kg · match", dimensions:"69×46×28 cm", visualScore:96.8, rfid:"Online", seal:"Intact", risk:31, verification:"Verified", location:"Gate F03", updated:"16:53:44 UTC" },
];

export const visualFingerprint = [
  ["Color","Midnight graphite"],["Size class","Large cabin"],["Shape","Hard-shell rectangular"],
  ["Brand indicators","Embossed vertical mark"],["Scratches","Upper-left 42 mm"],["Stickers","Gold circular · rear"],
  ["Dents","Lower-right shallow"],["Handle type","Twin telescopic"],["Wheel style","Eight-wheel spinner"],["Unique markings","Ivory strap / blue stitch"],
];
