# Security and Privacy Incident Response

## Objectives

Protect passengers and aviation operations, contain harm, preserve admissible evidence, restore trusted service, meet contractual and legal duties, and prevent recurrence.

## Severity

| Level | Definition | Examples |
| --- | --- | --- |
| SEV-1 Critical | active or credible risk to aviation security, widespread restricted-data exposure, destructive compromise, or loss of custody-ledger integrity | cross-tenant breach, privileged takeover, evidence-chain tampering |
| SEV-2 High | material service or confidentiality impact with limited scope | tenant-specific exposure, ransomware contained to a segment, sustained identity-verification outage |
| SEV-3 Medium | controlled security event without confirmed material harm | malware blocked, isolated credential misuse, recoverable integration failure |
| SEV-4 Low | policy deviation or suspicious activity requiring review | unsuccessful scanning, minor misconfiguration, false-positive alert |

## Roles

- Incident Commander coordinates decisions, timeline, communications, and closure.
- Security Lead handles containment, investigation, eradication, and technical recovery.
- Privacy Lead assesses personal-data impact and notification obligations.
- Aviation Operations Lead assesses safety, security, airport, airline, and authority impacts.
- Evidence Custodian preserves hashes, timestamps, exports, access records, and chain of custody.
- Communications Lead manages approved internal, customer, regulator, and public statements.

No individual should investigate their own suspected misconduct. Legal counsel should direct privileged investigations where appropriate.

## Response procedure

1. **Detect and record:** open an incident record with immutable identifier, reporter, timestamp, affected tenant, systems, indicators, and initial severity.
2. **Stabilize:** protect life and aviation operations first. Disable unsafe automation, isolate affected identities, credentials, devices, integrations, or tenants.
3. **Preserve evidence:** capture volatile data when safe, export relevant logs, hash artifacts, record handlers and timestamps, and prohibit destructive cleanup before authorization.
4. **Contain:** revoke sessions and keys, block indicators, restrict exports, stop compromised processors, and establish trusted administrative access.
5. **Assess:** determine data classes, passengers, bags, journeys, airports, airlines, jurisdictions, operational dependencies, and integrity impact.
6. **Notify internally:** immediately escalate SEV-1 and SEV-2 events to executive, legal, privacy, security, and aviation stakeholders.
7. **Eradicate and recover:** remove persistence, patch root causes, rotate secrets, validate tenant isolation, verify custody chains, restore from trusted sources, and increase monitoring.
8. **External notification:** legal and privacy leads determine required airport, airline, authority, regulator, insurer, customer, and individual notices. Record the rationale and deadlines.
9. **Close and learn:** complete root-cause analysis, corrective actions, control updates, evidence indexing, and an executive after-action review.

## Evidence record

Each material incident must retain:

- incident chronology in UTC;
- affected assets, tenants, identities, data, journeys, and integrations;
- decisions, approvers, commands, queries, and configuration changes;
- original logs and artifacts with cryptographic hashes;
- custody record for every evidence transfer;
- notification analysis and copies of approved communications;
- recovery validation and custody-ledger verification results;
- root cause, contributing factors, and tracked corrective actions.

## Exercises

Conduct a tabletop exercise at least annually and after material architectural change. Include a cross-tenant exposure scenario, a compromised baggage-handler credential, custody-event tampering, regional cloud outage, and an airport or airline integration failure.
