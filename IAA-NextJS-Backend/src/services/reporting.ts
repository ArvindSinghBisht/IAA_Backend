import * as repository from "@/repositories/reporting.repository";
import { z } from "zod";
import { unitOfWork as transaction } from "@/infrastructure/database/unit-of-work";
import { projectAccess, type Actor } from "@/lib/auth";
import { audit } from "@/lib/governance";
import { ApiError, uuid } from "@/lib/http";
export async function release(a: Actor, id: string, input: unknown) {
  uuid.parse(id);
  const p = z
    .object({
      action: z.enum(["release", "revoke"]),
      reason: z.string().trim().min(1).max(2000),
    })
    .strict()
    .parse(input);
  return transaction(async (c) => {
    const v = (await repository.selectMonSubmissionVersions([id], c)).rows[0];
    if (!v) throw new ApiError(404, "NOT_FOUND", "Return not found");
    await projectAccess(a, v.project_id, "review", c);
    if (p.action === "release") {
      if (v.status !== "approved")
        throw new ApiError(409, "INVALID_STATE", "Release an approved return");
      await repository.insertMonReleases([id, a.id, p.reason], c);
    } else await repository.updateMonReleases([id], c);
    await audit(c, a, "mon.submission_versions", id, p.action, {
      reason: p.reason,
    });
    return { id, action: p.action };
  });
}
export async function monitoringDashboard(a: Actor, id: string) {
  uuid.parse(id);
  await projectAccess(a, id, "read");
  return {
    data: (await repository.selectMonApprovedReturnVersions([id], undefined))
      .rows,
    meta: {
      aggregation:
        "Period/project facts are separate; overlapping reporting streams are not summed.",
    },
  };
}
export async function history(a: Actor, id: string) {
  uuid.parse(id);
  const v = (await repository.selectMonSubmissionVersions2([id], undefined))
    .rows[0];
  if (!v) throw new ApiError(404, "NOT_FOUND", "Return not found");
  await projectAccess(a, v.project_id, "read");
  return {
    data: (
      await repository.selectMonSubmissionVersions3(
        [v.submission_id],
        undefined,
      )
    ).rows,
    events: (
      await repository.selectMonReviewEvents([v.submission_id], undefined)
    ).rows,
  };
}
export async function planningReport(id: string, token: string | null) {
  const { getRuns } = await import("./planning");
  return {
    assessmentId: id,
    runs: await getRuns(id, token),
    generatedAt: new Date().toISOString(),
    format: "json",
    rendering:
      "Frontend may render this immutable input/output report for printing.",
  };
}
