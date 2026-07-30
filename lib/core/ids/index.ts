export type EntityKind =
  | "audit"
  | "evidence"
  | "investigation"
  | "bag"
  | "flight"
  | "event";

export type EntityId<TKind extends EntityKind = EntityKind> = `${TKind}_${string}`;

export const createEntityId = <TKind extends EntityKind>(kind: TKind): EntityId<TKind> =>
  `${kind}_${crypto.randomUUID()}`;

export const createAuditId = () => createEntityId("audit");
export const createEvidenceId = () => createEntityId("evidence");
export const createInvestigationId = () => createEntityId("investigation");
export const createBagId = () => createEntityId("bag");
export const createFlightId = () => createEntityId("flight");
export const createEventId = () => createEntityId("event");
