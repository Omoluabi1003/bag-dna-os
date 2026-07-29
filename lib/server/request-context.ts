import {
  BAG_DNA_ROLES,
  type AuthenticatedPrincipal,
  type BagDnaRole,
} from "@/lib/security/authorization";

export interface VerifiedIdentityClaims {
  sub: string;
  tenant_id: string;
  roles: string[];
  session_id: string;
  amr?: string[];
  passenger_reference?: string;
  exp: number;
}

export interface IdentityVerifier {
  verifyAccessToken(token: string): Promise<VerifiedIdentityClaims>;
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

function isRole(value: string): value is BagDnaRole {
  return (BAG_DNA_ROLES as readonly string[]).includes(value);
}

export async function authenticateRequest(
  request: Request,
  verifier: IdentityVerifier,
): Promise<AuthenticatedPrincipal> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    throw new AuthenticationError("Bearer access token is required");
  }

  const token = authorization.slice("Bearer ".length).trim();
  if (!token) throw new AuthenticationError("Access token is empty");

  const claims = await verifier.verifyAccessToken(token);
  if (claims.exp * 1000 <= Date.now()) {
    throw new AuthenticationError("Access token has expired");
  }
  if (!claims.sub || !claims.tenant_id || !claims.session_id) {
    throw new AuthenticationError("Required identity claims are missing");
  }

  const roles = claims.roles.filter(isRole);
  if (roles.length === 0 || roles.length !== claims.roles.length) {
    throw new AuthenticationError("Access token contains invalid roles");
  }

  return {
    subjectId: claims.sub,
    tenantId: claims.tenant_id,
    roles,
    sessionId: claims.session_id,
    mfaVerified: claims.amr?.includes("mfa") ?? false,
    passengerReference: claims.passenger_reference,
  };
}

export function securityErrorResponse(error: unknown): Response {
  const status = error instanceof AuthenticationError ? 401 : 403;
  return Response.json(
    {
      error: status === 401 ? "unauthenticated" : "forbidden",
      message: error instanceof Error ? error.message : "Access denied",
    },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
