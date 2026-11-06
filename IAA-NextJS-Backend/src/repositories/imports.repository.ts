import type { PoolClient } from "pg";
import { execute } from "@/infrastructure/database/connection";

export function selectDataFiles(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT f.*,p.content FROM data.files f JOIN data.file_payloads p ON p.file_id=f.id WHERE f.id=$1 AND f.scan_status='clean'",
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

export function selectDataImportJobs(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT * FROM data.import_jobs WHERE idempotency_key=$1",
    values,
    tx,
  );
}

export function insertDataImportJobs(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `INSERT INTO data.import_jobs(version_id,started_by,status,parser_version,mapping,idempotency_key) VALUES($1,$2,'running','xlsx-csv-v1',$3,$4) RETURNING id`,
    values,
    tx,
  );
}

export function insertDataSourceRecords(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "INSERT INTO data.source_records(import_job_id,sheet_name,row_number,raw_cells) VALUES($1,$2,$3,$4) RETURNING id",
    values,
    tx,
  );
}

export function savepointSession(values: unknown[] = [], tx?: PoolClient) {
  return execute("SAVEPOINT import_row", values, tx);
}

export function updateDataSourceRecords(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "UPDATE data.source_records SET status='accepted',normalised_payload=$2 WHERE id=$1",
    values,
    tx,
  );
}

export function releaseSession(values: unknown[] = [], tx?: PoolClient) {
  return execute("RELEASE SAVEPOINT import_row", values, tx);
}

export function rollbackSession(values: unknown[] = [], tx?: PoolClient) {
  return execute("ROLLBACK TO SAVEPOINT import_row", values, tx);
}

export function updateDataSourceRecords2(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "UPDATE data.source_records SET status='quarantined' WHERE id=$1",
    values,
    tx,
  );
}

export function insertDataQualityIssues(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "INSERT INTO data.quality_issues(source_record_id,issue_code,severity,message) VALUES($1,'ROW_VALIDATION','error','Row failed field mapping, type, reference or constraint validation. Review original cells.')",
    values,
    tx,
  );
}

export function releaseSession2(values: unknown[] = [], tx?: PoolClient) {
  return execute("RELEASE SAVEPOINT import_row", values, tx);
}

export function updateDataImportJobs(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "UPDATE data.import_jobs SET status='completed',finished_at=now(),row_counts=$2 WHERE id=$1 RETURNING id,status,row_counts",
    values,
    tx,
  );
}

export function selectDataQualityIssues(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT r.*,COALESCE((SELECT jsonb_agg(q) FROM data.quality_issues q WHERE q.source_record_id=r.id),'[]'::jsonb) AS issues FROM data.source_records r WHERE import_job_id=$1 ORDER BY row_number LIMIT $2 OFFSET $3",
    values,
    tx,
  );
}

export function updateDataQualityIssues(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "UPDATE data.quality_issues SET resolved_by=$2,resolved_at=now(),resolution=$3 WHERE id=$1 AND resolved_at IS NULL RETURNING id",
    values,
    tx,
  );
}
