import type { PoolClient } from "pg";
import { execute } from "@/infrastructure/database/connection";

export function insertProjectProjects(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "INSERT INTO project.projects(code,owner_organisation_id,created_by) VALUES($1,$2,$3) RETURNING id,code",
    values,
    tx,
  );
}

export function insertProjectVersions(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `INSERT INTO project.versions(project_id,revision,name,area_id,status,effective_from,capacity_dc_mwp,site_area_ha,summary) VALUES($1,1,$2,$3,$4,$5,$6,$7,$8) RETURNING id,revision,review_status`,
    values,
    tx,
  );
}

export function selectProjectVersions(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT *,ST_AsGeoJSON(point)::jsonb AS geometry FROM project.versions WHERE id=$1",
    values,
    tx,
  );
}

export function selectProjectProfileNotes(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT field_code,section_code,narrative,visibility FROM project.profile_notes WHERE project_version_id=$1 ORDER BY section_code,field_code",
    values,
    tx,
  );
}

export function selectProjectVersions2(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT project_id,review_status FROM project.versions WHERE id=$1 FOR UPDATE",
    values,
    tx,
  );
}

export function insertProjectProfileNotes(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    `INSERT INTO project.profile_notes(project_version_id,field_code,section_code,narrative,visibility) VALUES($1,$2,$3,$4,$5) ON CONFLICT(project_version_id,field_code) DO UPDATE SET section_code=excluded.section_code,narrative=excluded.narrative,visibility=excluded.visibility RETURNING id`,
    values,
    tx,
  );
}

export function selectProjectProjects(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `SELECT p.id,p.code,p.owner_organisation_id,v.id AS version_id,v.name,v.revision,v.review_status,v.status,v.area_id,ST_AsGeoJSON(v.point)::jsonb AS geometry FROM project.projects p JOIN LATERAL(SELECT * FROM project.versions WHERE project_id=p.id ORDER BY revision DESC LIMIT 1) v ON true WHERE p.archived_at IS NULL AND ($1 OR p.owner_organisation_id=ANY($2::uuid[]) OR EXISTS(SELECT 1 FROM project.memberships m JOIN iaa_auth.roles r ON r.id=m.role_id WHERE m.project_id=p.id AND m.user_id=$3 AND r.code=ANY($4::text[]) AND (m.valid_until IS NULL OR m.valid_until>now()))) ORDER BY v.name,p.id LIMIT 200`,
    values,
    tx,
  );
}
