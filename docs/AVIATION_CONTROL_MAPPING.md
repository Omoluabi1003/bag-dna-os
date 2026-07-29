# Aviation Baggage Security Control Mapping

## Scope and caution

This working map supports stakeholder review against IATA Resolution 753 baggage tracking expectations and ICAO-aligned aviation-security objectives. It is not an official interpretation, certification, approval, or substitute for airline, airport, authority, or legal validation.

## Resolution 753 custody points

BAG-DNA OS should record a verifiable acquisition event at each applicable point:

| Custody point | Platform control | Required evidence |
| --- | --- | --- |
| handover from passenger to airline | issue and bind the digital bag identity to the journey, secure credential, physical characteristics, and authorized acceptance actor | UTC timestamp, station, journey, bag identity, actor, device, credential result, weight and seal state |
| loading onto aircraft | verify expected flight, route, container or cart, checkpoint, actor authorization, and current identity confidence | load event, flight reference, location, actor, device, previous-event hash, exception result |
| transfer between carriers | reconcile inbound and outbound journeys, transfer authority, custody owner, time window, identity attributes, and any seal changes | transfer event, both carrier contexts, handler identities, route result, discrepancy record |
| delivery to passenger | verify reclaim location, journey closure, passenger entitlement, bag identity, and unresolved alerts | delivery event, entitlement method, reclaim location, confidence result, exception approval |

## ICAO-aligned security objectives

| Objective | BAG-DNA OS control | Evidence artifact |
| --- | --- | --- |
| positive identity and journey association | persistent bag identity, journey binding, rotating credential, physical fingerprint | issuance record and validation history |
| protection against unauthorized interference | tamper seal, geofenced handling, role-based access, anomaly alerts | seal events, access logs, alert chronology |
| secure transfer of custody | authorized actor and device, tenant and station scope, hash-linked event sequence | custody chain and authorization decision |
| detection and escalation of anomalies | route, weight, appearance, credential, timing, and handler checks | explainable alert factors and human disposition |
| accountable intervention | documented human approval for overrides, holds, release, and evidence export | investigation record, approver, reason, timestamp |
| operational continuity | degraded-mode procedures, queued scans, reconciliation, recovery validation | continuity test, replay report, missing-event exception log |
| auditability and oversight | append-only records, cryptographic verification, controlled exports, access monitoring | chain verification result, export manifest, audit trail |

## Minimum event quality

Every production custody event must include a unique event ID, tenant, bag identity, journey, event type, occurrence and recording timestamps, actor, role, authorization result, device or integration source, checkpoint or location where applicable, previous-event hash, event hash, and schema version.

Events must be rejected or quarantined when mandatory fields are absent, timestamps fall outside approved tolerances, tenant or journey scope conflicts, actor authorization fails, the previous hash is invalid, or duplicate event identity is detected.

## Human oversight

Automated confidence or anomaly scores may recommend verification, hold, escalation, or investigation. They must not independently authorize punitive action, passenger denial, law-enforcement referral, or release of a security hold without an approved operating procedure and accountable human decision.

## Pilot acceptance evidence

A controlled pilot should demonstrate:

1. acquisition at all applicable custody points;
2. successful reconciliation across airline, airport, and transfer boundaries;
3. measured read and match rates by device, station, and custody point;
4. detection and disposition of seeded route, identity, seal, and authorization anomalies;
5. recovery from offline scanning and integration failure without silent event loss;
6. tenant isolation, privileged-access logging, and evidence export verification;
7. privacy, retention, incident-response, and business-continuity procedures exercised with stakeholders.
