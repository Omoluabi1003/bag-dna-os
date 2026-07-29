export const BAG_DNA_ROLES = [
  "platform_admin",
  "tenant_admin",
  "security_officer",
  "operations_controller",
  "baggage_handler",
  "investigator",
  "auditor",
  "passenger_support",
  "passenger",
] as const;

export type BagDnaRole = (typeof BAG_DNA_ROLES)[number];

export const BAG_DNA_PERMISSIONS = [
  "tenant.manage",
  "identity.issue",
  "identity.read",
  "custody.append",
  "custody.read",
  "alert.manage",
  "investigation.manage",
  "evidence.export",
  "audit.read",
  "passenger.self_read",
] as const;

export type BagDnaPermission = (typeof BAG_DNA_PERMISSIONS)[number];

export interface AuthenticatedPrincipal {
  subjectId: string;
  tenantId: string;
  roles: BagDnaRole[];
  sessionId: string;
  mfaVerified: boolean;
  passengerReference?: string;
}

const ROLE_PERMISSIONS: Readonly<Record<BagDnaRole, readonly BagDnaPermission[]>> = {
  platform_admin: BAG_DNA_PERMISSIONS,
  tenant_admin: [
    "tenant.manage",
    "identity.issue",
    "identity.read",
    "custody.append",
    "custody.read",
    "alert.manage",
    "investigation.manage",
    "evidence.export",
    "audit.read",
  ],
  security_officer: [
    "identity.read",
    "custody.append",
    "custody.read",
    "alert.manage",
    "investigation.manage",
    "evidence.export",
    "audit.read",
  ],
  operations_controller: [
    "identity.issue",
    "identity.read",
    "custody.append",
    "custody.read",
    "alert.manage",
  ],
  baggage_handler: ["identity.read", "custody.append", "custody.read"],
  investigator: [
    "identity.read",
    "custody.read",
    "alert.manage",
    "investigation.manage",
    "evidence.export",
    "audit.read",
  ],
  auditor: ["identity.read", "custody.read", "evidence.export", "audit.read"],
  passenger_support: ["identity.read", "custody.read"],
  passenger: ["passenger.self_read"],
};

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function assertTenantScope(
  principal: AuthenticatedPrincipal,
  resourceTenantId: string,
): void {
  const isPlatformAdmin = principal.roles.includes("platform_admin");
  if (!isPlatformAdmin && principal.tenantId !== resourceTenantId) {
    throw new AuthorizationError("Cross-tenant access denied");
  }
}

export function hasPermission(
  principal: AuthenticatedPrincipal,
  permission: BagDnaPermission,
): boolean {
  return principal.roles.some((role) => ROLE_PERMISSIONS[role].includes(permission));
}

export function assertPermission(
  principal: AuthenticatedPrincipal,
  permission: BagDnaPermission,
  options: { requireMfa?: boolean } = {},
): void {
  if (options.requireMfa && !principal.mfaVerified) {
    throw new AuthorizationError("MFA verification is required");
  }

  if (!hasPermission(principal, permission)) {
    throw new AuthorizationError(`Missing permission: ${permission}`);
  }
}

export function assertPassengerSelfAccess(
  principal: AuthenticatedPrincipal,
  passengerReference: string,
): void {
  assertPermission(principal, "passenger.self_read");
  if (!principal.passengerReference || principal.passengerReference !== passengerReference) {
    throw new AuthorizationError("Passenger may access only their own journey");
  }
}
