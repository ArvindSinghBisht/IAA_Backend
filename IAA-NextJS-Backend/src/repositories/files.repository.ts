import type { PoolClient } from "pg";
import { execute } from "@/infrastructure/database/connection";

export function insertDataFiles(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "INSERT INTO data.files(object_key,original_name,mime_type,byte_size,sha256,uploaded_by) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,original_name,mime_type,byte_size,scan_status",
    values,
    tx,
  );
}

export function insertDataFilePayloads(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "INSERT INTO data.file_payloads(file_id,content) VALUES($1,$2)",
    values,
    tx,
  );
}

export function updateDataFiles(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "UPDATE data.files SET scan_status=$2 WHERE id=$1 AND scan_status='pending' RETURNING id,scan_status",
    values,
    tx,
  );
}

export function selectDataFiles(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT f.*,p.content FROM data.files f JOIN data.file_payloads p ON p.file_id=f.id WHERE f.id=$1",
    values,
    tx,
  );
}

export function selectProjectDocuments(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    `SELECT v.project_id FROM project.documents d JOIN project.versions v ON v.id=d.project_version_id WHERE d.file_id=$1 UNION SELECT v.project_id FROM mon.evidence e JOIN mon.submission_versions v ON v.id=e.submission_version_id WHERE e.file_id=$1`,
    values,
    tx,
  );
}

export function selectDataFiles2(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `SELECT f.mime_type,p.content,f.id FROM data.files f JOIN data.file_payloads p ON p.file_id=f.id WHERE f.id=$1 AND f.scan_status='clean' AND (
 EXISTS(SELECT 1 FROM content.resource_versions rv JOIN data.dataset_versions v ON v.id=rv.dataset_version_id JOIN data.datasets d ON d.id=v.dataset_id WHERE rv.file_id=f.id AND v.status='approved' AND v.is_current AND v.public_allowed AND NOT v.is_demo AND d.is_active)
 OR EXISTS(SELECT 1 FROM content.policy_versions pv JOIN data.dataset_versions v ON v.id=pv.dataset_version_id JOIN data.datasets d ON d.id=v.dataset_id WHERE pv.file_id=f.id AND v.status='approved' AND v.is_current AND v.public_allowed AND NOT v.is_demo AND d.is_active)
 OR EXISTS(SELECT 1 FROM project.documents pd JOIN project.versions v ON v.id=pd.project_version_id JOIN project.projects pr ON pr.id=v.project_id JOIN project.publications pub ON pub.project_version_id=v.id WHERE pd.file_id=f.id AND pd.public_allowed AND v.review_status='approved' AND NOT pr.is_demo AND pr.archived_at IS NULL AND pub.revoked_at IS NULL AND pub.public_fields ? 'documents'))`,
    values,
    tx,
  );
}
