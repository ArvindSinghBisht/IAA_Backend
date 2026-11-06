import type { PoolClient } from "pg";
import { execute } from "@/infrastructure/database/connection";

export function insertOpsAuditEvents(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "INSERT INTO ops.audit_events(actor_id,action,target_table,target_id,request_id,redacted_change) VALUES($1,$2,$3,$4,$5,$6)",
    values,
    tx,
  );
}

export function selectDataFiles(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT id,uploaded_by,scan_status FROM data.files WHERE id=$1",
    values,
    tx,
  );
}
