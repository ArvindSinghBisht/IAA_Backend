import type { PoolClient } from "pg";
import { execute } from "@/infrastructure/database/connection";

export function selectDataDatasetVersions(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT dataset_id FROM data.dataset_versions WHERE id=$1",
    values,
    tx,
  );
}

export function selectDataDatasets(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT id FROM data.datasets WHERE id=$1 FOR UPDATE",
    values,
    tx,
  );
}

export function selectDataDatasetVersions2(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT * FROM data.dataset_versions WHERE id=$1 FOR UPDATE",
    values,
    tx,
  );
}

export function updateDataDatasetVersions(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "UPDATE data.dataset_versions SET status='review' WHERE id=$1",
    values,
    tx,
  );
}

export function selectDataVersionEvents(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT actor_id FROM data.version_events WHERE version_id=$1 AND action='submit' ORDER BY created_at DESC LIMIT 1",
    values,
    tx,
  );
}

export function selectDataQualityIssues(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    `SELECT 1 FROM data.quality_issues q JOIN data.source_records sr ON sr.id=q.source_record_id JOIN data.import_jobs j ON j.id=sr.import_job_id WHERE j.version_id=$1 AND q.severity='error' AND q.resolved_at IS NULL LIMIT 1`,
    values,
    tx,
  );
}

export function updateDataDatasetVersions2(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "UPDATE data.dataset_versions SET status='approved',approved_by=$2,approved_at=now() WHERE id=$1",
    values,
    tx,
  );
}

export function updateDataDatasetVersions3(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "UPDATE data.dataset_versions SET status='rejected' WHERE id=$1",
    values,
    tx,
  );
}

export function updateDataDatasetVersions4(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "UPDATE data.dataset_versions SET is_current=false WHERE dataset_id=$1 AND is_current",
    values,
    tx,
  );
}

export function updateDataDatasetVersions5(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "UPDATE data.dataset_versions SET is_current=true,public_allowed=$2,planning_allowed=$3,export_allowed=$4 WHERE id=$1",
    values,
    tx,
  );
}

export function updateDataDatasetVersions6(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "UPDATE data.dataset_versions SET status='retired',is_current=false,public_allowed=false,planning_allowed=false,export_allowed=false WHERE id=$1",
    values,
    tx,
  );
}

export function insertDataVersionEvents(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "INSERT INTO data.version_events(version_id,actor_id,action,reason) VALUES($1,$2,$3,$4)",
    values,
    tx,
  );
}

export function selectSession(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `SELECT * FROM ${fragments[0]} WHERE id=$1 FOR UPDATE`,
    values,
    tx,
  );
}

export function selectMonFormFields(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT 1 FROM mon.form_fields WHERE form_version_id=$1 GROUP BY indicator_version_id HAVING count(*)>1",
    values,
    tx,
  );
}

export function selectMonFormFields2(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT 1 FROM mon.form_fields f JOIN mon.indicator_versions v ON v.id=f.indicator_version_id WHERE f.form_version_id=$1 AND v.approved_at IS NULL",
    values,
    tx,
  );
}

export function selectMonFormFields3(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT 1 FROM mon.form_fields WHERE form_version_id=$1",
    values,
    tx,
  );
}

export function updateSession(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `UPDATE ${fragments[0]} SET approved_by=$2,approved_at=now()${fragments[1]} WHERE id=$1`,
    values,
    tx,
  );
}

export function updateSession2(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `UPDATE ${fragments[0]} SET status='retired' WHERE id=$1`,
    values,
    tx,
  );
}

export function selectOpsAuditEvents(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT id,actor_id,action,target_table,target_id,redacted_change,occurred_at FROM ops.audit_events ORDER BY occurred_at DESC,id LIMIT 200",
    values,
    tx,
  );
}
