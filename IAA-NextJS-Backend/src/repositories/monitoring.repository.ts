import type { PoolClient } from "pg";
import { execute } from "@/infrastructure/database/connection";

export function selectMonSubmissionVersions(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT * FROM mon.submission_versions WHERE id=$1 FOR UPDATE",
    values,
    tx,
  );
}

export function selectMonObligations(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT * FROM mon.obligations WHERE id=$1 FOR UPDATE",
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

export function selectProjectVersions(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT 1 FROM project.versions WHERE id=$1 AND project_id=$2 AND review_status='approved'",
    values,
    tx,
  );
}

export function selectMonFormVersions(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT 1 FROM mon.form_versions WHERE id=$1 AND status='approved'",
    values,
    tx,
  );
}

export function insertMonSubmissions(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "INSERT INTO mon.submissions(obligation_id,project_id,created_by) VALUES($1,$2,$3) RETURNING id",
    values,
    tx,
  );
}

export function insertMonSubmissionVersions(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "INSERT INTO mon.submission_versions(submission_id,project_id,project_version_id,revision) VALUES($1,$2,$3,1) RETURNING id,status",
    values,
    tx,
  );
}

export function selectMonFormFields(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `SELECT ff.required,ff.repeat_group,ff.field_code,ff.visibility_rule,iv.id,iv.value_type,iv.validation FROM mon.form_fields ff JOIN mon.indicator_versions iv ON iv.id=ff.indicator_version_id JOIN mon.obligations o ON o.form_version_id=ff.form_version_id JOIN mon.submissions s ON s.obligation_id=o.id WHERE s.id=$1 AND iv.approved_at IS NOT NULL ORDER BY ff.sort_order,ff.id`,
    values,
    tx,
  );
}

export function insertMonIndicatorValues(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    `INSERT INTO mon.indicator_values(submission_version_id,indicator_version_id,repeat_key,value_number,value_text,value_boolean,value_date,value_json,missing_reason) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT(submission_version_id,indicator_version_id,repeat_key) DO UPDATE SET value_number=excluded.value_number,value_text=excluded.value_text,value_boolean=excluded.value_boolean,value_date=excluded.value_date,value_json=excluded.value_json,missing_reason=excluded.missing_reason RETURNING id`,
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

export function selectSession(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `SELECT * FROM mon.${fragments[0]} WHERE submission_version_id=$1 ORDER BY id`,
    values,
    tx,
  );
}

export function selectMonBaselines(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT DISTINCT b.id,b.crop_id,b.plot_code,b.yield_t_ha,b.period_id,b.method_version_id,b.source_reference,b.comparability_notes FROM mon.baselines b JOIN mon.harvest_records h ON h.baseline_id=b.id WHERE h.submission_version_id=$1 ORDER BY b.id",
    values,
    tx,
  );
}

export function selectMonPeriods(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT p.* FROM mon.periods p JOIN mon.obligations o ON o.period_id=p.id JOIN mon.submissions sub ON sub.obligation_id=o.id WHERE sub.id=$1",
    values,
    tx,
  );
}

export function selectMonBaselines2(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT 1 FROM mon.baselines WHERE id=$1 AND project_id=$2 AND crop_id=$3 AND plot_code=$4",
    values,
    tx,
  );
}

export function selectDataFiles(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT 1 FROM data.files WHERE id=$1 AND scan_status='clean'",
    values,
    tx,
  );
}

export function updateMonSubmissionVersions2(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "UPDATE mon.submission_versions SET status='submitted',validation_status='passed',submitted_at=now(),submitted_by=$2,payload_hash=$3 WHERE id=$1",
    values,
    tx,
  );
}

export function insertMonValidationResults(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "INSERT INTO mon.validation_results(submission_version_id,rule_code,rule_version,payload_hash,severity,passed,message) VALUES($1,'full-payload','api-v2',$2,'info',true,'Form and domain checks passed')",
    values,
    tx,
  );
}

export function insertMonApiMetrics(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "INSERT INTO mon.api_metrics(submission_version_id,payload_hash,method_version,output) VALUES($1,$2,'descriptive-arithmetic-v1',$3)",
    values,
    tx,
  );
}

export function selectMonSubmissionVersions2(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT status FROM mon.submission_versions WHERE id=$1 FOR UPDATE",
    values,
    tx,
  );
}

export function updateMonSubmissionVersions3(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "UPDATE mon.submission_versions SET status='superseded' WHERE id=$1",
    values,
    tx,
  );
}

export function updateMonReleases(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "UPDATE mon.releases SET revoked_at=now() WHERE submission_version_id=$1 AND revoked_at IS NULL",
    values,
    tx,
  );
}

export function insertMonReviewEvents(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "INSERT INTO mon.review_events(submission_version_id,actor_id,action,reason) VALUES($1,$2,'supersede','Approved correction')",
    values,
    tx,
  );
}

export function updateMonSubmissionVersions4(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    `UPDATE mon.submission_versions SET status=$2,approved_by=CASE WHEN $2='approved' THEN $3::uuid END,approved_at=CASE WHEN $2='approved' THEN now() END WHERE id=$1`,
    values,
    tx,
  );
}

export function insertMonReviewEvents2(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "INSERT INTO mon.review_events(submission_version_id,actor_id,action,reason) VALUES($1,$2,$3,$4)",
    values,
    tx,
  );
}

export function selectMonSubmissions2(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT id FROM mon.submissions WHERE id=$1 FOR UPDATE",
    values,
    tx,
  );
}

export function selectMonSubmissionVersions3(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT 1 FROM mon.submission_versions WHERE submission_id=$1 AND status IN('draft','submitted')",
    values,
    tx,
  );
}

export function insertMonSubmissionVersions2(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "INSERT INTO mon.submission_versions(submission_id,project_id,project_version_id,revision,supersedes_id,note) SELECT $1,$2,$3,max(revision)+1,$4,$5 FROM mon.submission_versions WHERE submission_id=$1 RETURNING id,revision",
    values,
    tx,
  );
}

export function selectInformationSchemaColumns(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT column_name FROM information_schema.columns WHERE table_schema='mon' AND table_name=$1 AND column_name NOT IN('id','created_at','submission_version_id') ORDER BY ordinal_position",
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
    `INSERT INTO mon.${fragments[0]}(submission_version_id,${fragments[1]}) SELECT $2,${fragments[2]} FROM mon.${fragments[3]} WHERE submission_version_id=$1`,
    values,
    tx,
  );
}
