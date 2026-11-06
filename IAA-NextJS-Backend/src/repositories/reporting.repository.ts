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

export function insertMonReleases(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `INSERT INTO mon.releases(submission_version_id,approved_by,audience,field_whitelist,privacy_rule_version,reason) VALUES($1,$2,'authorised','["energy","harvest","land","income","inclusion","progress"]','restricted-project-v1',$3)`,
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

export function selectMonApprovedReturnVersions(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    `SELECT v.id,v.project_id,p.code AS period_code,p.start_date,p.end_date,o.reporting_stream,v.approved_at,m.payload_hash,m.method_version,m.output FROM mon.approved_return_versions r JOIN mon.submission_versions v ON v.id=r.id JOIN mon.submissions s ON s.id=v.submission_id JOIN mon.obligations o ON o.id=s.obligation_id JOIN mon.periods p ON p.id=o.period_id JOIN mon.api_metrics m ON m.submission_version_id=v.id WHERE v.project_id=$1 ORDER BY p.start_date DESC LIMIT 100`,
    values,
    tx,
  );
}

export function selectMonSubmissionVersions2(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT project_id,submission_id FROM mon.submission_versions WHERE id=$1",
    values,
    tx,
  );
}

export function selectMonSubmissionVersions3(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT id,revision,status,submitted_at,approved_at,supersedes_id,note FROM mon.submission_versions WHERE submission_id=$1 ORDER BY revision",
    values,
    tx,
  );
}

export function selectMonReviewEvents(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT e.actor_id,e.action,e.reason,e.created_at,e.submission_version_id FROM mon.review_events e JOIN mon.submission_versions v ON v.id=e.submission_version_id WHERE v.submission_id=$1 ORDER BY e.created_at",
    values,
    tx,
  );
}
