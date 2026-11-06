import * as repository from "@/repositories/system.repository";
import { projectAccess, type Actor } from "@/lib/auth";
import { ApiError } from "@/lib/http";
export function health() {
  return { status: "ok", service: "iaa-api", version: "0.3.0" };
}
export async function readiness() {
  try {
    await repository.ping();
    return { status: "ready" };
  } catch {
    throw new ApiError(
      503,
      "DATABASE_UNAVAILABLE",
      "Database is not ready. Check server configuration and migrations.",
    );
  }
}
export async function projectVersions(actor: Actor, id: string) {
  await projectAccess(actor, id, "read");
  return { data: (await repository.projectVersions(id)).rows };
}
export async function submission(actor: Actor, id: string) {
  const row = (await repository.revision(id)).rows[0];
  if (!row) throw new ApiError(404, "NOT_FOUND", "Revision not found");
  await projectAccess(actor, row.project_id, "read");
  return { data: { ...row, values: (await repository.values(id)).rows } };
}
