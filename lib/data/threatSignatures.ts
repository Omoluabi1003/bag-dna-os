export const threatSignatures = [
 {id:"TS-019", name:"stolen tag reuse", severity:"high", indicators:["tag seen twice","route inconsistency","RFID age anomaly"]},
 {id:"TS-022", name:"paper tag cloning", severity:"medium", indicators:["QR reused","print sequence mismatch"]},
 {id:"TS-031", name:"RFID and QR mismatch", severity:"critical", indicators:["rfid mismatch","qr valid"]},
 {id:"TS-044", name:"NFC and encrypted token mismatch", severity:"critical", indicators:["nfc mismatch","token mismatch"]},
 {id:"TS-057", name:"baggage substitution", severity:"critical", indicators:["visual mismatch","weight mismatch","seal break"]},
 {id:"TS-063", name:"drug insertion risk pattern", severity:"high", indicators:["unauthorized seal break","custody gap","weight increase"]},
 {id:"TS-071", name:"unauthorized seal break", severity:"high", indicators:["seal break outside inspection"]},
 {id:"TS-088", name:"custody blackout gap", severity:"high", indicators:["scan gap","checkpoint missed"]},
 {id:"TS-094", name:"repeated handler anomaly", severity:"medium", indicators:["staff zone mismatch","repeat actor"]},
 {id:"TS-105", name:"high-risk corridor transfer pattern", severity:"medium", indicators:["corridor watch","weather pressure"]},
 {id:"TS-118", name:"claim dispute anomaly", severity:"medium", indicators:["claim mismatch","late scan"]}
];
