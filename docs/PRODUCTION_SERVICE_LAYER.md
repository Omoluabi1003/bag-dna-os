# Production Service Layer

## Implemented in this repository

- PostgreSQL/Supabase schema for tenants, memberships, bag identities, custody events, and audit events.
- Row-level security that scopes ordinary access to the authenticated tenant.
- Role-gated inserts for bag identities and custody events.
- Append-only custody and audit tables protected against update and deletion.
- Unique custody sequencing and event-hash constraints.
- Fail-closed request authentication boundary using independently verified identity claims.
- MFA-sensitive authorization for custody writes.
- Custody service that creates hash-linked events, verifies chains, and records allowed and denied activity.
- Structural database security tests.

## Identity-provider contract

The production verifier must validate token signature, issuer, audience, expiry, revocation posture, and approved signing algorithms. It must return trusted claims for subject, tenant, roles, session, authentication methods, and optional passenger reference. Application code must never trust tenant or role values supplied through ordinary request headers or body fields.

Privileged identities must use MFA. Platform administration should use separate accounts, strong phishing-resistant authentication, just-in-time elevation, and monitored break-glass procedures.

## Database deployment

1. Create separate Supabase projects or PostgreSQL clusters for development, staging, and production.
2. Apply migrations through a controlled service identity, never through the browser client.
3. Configure JWT custom claims for `tenant_id`, `roles`, and `session_id` using an approved authorization hook.
4. Keep the service-role key server-side and outside application logs.
5. Run the SQL invariant tests on a disposable database after every migration.
6. Enable database backups, point-in-time recovery, network restrictions, query monitoring, and key rotation.

## Required adapter work

The `CustodyService` intentionally depends on repository, audit, and identity-verifier interfaces. The production adapter must use transactions and serialize writes per bag identity so that two writers cannot assign the same sequence. A recommended pattern is a PostgreSQL advisory lock or `select ... for update` on the bag identity followed by retrieval of the current last event and insertion of the next event in one transaction.

## API requirements

Every authenticated endpoint must:

- verify the bearer token through the trusted identity adapter;
- derive tenant, role, actor, session, and MFA state from verified claims;
- enforce application authorization before database access;
- rely on row-level security as a second enforcement layer;
- validate request schemas and reject unknown or oversized input;
- use idempotency keys for retryable writes;
- emit audit records for allowed, denied, and failed privileged actions;
- return `Cache-Control: no-store` for restricted data;
- avoid exposing internal hashes, identifiers, or security logic unless required by the caller's role.

## Remaining before live pilot

- Implement the concrete Supabase repository and identity-verifier adapters.
- Add authenticated Next.js API routes and schema validation.
- Add transactional concurrency and idempotency controls.
- Connect centralized logging and alerting.
- Add integration tests against a disposable Supabase project.
- Complete independent threat modeling and penetration testing.
- Validate operational procedures with airport, airline, authority, privacy, and security stakeholders.

This layer is production-oriented engineering infrastructure. It is not evidence that a live deployment, certification, or aviation approval already exists.
