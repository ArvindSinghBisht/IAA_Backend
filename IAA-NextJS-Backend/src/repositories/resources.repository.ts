import type { PoolClient } from "pg";
import { execute } from "@/infrastructure/database/connection";

export function insertSession(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `INSERT INTO ${fragments[0]}(${fragments[1]}) VALUES(${fragments[2]}) RETURNING id`,
    values,
    tx,
  );
}

export function selectMonObligations(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT 1 FROM mon.obligations WHERE period_id=$1",
    values,
    tx,
  );
}

export function selectMonFormVersions(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT status FROM mon.form_versions WHERE id=$1 FOR UPDATE",
    values,
    tx,
  );
}

export function selectPlanMethodVersions(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT status FROM plan.method_versions WHERE id=$1 FOR UPDATE",
    values,
    tx,
  );
}

export function selectGeoLayers(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT dataset_version_id FROM geo.layers WHERE id=$1",
    values,
    tx,
  );
}

export function selectDataSourceRecords(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT 1 FROM data.source_records sr JOIN data.import_jobs j ON j.id=sr.import_job_id WHERE sr.id=$1 AND j.version_id=$2",
    values,
    tx,
  );
}

export function selectDataDatasetVersions(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT status FROM data.dataset_versions WHERE id=$1 FOR UPDATE",
    values,
    tx,
  );
}

export function selectProjectVersions(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT project_id,review_status FROM project.versions WHERE id=$1 FOR UPDATE",
    values,
    tx,
  );
}

export function selectMonSubmissionVersions(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT project_id,status FROM mon.submission_versions WHERE id=$1 FOR UPDATE",
    values,
    tx,
  );
}

export function selectMonBaselines(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT project_id,crop_id,plot_code FROM mon.baselines WHERE id=$1",
    values,
    tx,
  );
}

export function selectMonProjectBeneficiaries(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT 1 FROM mon.project_beneficiaries WHERE project_id=$1 AND beneficiary_id=$2",
    values,
    tx,
  );
}

export function selectMonSubmissions(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT 1 FROM mon.submissions WHERE obligation_id=$1",
    values,
    tx,
  );
}

export function selectMonHarvestRecords(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT 1 FROM mon.harvest_records WHERE baseline_id=$1",
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
    `SELECT ${fragments[0]} FROM ${fragments[1]} t ${fragments[2]} ORDER BY t.id LIMIT $1 OFFSET $2`,
    values,
    tx,
  );
}

export function selectSession2(
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

export function deleteSession(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(`DELETE FROM ${fragments[0]} WHERE id=$1`, values, tx);
}

export function updateSession(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `UPDATE ${fragments[0]} SET ${fragments[1]} WHERE id=$1 RETURNING id`,
    values,
    tx,
  );
}

export function updateMonSubmissionVersions(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "UPDATE mon.submission_versions SET validation_status='pending',payload_hash=NULL WHERE id=$1",
    values,
    tx,
  );
}
