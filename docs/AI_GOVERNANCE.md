# AI Governance Standard

BAG-DNA OS AI capabilities are decision-support mechanisms. They must not independently accuse, detain, penalize, deny travel, or trigger irreversible action against a passenger or employee.

## Required controls

- Maintain an inventory of models, rules, datasets, vendors, versions, intended uses, and prohibited uses.
- Document model cards, data provenance, performance boundaries, known limitations, and responsible owners.
- Evaluate false-positive and false-negative rates under relevant operating conditions and across lawful demographic or environmental test segments.
- Define confidence thresholds and escalation paths for visual matching, anomaly detection, route deviation, identity confidence, and insider-threat indicators.
- Require trained human review for consequential alerts.
- Record model version, input references, output, confidence, explanation, reviewer, decision, and override reason.
- Monitor drift, operational degradation, abuse, and automation bias.
- Provide appeal, correction, and incident-escalation channels.
- Disable models safely when evidence quality, sensor availability, or performance falls below approved thresholds.

## Prohibited practices

- Using protected characteristics as risk proxies without lawful, documented justification.
- Treating AI output as proof of misconduct.
- Training on passenger, employee, or security-sensitive data without approved governance.
- Silent model changes in production.
- Reusing data for unrelated purposes without authorization.
