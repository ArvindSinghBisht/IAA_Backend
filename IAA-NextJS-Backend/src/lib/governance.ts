import * as repository from "@/repositories/governance.repository";
import { randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import { isGlobal, type Actor } from "./auth";
import { ApiError } from "./http";
export function admin(a: Actor) {
  if (!isGlobal(a))
    throw new ApiError(
      403,
      "ADMIN_REQUIRED",
      "A global system administrator is required",
    );
}
export async function audit(
  c: PoolClient,
  a: Actor,
  table: string,
  id: string,
  action: string,
  detail: Record<string, unknown> = {},
) {
  await repository.insertOpsAuditEvents(
    [a.id, action, table, id, randomUUID(), JSON.stringify(detail)],
    c,
  );
}
export async function fileAccess(
  c: PoolClient,
  a: Actor,
  id: string,
  requireClean = true,
) {
  const f = (await repository.selectDataFiles([id], c)).rows[0];
  if (!f || (!isGlobal(a) && f.uploaded_by !== a.id))
    throw new ApiError(
      403,
      "FILE_ACCESS",
      "File must be uploaded by this actor",
    );
  if (requireClean && f.scan_status !== "clean")
    throw new ApiError(
      422,
      "FILE_NOT_CLEAN",
      "Evidence must pass file review before attachment",
    );
}
