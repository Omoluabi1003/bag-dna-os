# BAG-DNA OS Compliance and Assurance Roadmap

This roadmap converts BAG-DNA OS from an investor-ready MVP into a pilot-ready aviation platform with measurable security, privacy, safety, interoperability, resilience, and evidence controls.

## Assurance stack

1. IATA Resolution 753 and baggage interoperability
2. ICAO Annex 17 security-control mapping
3. ISO/IEC 27001 information-security management
4. SOC 2 Type I, followed by SOC 2 Type II
5. ISO/IEC 27701 privacy-information management
6. ISO/IEC 42001 and NIST AI RMF for AI governance
7. ISO 22301 business continuity
8. NIST Cybersecurity Framework 2.0 operational controls
9. OWASP ASVS and API Security Top 10 application-security verification
10. PCI DSS only if BAG-DNA directly stores, processes, or transmits payment-card data

## Phase 1: Foundation

- Establish system boundaries, data classification, asset inventory, and ownership.
- Implement secure software-development lifecycle controls.
- Add automated linting, type checking, testing, dependency review, secret scanning, and code scanning.
- Define identity, access-control, encryption, key-management, logging, retention, backup, incident-response, and vendor-risk policies.
- Create privacy, AI-risk, threat-model, and evidence-chain assessments.
- Map product features to IATA, ICAO, ISO, SOC 2, NIST, and OWASP requirements.

## Phase 2: Controlled pilot readiness

- Implement production authentication, MFA, RBAC, least privilege, and privileged-access review.
- Deploy an append-only custody-event service with cryptographic integrity verification.
- Implement tenant isolation, regional data controls, encryption in transit and at rest, managed secrets, and key rotation.
- Add centralized logs, security alerts, service-level objectives, backup restoration tests, and disaster-recovery exercises.
- Complete independent penetration testing and remediate critical and high findings.
- Validate baggage-event interoperability with airline and airport partners.
- Run privacy and AI impact assessments for every pilot use case.

## Phase 3: External assurance

- Complete ISO/IEC 27001 readiness assessment.
- Complete SOC 2 Type I after controls are designed and operating.
- Operate controls for the audit period required for SOC 2 Type II.
- Pursue ISO/IEC 27701 and ISO/IEC 42001 where customer and jurisdictional requirements justify certification.
- Obtain independent aviation-security, interoperability, and operational-resilience assessments.

## Pilot exit criteria

A pilot cannot be represented as production-ready until:

- all critical security findings are closed;
- custody events are tamper-evident and independently verifiable;
- passenger and staff access is authenticated and role-restricted;
- privacy, retention, deletion, and cross-border transfer rules are approved;
- AI outputs remain advisory and subject to documented human review;
- outage, rollback, disaster-recovery, and manual-continuity procedures are tested;
- IATA and ICAO mappings are reviewed with relevant aviation stakeholders;
- legal, insurance, and contractual responsibilities are documented.

## Certification language

BAG-DNA OS must distinguish between alignment, readiness, assessment, certification, approval, adoption, and endorsement. No public statement may imply that an authority or standards body has certified or endorsed the platform unless written evidence exists.
