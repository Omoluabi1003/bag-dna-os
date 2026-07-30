export type DomainErrorCode =
  | "VALIDATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INFRASTRUCTURE_ERROR";

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: DomainErrorCode,
    public readonly details?: Readonly<Record<string, unknown>>,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, details?: Readonly<Record<string, unknown>>) {
    super(message, "VALIDATION_ERROR", details);
  }
}

export class AuthorizationError extends DomainError {
  constructor(message = "The requested operation is not authorized.") {
    super(message, "AUTHORIZATION_ERROR");
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string, identifier?: string) {
    super(
      identifier ? `${resource} '${identifier}' was not found.` : `${resource} was not found.`,
      "NOT_FOUND",
      identifier ? { resource, identifier } : { resource },
    );
  }
}

export class ConflictError extends DomainError {
  constructor(message: string, details?: Readonly<Record<string, unknown>>) {
    super(message, "CONFLICT", details);
  }
}

export class InfrastructureError extends DomainError {
  constructor(message = "An infrastructure dependency failed.", details?: Readonly<Record<string, unknown>>) {
    super(message, "INFRASTRUCTURE_ERROR", details);
  }
}
