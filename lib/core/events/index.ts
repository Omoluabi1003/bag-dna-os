export interface DomainEvent<TPayload = Readonly<Record<string, unknown>>> {
  readonly id: string;
  readonly type: string;
  readonly occurredAt: string;
  readonly aggregateId?: string;
  readonly correlationId?: string;
  readonly actorId?: string;
  readonly payload: TPayload;
}

export type EventHandler<TEvent extends DomainEvent = DomainEvent> = (
  event: TEvent,
) => void | Promise<void>;

export const createDomainEvent = <TPayload>(input: {
  type: string;
  payload: TPayload;
  aggregateId?: string;
  correlationId?: string;
  actorId?: string;
  id?: string;
  occurredAt?: string;
}): DomainEvent<TPayload> => ({
  id: input.id ?? crypto.randomUUID(),
  type: input.type,
  occurredAt: input.occurredAt ?? new Date().toISOString(),
  aggregateId: input.aggregateId,
  correlationId: input.correlationId,
  actorId: input.actorId,
  payload: input.payload,
});
