# Privacy Operations Standard

## Purpose

This standard converts BAG-DNA OS privacy commitments into operating controls. It supports GDPR, UK GDPR, applicable U.S. state privacy laws, ISO 27701, and aviation-sector contractual obligations. Legal counsel and each deploying organization must validate jurisdiction-specific requirements.

## Data classification

| Class | Examples | Minimum handling |
| --- | --- | --- |
| Restricted | passenger identifiers, travel references, identity documents, biometric templates, investigation records | encryption, least privilege, MFA, access logging, approved region, explicit retention |
| Confidential | custody events, staff identifiers, device identifiers, airport operational data | encryption, tenant isolation, role-based access, audit logging |
| Internal | control evidence, system configuration, vendor assessments | authenticated access and change control |
| Public | approved marketing and demonstration content | publication approval |

## Mandatory controls

1. Collect only data required for an approved baggage, security, operational, legal, or passenger-service purpose.
2. Record purpose, lawful basis, controller, processor, data categories, recipients, storage region, and retention period in the data inventory.
3. Prohibit production biometric identification until a documented legal basis, necessity assessment, accuracy threshold, human-review workflow, and DPIA are approved.
4. Separate passenger-facing identifiers from operational identifiers wherever practical; use pseudonymous references in analytics.
5. Encrypt restricted and confidential data in transit and at rest. Manage keys separately from application data.
6. Apply tenant isolation at every query and service boundary. Cross-tenant access is denied unless expressly authorized for platform administration and logged.
7. Log reads, exports, corrections, deletions, privileged changes, and investigation access involving restricted data.
8. Validate subprocessors before use and contractually define processing scope, security duties, breach notice, deletion, and audit rights.
9. Do not use public aviation APIs as authoritative sources for security decisions or personal-data enrichment.

## Rights-request workflow

1. Authenticate the requester without collecting excessive new data.
2. Record request type, jurisdiction, scope, received date, deadline, assigned owner, and identity-verification method.
3. Search all mapped systems, exports, backups, support tools, and subprocessors.
4. Apply documented legal, aviation-security, fraud-prevention, litigation-hold, and regulatory exceptions.
5. Provide the response securely and preserve an auditable completion record.

## Retention baseline

The deploying controller must approve the final schedule. Until then, use these conservative defaults:

| Record | Baseline | Disposal trigger |
| --- | --- | --- |
| routine journey and custody data | 90 days after journey closure | no open claim, alert, investigation, legal hold, or regulatory requirement |
| passenger support records | 12 months after closure | no dispute or legal hold |
| security alerts and investigations | 24 months after closure | security and legal approval |
| immutable audit evidence | 7 years where contractually or legally required | approved expiry and no legal hold |
| demonstration data | 30 days or immediate reset | test cycle completion |

Deletion must cover primary stores, search indexes, caches, exports, and subprocessors. Backup expiry may be delayed only by documented immutable-backup cycles and must prevent restoration into active use without reapplying deletion instructions.

## Privacy incident escalation

Any suspected unauthorized access, disclosure, alteration, loss, cross-tenant exposure, or unlawful processing must enter the incident-response process immediately. Preserve evidence, limit further processing, involve privacy counsel, assess notification duties, and document the decision.
