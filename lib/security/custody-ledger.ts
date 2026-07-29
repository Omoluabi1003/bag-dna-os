export type CustodyEventType =
  | "identity_issued"
  | "checkpoint_verified"
  | "custody_transferred"
  | "seal_verified"
  | "route_exception"
  | "security_alert"
  | "claim_opened"
  | "evidence_exported";

export interface CustodyEventPayload {
  eventId: string;
  tenantId: string;
  bagIdentityId: string;
  journeyId: string;
  eventType: CustodyEventType;
  occurredAt: string;
  recordedAt: string;
  actorId: string;
  actorRole: string;
  checkpointId?: string;
  location?: { latitude: number; longitude: number };
  deviceId?: string;
  attributes: Readonly<Record<string, string | number | boolean | null>>;
}

export interface LinkedCustodyEvent extends CustodyEventPayload {
  sequence: number;
  previousHash: string | null;
  eventHash: string;
  hashAlgorithm: "SHA-256";
}

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, stableValue(nested)]),
    );
  }
  return value;
}

export function canonicalize(value: unknown): string {
  return JSON.stringify(stableValue(value));
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function appendCustodyEvent(
  payload: CustodyEventPayload,
  previous: LinkedCustodyEvent | null,
): Promise<LinkedCustodyEvent> {
  if (previous) {
    if (previous.tenantId !== payload.tenantId) throw new Error("Tenant chain mismatch");
    if (previous.bagIdentityId !== payload.bagIdentityId) throw new Error("Bag chain mismatch");
    if (previous.journeyId !== payload.journeyId) throw new Error("Journey chain mismatch");
  }

  const sequence = previous ? previous.sequence + 1 : 1;
  const previousHash = previous?.eventHash ?? null;
  const hashInput = canonicalize({ ...payload, sequence, previousHash });
  const eventHash = await sha256(hashInput);

  return { ...payload, sequence, previousHash, eventHash, hashAlgorithm: "SHA-256" };
}

export async function verifyCustodyChain(events: readonly LinkedCustodyEvent[]): Promise<boolean> {
  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    const previous = index === 0 ? null : events[index - 1];

    if (event.sequence !== index + 1) return false;
    if (event.previousHash !== (previous?.eventHash ?? null)) return false;
    if (previous && (event.tenantId !== previous.tenantId || event.bagIdentityId !== previous.bagIdentityId || event.journeyId !== previous.journeyId)) return false;

    const { eventHash, hashAlgorithm: _hashAlgorithm, ...hashable } = event;
    const expectedHash = await sha256(canonicalize(hashable));
    if (eventHash !== expectedHash) return false;
  }

  return true;
}
