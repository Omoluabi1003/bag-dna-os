# Security Policy

## Reporting a vulnerability

Do not disclose suspected vulnerabilities through public issues. Send a private report to the BAG-DNA OS security owner with the affected component, reproduction steps, expected and observed behavior, potential impact, and proof-of-concept material that does not expose passenger, employee, airport, airline, or security-sensitive data.

Reports are acknowledged, triaged, assigned a severity, remediated, verified, and documented. Public disclosure must be coordinated after remediation.

## Security principles

- Least privilege and separation of duties
- MFA for administrative and operational access
- Encryption in transit and at rest
- Managed secrets and scheduled key rotation
- Tenant and environment isolation
- Tamper-evident custody and audit events
- Secure defaults and fail-safe behavior
- Human review for consequential AI outputs
- Data minimization and purpose limitation
- Tested incident response and disaster recovery

## Minimum release gates

Production releases require successful linting, type checking, build verification, automated tests, dependency review, secret scanning, code scanning, and documented approval. Critical vulnerabilities block release. High-severity findings require remediation or a time-bound, formally approved exception.

## Supported versions

Only the current production release and actively maintained pilot branches receive security fixes.
