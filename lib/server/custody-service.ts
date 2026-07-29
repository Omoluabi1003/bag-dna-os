import {
  assertPermission,
  assertTenantScope,
  type AuthenticatedPrincipal,
} from "@/lib/security/authorization";
import {
  appendCustodyEvent,
  verifyCustodyChain,
  type CustodyEventPayload,
  type LinkedCustodyEvent,
} from "@/lib/security/custody-ledger";

export interface CustodyEventRepository {
  findLatest(input: {
    tenantId: string;
    bagIdentityId: string;
    journeyId: string;
  }): Promise<LinkedCustodyEvent | null>;
  insert(event: LinkedCustodyEvent): Promise<void>;
  list(input: {
    tenantId: string;
    bagIdentityId: string;
    journeyId: string;
  }): Promise<LinkedCustodyEvent[]>;
}

export interface AuditWriter {
  write(event: {
    tenantId: string;
    actorId: string;
    sessionId: string;
    action: string;
    resourceType: string;
    resourceId: string;
    outcome: "allowed" | "denied" | "error";
    reason?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void>;
}

export class CustodyService {
  constructor(
    private readonly repository: CustodyEventRepository,
    private readonly audit: AuditWriter,
  ) {}

  async append(
    principal: AuthenticatedPrincipal,
    payload: CustodyEventPayload,
  ): Promise<LinkedCustodyEvent> {
    try {
      assertTenantScope(principal, payload.tenantId);
      assertPermission(principal, "custody.append", { requireMfa: true });

      if (payload.actorId !== principal.subjectId) {
        throw new Error("Actor identity must match authenticated principal");
      }

      const previous = await this.repository.findLatest({
        tenantId: payload.tenantId,
        bagIdentityId: payload.bagIdentityId,
        journeyId: payload.journeyId,
      });
      const linked = await appendCustodyEvent(payload, previous);
      await this.repository.insert(linked);
      await this.audit.write({
        tenantId: payload.tenantId,
        actorId: principal.subjectId,
        sessionId: principal.sessionId,
        action: "custody.append",
        resourceType: "custody_event",
        resourceId: linked.eventId,
        outcome: "allowed",
        metadata: { sequence: linked.sequence, eventHash: linked.eventHash },
      });
      return linked;
    } catch (error) {
      await this.audit.write({
        tenantId: payload.tenantId,
        actorId: principal.subjectId,
        sessionId: principal.sessionId,
        action: "custody.append",
        resourceType: "custody_event",
        resourceId: payload.eventId,
        outcome: "denied",
        reason: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  async verify(
    principal: AuthenticatedPrincipal,
    scope: { tenantId: string; bagIdentityId: string; journeyId: string },
  ): Promise<{ valid: boolean; eventCount: number; lastHash: string | null }> {
    assertTenantScope(principal, scope.tenantId);
    assertPermission(principal, "custody.read");
    const events = await this.repository.list(scope);
    const valid = await verifyCustodyChain(events);
    await this.audit.write({
      tenantId: scope.tenantId,
      actorId: principal.subjectId,
      sessionId: principal.sessionId,
      action: "custody.verify",
      resourceType: "bag_identity",
      resourceId: scope.bagIdentityId,
      outcome: valid ? "allowed" : "error",
      reason: valid ? undefined : "Custody chain verification failed",
      metadata: { eventCount: events.length },
    });
    return { valid, eventCount: events.length, lastHash: events.at(-1)?.eventHash ?? null };
  }
}
