import type { BagMemoryRecord } from "@/types/phoenix";

export const phoenixBag: BagMemoryRecord = {
  id: "BDO-MIA-2026-000184", label: "DEMO DATA", status: "Exception", flight: "BDO 2174", route: "MIA → ATL", seal: "S-884192", risk: 87,
  events: [
    { id:"EV-101", time:"16:58", airport:"MIA", zone:"Check-in", state:"Check-in", holder:"MIA acceptance", confidence:99, evidenceState:"verified", detail:"Identity issued and physical profile bound.", x:12, y:68 },
    { id:"EV-102", time:"17:06", airport:"MIA", zone:"Screening", state:"Induction", holder:"Screening team", confidence:98, evidenceState:"verified", detail:"Security cleared; seal S-884192 applied.", x:24, y:59 },
    { id:"EV-103", time:"17:19", airport:"MIA", zone:"Sortation", state:"Sortation", holder:"Handler H-204", confidence:97, evidenceState:"verified", detail:"Custody accepted into outbound make-up.", x:36, y:52 },
    { id:"EV-104", time:"17:42", airport:"MIA", zone:"Gate D32", state:"Aircraft loading", holder:"Ramp H-204", confidence:99, evidenceState:"verified", detail:"Load matched BDO 2174 and ULD-43A.", x:46, y:43 },
    { id:"EV-105", time:"19:31", airport:"ATL", zone:"Arrival", state:"Arrival", holder:"Expected ATL arrival team", confidence:0, evidenceState:"missing", detail:"Expected trusted arrival scan was not received.", x:76, y:35 },
    { id:"EV-106", time:"19:37", airport:"ATL", zone:"Transfer T4", state:"Exception", holder:"Unverified handler", confidence:32, evidenceState:"untrusted", detail:"Duplicate custody event from unregistered device D-991.", x:88, y:61 },
  ],
  briefing: {
    situation:"Flight BDO 2174 has arrived at ATL. The selected bag has no trusted destination arrival event.",
    anomaly:"Missing arrival scan followed by an untrusted duplicate custody event.",
    impact:"Custody continuity cannot be established; release could weaken the evidence chain.",
    action:"Place the bag record on operational hold and verify the destination handler and seal.", confidence:92,
    reasons:["Four origin events are hash-verified", "The expected ATL arrival window has elapsed", "Device D-991 is outside the assigned custody team"],
    evidence:[
      {id:"E-01",label:"Origin induction",detail:"Valid scan · MIA 17:06",state:"verified"},
      {id:"E-02",label:"Aircraft load",detail:"Valid load · ULD-43A",state:"verified"},
      {id:"E-03",label:"Destination arrival",detail:"No trusted event received",state:"missing"},
      {id:"E-04",label:"Duplicate custody",detail:"Unregistered device D-991",state:"untrusted"},
    ]
  }
};

export const phoenixFlights = [
  { number:"BDO 2174", route:"MIA → ATL", status:"Arrived", bags:"147 / 148", risk:"HIGH", bag:phoenixBag.id },
  { number:"BDO 804", route:"FLL → ATL", status:"Loading", bags:"101 / 101", risk:"NOMINAL", bag:"BDO-FLL-2026-000093" },
  { number:"BDO 551", route:"MIA → JFK", status:"Boarding", bags:"117 / 119", risk:"REVIEW", bag:"BDO-MIA-2026-000167" },
];
