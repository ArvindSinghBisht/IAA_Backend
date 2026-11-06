import type { PoolClient } from "pg";
import { execute } from "@/infrastructure/database/connection";

export function selectMonSubmissionVersions(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT project_id FROM mon.submission_versions WHERE id=$1",
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
    `SELECT * FROM ${fragments[0]} WHERE submission_version_id=$1 ORDER BY id LIMIT 1000`,
    values,
    tx,
  );
}

export function selectMonSubmissionVersions2(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT project_id,status FROM mon.submission_versions WHERE id=$1 FOR UPDATE",
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
    `INSERT INTO ${fragments[0]}(submission_version_id,${fragments[1]}) VALUES($1,${fragments[2]}) RETURNING id`,
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

export function insertOpsAuditEvents(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "INSERT INTO ops.audit_events(actor_id,action,target_table,target_id,request_id,redacted_change) VALUES($1,'record_added',$2,$3,gen_random_uuid()::text,'{}')",
    values,
    tx,
  );
}

export function selectMonObligations(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT o.*,p.code AS period_code,p.start_date,p.end_date FROM mon.obligations o JOIN mon.periods p ON p.id=o.period_id WHERE o.project_id=$1 ORDER BY o.due_at",
    values,
    tx,
  );
}

export function selectMonObligations2(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT project_id,form_version_id FROM mon.obligations WHERE id=$1",
    values,
    tx,
  );
}

export function selectMonFormFields(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT f.*,v.value_type,v.validation,v.unit_id,i.code AS indicator_code,i.name AS indicator_name FROM mon.form_fields f JOIN mon.indicator_versions v ON v.id=f.indicator_version_id JOIN mon.indicators i ON i.id=v.indicator_id WHERE f.form_version_id=$1 ORDER BY f.sort_order,f.id",
    values,
    tx,
  );
}

export function selectMonSubmissionVersions3(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT project_id,status FROM mon.submission_versions WHERE id=$1 FOR UPDATE",
    values,
    tx,
  );
}

export function deleteSession(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `DELETE FROM ${fragments[0]} WHERE id=$1 AND submission_version_id=$2 RETURNING id`,
    values,
    tx,
  );
}

export function updateMonSubmissionVersions2(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "UPDATE mon.submission_versions SET validation_status='pending',payload_hash=NULL WHERE id=$1",
    values,
    tx,
  );
}

export function insertOpsAuditEvents2(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "INSERT INTO ops.audit_events(actor_id,action,target_table,target_id,request_id,redacted_change) VALUES($1,'draft_record_deleted',$2,$3,gen_random_uuid()::text,'{}')",
    values,
    tx,
  );
}
