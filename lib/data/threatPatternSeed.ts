export const threatPatternSeed=[
{title:"Stolen tag replay signature",type:"Simulated intelligence pattern",severity:"High",signals:["Repeated RFID seen after bag exit","QR token scanned from unexpected zone","Passenger claim window mismatch"],action:"Force identity rebind and supervisor hold."},
{title:"Bag substitution window",type:"Simulated intelligence pattern",severity:"Critical",signals:["Visual fingerprint drift","Weight delta above route baseline","Custody handoff gap"],action:"Secondary physical reconciliation before loading."},
{title:"Repeated custody gap cluster",type:"Simulated intelligence pattern",severity:"Elevated",signals:["Same checkpoint delay pattern","Handler roster mismatch","No ledger evidence in dwell window"],action:"Increase scan frequency and audit assigned team."},
{title:"High-risk movement signal",type:"Simulated intelligence pattern",severity:"Monitor",signals:["Weather diversion pressure","Corridor congestion","Late aircraft swap"],action:"Attach public-data context to risk review."}
];
