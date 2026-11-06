import * as repository from "@/repositories/auth.repository";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { PoolClient } from "pg";

import { ApiError } from "./http";
export type Actor = {
  id: string;
  organisationId: string | null;
  roles: { code: string; organisation_id: string | null }[];
};
let keys: ReturnType<typeof createRemoteJWKSet> | undefined;
export async function authenticate(req: Request): Promise<Actor> {
  const { OIDC_JWKS_URL, OIDC_ISSUER, OIDC_AUDIENCE } = process.env;
  if (!OIDC_JWKS_URL || !OIDC_ISSUER || !OIDC_AUDIENCE)
    throw new ApiError(
      503,
      "AUTH_NOT_CONFIGURED",
      "Configure the identity provider before using protected APIs",
    );
  const authorization = req.headers.get("authorization");
  if (!authorization?.startsWith("Bearer "))
    throw new ApiError(
      401,
      "UNAUTHENTICATED",
      "A Bearer access token is required",
    );
  let subject: string;
  try {
    keys ??= createRemoteJWKSet(new URL(OIDC_JWKS_URL));
    const { payload } = await jwtVerify(authorization.slice(7), keys, {
      issuer: OIDC_ISSUER,
      audience: OIDC_AUDIENCE,
      algorithms: ["RS256", "ES256"],
      requiredClaims: ["sub", "exp", "iat"],
    });
    subject = payload.sub!;
  } catch {
    throw new ApiError(401, "INVALID_TOKEN", "Invalid or expired access token");
  }
  const user = (await repository.selectIaaAuthUsers([subject], undefined))
    .rows[0];
  if (!user)
    throw new ApiError(
      403,
      "USER_NOT_PROVISIONED",
      "Ask the administrator to provision this identity",
    );
  const roles = (await repository.selectIaaAuthUserRoles([user.id], undefined))
    .rows;
  return { id: user.id, organisationId: user.organisation_id, roles };
}
export function isGlobal(actor: Actor) {
  return actor.roles.some(
    (r) => r.code === "system_admin" && r.organisation_id === null,
  );
}
export async function projectAccess(
  actor: Actor,
  id: string,
  mode: "read" | "edit" | "review",
  client?: PoolClient,
) {
  const project = (await repository.selectProjectProjects([id], client))
    .rows[0];
  if (!project) throw new ApiError(404, "NOT_FOUND", "Project not found");
  if (isGlobal(actor)) return;
  const allowedRoles =
    mode === "review"
      ? ["reviewer"]
      : mode === "edit"
        ? ["project_user", "data_steward"]
        : ["project_user", "reviewer", "data_steward", "management"];
  const allowed = actor.roles.some(
    (r) =>
      allowedRoles.includes(r.code) &&
      r.organisation_id === project.owner_organisation_id,
  );
  const member =
    mode === "review"
      ? false
      : (
          await repository.selectProjectMemberships(
            [id, actor.id, allowedRoles],
            client,
          )
        ).rowCount! > 0;
  if (!allowed && !member)
    throw new ApiError(403, "FORBIDDEN", "No permission for this project");
}
