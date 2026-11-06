import type { PoolClient } from "pg";
import { execute } from "@/infrastructure/database/connection";

export function selectIaaAuthUsers(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT id,organisation_id FROM iaa_auth.users WHERE identity_subject=$1 AND is_active=true",
    values,
    tx,
  );
}

export function selectIaaAuthUserRoles(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT r.code,ur.organisation_id FROM iaa_auth.user_roles ur JOIN iaa_auth.roles r ON r.id=ur.role_id WHERE ur.user_id=$1 AND (ur.expires_at IS NULL OR ur.expires_at>now())",
    values,
    tx,
  );
}

export function selectProjectProjects(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT owner_organisation_id FROM project.projects WHERE id=$1 AND archived_at IS NULL",
    values,
    tx,
  );
}

export function selectProjectMemberships(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT 1 FROM project.memberships m JOIN iaa_auth.roles r ON r.id=m.role_id WHERE m.project_id=$1 AND m.user_id=$2 AND (m.valid_until IS NULL OR m.valid_until>now()) AND r.code=ANY($3::text[])",
    values,
    tx,
  );
}
