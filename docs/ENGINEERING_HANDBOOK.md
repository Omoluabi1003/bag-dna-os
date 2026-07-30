# BAG-DNA Engineering Handbook

**Version:** 1.0.0  
**Status:** Active  
**Codename:** Project Sentinel

## Purpose

The BAG-DNA Engineering Handbook defines the day-to-day engineering practices used to design, build, test, review, deploy, and operate BAG-DNA OS.

If the Engineering Constitution explains **why** we build software the way we do, this handbook explains **how** we do it.

Every contributor is expected to understand and follow these standards.

## Engineering philosophy

We optimize for:

- Trust
- Simplicity
- Maintainability
- Security
- Reliability
- Operational excellence

We do **not** optimize for:

- Clever code
- Premature optimization
- Hidden behavior
- Unnecessary abstractions
- Short-term convenience

## Engineering lifecycle

Every feature follows the same lifecycle.

### 1. Discovery

Document:

- Problem
- Goals
- Constraints
- Stakeholders
- Risks

Questions:

- Why are we building this?
- Who benefits?
- How will success be measured?

### 2. Architecture

Before implementation:

- Determine system ownership.
- Identify domain boundaries.
- Design APIs.
- Identify events.
- Evaluate failure modes.
- Determine security impact.

Significant decisions require an ADR.

### 3. Implementation

Implementation includes:

- Production code
- Tests
- Documentation
- Telemetry
- Audit events (where applicable)

No production feature ships without tests.

### 4. Review

Every pull request is reviewed for:

- Architecture
- Security
- Performance
- Accessibility
- Documentation
- Maintainability
- Testing
- Operational readiness

### 5. Release

Before deployment:

- CI passes.
- Documentation is updated.
- Rollback is verified.
- Monitoring is enabled.
- Alerts are configured.

## Branch strategy

| Branch | Purpose |
| --- | --- |
| `main` | Production-ready code |
| `develop` | Optional integration branch |
| `feature/<feature-name>` | New capabilities |
| `bugfix/<issue>` | Bug fixes |
| `hotfix/<issue>` | Production emergency fixes |
| `release/<version>` | Release stabilization |

## Commit standard

Use [Conventional Commits](https://www.conventionalcommits.org/).

Examples:

```text
feat(mission-control): add synchronized replay
fix(identity): prevent duplicate session creation
docs(engineering): add handbook
refactor(events): simplify event dispatcher
test(audit): add integrity validation
ci(actions): enable dependency review
```

## Repository structure

The repository currently uses the Next.js application structure below. Contributors should place new work in these locations until an architecture decision record (ADR) approves a different layout.

| Purpose | Location |
| --- | --- |
| Next.js App Router | `app/` |
| Reusable UI components | `components/` |
| Shared business logic | `lib/` |
| Static assets | `public/` |
| Database (Supabase) | `supabase/` |
| Documentation | `docs/` |
| Configuration | Repository root (`*.config.*`, `package.json`, and related files) |

Tests belong alongside code where practical, with integration suites in dedicated test directories.

As BAG-DNA OS grows into a multi-package platform, the repository may transition to a workspace layout with `apps/`, `packages/`, `infrastructure/`, and `scripts/`. That future structure must be proposed and accepted through an ADR before implementation; it is not the current contributor convention.

## Code style

Write code that is:

- Readable
- Predictable
- Testable
- Composable

Avoid unnecessary cleverness. Prefer explicit behavior over hidden magic.

## Naming

Names should describe intent.

Good:

- `EvidenceLedger`
- `MissionControlEngine`
- `AuditEvent`

Bad:

- `Manager`
- `Utils`
- `Helper`
- `Thing`
- `Stuff`

## Functions

Functions should:

- Do one thing.
- Be easy to test.
- Have predictable inputs and outputs.
- Avoid hidden side effects.

## Classes

- Prefer composition over inheritance.
- Favor dependency injection where appropriate.
- Avoid deep inheritance trees.

## Error handling

Errors should:

- Be actionable.
- Contain context.
- Never leak sensitive information.

Every error should either be handled or intentionally propagated. Never silently ignore failures.

## Logging

Use structured logging.

Never log:

- Passwords
- Secrets
- Access tokens
- Personal information unless explicitly approved

Logs should include:

- Timestamp
- Severity
- Correlation ID
- Component
- Operation
- Relevant metadata

## Telemetry

New services expose:

- Metrics
- Structured logs
- Distributed traces
- Health endpoints

Operational visibility is mandatory.

## Security expectations

Every feature considers:

- Authentication
- Authorization
- Input validation
- Output encoding
- Rate limiting (where applicable)
- Audit logging
- Least privilege

Never hardcode credentials. Never commit secrets. Never bypass authorization.

## Documentation

Every meaningful change updates documentation, including where applicable:

- Architecture
- API
- Configuration
- Runbooks
- Threat models
- ADRs

Documentation is part of the feature.

## Testing strategy

Every change should include appropriate automated tests.

The testing pyramid is:

1. Unit tests
2. Integration tests
3. End-to-end tests

Tests should be:

- Deterministic
- Fast
- Independent
- Readable

## Pull request expectations

Every pull request answers:

- What problem does this solve?
- Why was this approach selected?
- How was it tested?
- What documentation changed?
- What are the operational impacts?
- What are the security impacts?

## Code review guidelines

Review the change, not the person.

Reviews should be:

- Constructive
- Respectful
- Specific
- Evidence-based

Reject:

- Unclear code
- Missing tests
- Missing documentation
- Architectural violations
- Security regressions

## Performance

Measure before optimizing. Avoid premature optimization.

Establish performance budgets for:

- Startup
- Rendering
- API latency
- Memory
- Bundle size

## Accessibility

User-facing interfaces should:

- Support keyboard navigation.
- Maintain sufficient contrast.
- Provide semantic markup.
- Expose accessible labels.

Accessibility is a quality requirement.

## Dependency management

Before adding a dependency, ask:

- Can existing code solve the problem?
- Is the dependency actively maintained?
- Is it secure?
- Is it necessary?

Every dependency increases maintenance cost.

## AI-assisted development

AI may assist with:

- Code generation
- Documentation
- Tests
- Refactoring
- Architecture reviews

Every AI-generated contribution receives the same review standards as manually written code. Humans remain accountable.

## Technical debt

Technical debt is documented.

Intentional debt includes:

- Reason
- Owner
- Mitigation plan
- Review date

Untracked debt becomes future risk.

## Definition of success

Engineering success is measured by:

- Reliable systems
- Secure systems
- Maintainable systems
- Documented systems
- Observable systems
- Happy operators

It is not measured by:

- Lines of code
- Velocity alone
- Repository size

## Final principle

Build software that another engineer can confidently understand, operate, and improve five years from now.

That is the standard for BAG-DNA OS.
