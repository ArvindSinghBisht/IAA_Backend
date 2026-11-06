import type { PoolClient } from "pg";
import { execute } from "@/infrastructure/database/connection";

export function selectProjectVersions(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT * FROM project.versions WHERE id=$1 FOR UPDATE",
    values,
    tx,
  );
}

export function updateProjectVersions(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `UPDATE project.versions SET ${fragments[0]} WHERE id=$1`,
    values,
    tx,
  );
}

export function selectProjectVersions2(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT * FROM project.versions WHERE id=$1 FOR UPDATE",
    values,
    tx,
  );
}

export function updateProjectVersions2(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "UPDATE project.versions SET review_status='submitted',submitted_by=$2,submitted_at=now() WHERE id=$1",
    values,
    tx,
  );
}

export function updateProjectVersions3(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    `UPDATE project.versions SET review_status=$2,approved_by=CASE WHEN $2='approved' THEN $3::uuid END,approved_at=CASE WHEN $2='approved' THEN now() END WHERE id=$1`,
    values,
    tx,
  );
}

export function updateProjectPublications(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "UPDATE project.publications SET revoked_at=now() WHERE project_version_id IN(SELECT id FROM project.versions WHERE project_id=$1) AND revoked_at IS NULL",
    values,
    tx,
  );
}

export function insertProjectPublications(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "INSERT INTO project.publications(project_version_id,approved_by,approved_at,released_at,public_fields,release_reason) VALUES($1,$2,now(),now(),$3,$4)",
    values,
    tx,
  );
}

export function updateProjectPublications2(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "UPDATE project.publications SET revoked_at=now() WHERE project_version_id=$1 AND revoked_at IS NULL",
    values,
    tx,
  );
}

export function insertProjectReviewEvents(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "INSERT INTO project.review_events(project_version_id,actor_id,action,reason) VALUES($1,$2,$3,$4)",
    values,
    tx,
  );
}

export function selectProjectVersions3(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT project_id FROM project.versions WHERE id=$1",
    values,
    tx,
  );
}

export function selectProjectProjects(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT id FROM project.projects WHERE id=$1 FOR UPDATE",
    values,
    tx,
  );
}

export function selectProjectVersions4(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT * FROM project.versions WHERE id=$1 FOR UPDATE",
    values,
    tx,
  );
}

export function selectProjectVersions5(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT 1 FROM project.versions WHERE project_id=$1 AND review_status IN('draft','submitted')",
    values,
    tx,
  );
}

export function insertProjectVersions(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `INSERT INTO project.versions(${fragments[0]},revision,supersedes_id) SELECT ${fragments[1]},(SELECT max(revision)+1 FROM project.versions WHERE project_id=$2),$1 FROM project.versions WHERE id=$1 RETURNING id,revision`,
    values,
    tx,
  );
}

export function insertSession(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `INSERT INTO ${fragments[0]}(project_version_id,${fragments[1]}) SELECT $2,${fragments[2]} FROM ${fragments[3]} WHERE project_version_id=$1`,
    values,
    tx,
  );
}

export function insertProjectReviewEvents2(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "INSERT INTO project.review_events(project_version_id,actor_id,action,reason) VALUES($1,$2,'revise',$3)",
    values,
    tx,
  );
}
