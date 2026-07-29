# BAG-DNA OS Control Register

This register tracks engineering and governance controls required for production and certification readiness. Status values are `planned`, `implemented-design`, `operating-evidence-required`, and `validated`.

| Control | Objective | Owner | Evidence | Status |
| --- | --- | --- | --- | --- |
| AC-01 | Enforce tenant-aware role-based access | Security Engineering | authorization module, access tests, access logs | implemented-design |
| AC-02 | Require MFA for privileged and evidence-export actions | Identity and Access | identity-provider policy, MFA logs, break-glass review | operating-evidence-required |
| AC-03 | Prevent cross-tenant access | Platform Engineering | tenant predicates, negative tests, penetration-test results | implemented-design |
| EV-01 | Generate hash-linked custody events | Platform Engineering | custody-ledger module, event samples, verification results | implemented-design |
| EV-02 | Preserve append-only evidence | Security Engineering | immutable storage configuration, write controls, retention policy | operating-evidence-required |
| EV-03 | Control evidence export | Security and Legal | export approval, manifest, hashes, access logs | planned |
| PR-01 | Maintain data inventory and lawful-purpose record | Privacy | processing inventory, records of processing | operating-evidence-required |
| PR-02 | Apply retention and deletion | Privacy and Platform | approved schedule, deletion jobs, completion logs | implemented-design |
| PR-03 | Fulfil privacy rights requests | Privacy | request register, identity checks, response evidence | implemented-design |
| PR-04 | Govern biometric and sensitive processing | Privacy, AI Governance, Legal | DPIA, necessity assessment, accuracy report, approvals | planned |
| IR-01 | Detect, classify, and coordinate incidents | Security | incident plan, alert records, exercise reports | implemented-design |
| IR-02 | Preserve forensic chain of custody | Security and Legal | artifact hashes, evidence handlers, UTC chronology | implemented-design |
| BC-01 | Recover core services and custody integrity | Reliability | BCP, restore tests, RTO/RPO results, chain verification | planned |
| AI-01 | Require accountable human oversight | AI Governance | decision workflow, overrides, dispositions, training | implemented-design |
| AI-02 | Monitor model performance and drift | AI Engineering | validation data, thresholds, monitoring reports | planned |
| AV-01 | Record applicable IATA Resolution 753 custody points | Aviation Operations | acquisition logs, reconciliation reports, pilot results | implemented-design |
| AV-02 | Detect and escalate custody anomalies | Aviation Security | seeded anomaly tests, alert chronology, disposition | operating-evidence-required |
| SD-01 | Run lint, type, build, dependency, secret, and code scanning | Engineering | GitHub Actions runs, findings and remediation | implemented-design |
| VR-01 | Assess critical vendors and subprocessors | Procurement and Security | assessments, contracts, SOC reports, issue register | planned |

## Status rule

`Implemented-design` means the repository contains an approved design, procedure, mapping, or enforcement primitive. It does not mean the control is deployed or effective. A control moves to `operating-evidence-required` when deployed but awaiting a sufficient observation period, and to `validated` only after internal or independent testing confirms effectiveness.
