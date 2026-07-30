# ADR-0003: Establish the BAG-DNA Platform Core

- **Status:** Accepted
- **Date:** 2026-07-30
- **Decision owners:** BAG-DNA maintainers

## Context

BAG-DNA OS currently uses a single Next.js repository with shared application logic under `lib/`. Upcoming identity, audit, evidence, event, and Mission Control capabilities require common primitives for errors, results, identifiers, events, logging, time, validation, and configuration.

Without an explicit shared core, each subsystem would likely implement its own versions of these concerns, creating inconsistent behavior and making later migration to a multi-package workspace more difficult.

## Decision

Create `lib/core/` as the canonical home for cross-cutting engineering primitives while BAG-DNA remains a single Next.js repository.

The initial platform core provides:

- typed `Result` helpers;
- standardized domain errors;
- domain-event contracts;
- prefixed entity identifier factories;
- a structured logger interface;
- injectable clocks;
- common validation helpers; and
- centralized core configuration loading.

Feature modules may depend on `lib/core`, but `lib/core` must not depend on feature-specific modules such as Mission Control, investigations, evidence, baggage, or flights.

## Alternatives considered

### Keep utilities distributed across feature directories

Rejected because it encourages duplication and inconsistent behavior.

### Introduce a monorepo and `packages/core` immediately

Deferred because the repository currently follows a single Next.js application structure. A workspace migration would require a separate ADR, tooling changes, and a dedicated implementation plan.

### Adopt a third-party framework for all primitives

Rejected because these contracts are small, platform-specific, and should remain dependency-light.

## Consequences

### Positive

- Future modules share consistent contracts.
- Cross-cutting behavior becomes easier to test and evolve.
- A future `packages/core` migration has a clear source boundary.
- Feature code can avoid direct dependence on runtime details.

### Tradeoffs

- The core introduces APIs that require disciplined adoption.
- Existing code is not migrated automatically by this decision.
- Care is required to prevent the core from becoming a generic dumping ground.

## Security impact

Standardized errors and structured logging reduce accidental leakage and make security-sensitive behavior easier to review. Sensitive values must never be added to log context.

## Operational impact

The logger, clock, event, and configuration contracts create stable seams for later observability, audit, replay, and testing integrations.

## Future considerations

When repository scale justifies a workspace architecture, `lib/core` may move to `packages/core` through a separate ADR and migration pull request.
