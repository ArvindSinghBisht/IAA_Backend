import * as repository from "@/repositories/admin-workflow.repository";
import { z } from "zod";
import { unitOfWork as transaction } from "@/infrastructure/database/unit-of-work";
import type { Actor } from "@/lib/auth";
import { admin, audit } from "@/lib/governance";
import { ApiError, uuid } from "@/lib/http";
export async function datasetTransition(a: Actor, id: string, input: unknown) {
  admin(a);
  uuid.parse(id);
  const p = z
    .object({
      action: z.enum(["submit", "approve", "reject", "retire", "publish"]),
      reason: z.string().trim().min(1).max(2000),
      publicAllowed: z.boolean().optional(),
      planningAllowed: z.boolean().optional(),
      exportAllowed: z.boolean().optional(),
    })
    .strict()
    .parse(input);
  return transaction(async (c) => {
    const initial = (await repository.selectDataDatasetVersions([id], c))
      .rows[0];
    if (!initial)
      throw new ApiError(404, "NOT_FOUND", "Dataset version not found");
    await repository.selectDataDatasets([initial.dataset_id], c);
    const v = (await repository.selectDataDatasetVersions2([id], c)).rows[0];
    if (p.action === "submit") {
      if (v.status !== "draft")
        throw new ApiError(409, "INVALID_STATE", "Submit a draft dataset");
      await repository.updateDataDatasetVersions([id], c);
    }
    if (["approve", "reject"].includes(p.action)) {
      if (v.status !== "review")
        throw new ApiError(409, "INVALID_STATE", "Review a submitted dataset");
      const prior = (await repository.selectDataVersionEvents([id], c)).rows[0];
      if (prior?.actor_id === a.id)
        throw new ApiError(
          403,
          "SELF_REVIEW",
          "A different administrator must review",
        );
      if (p.action === "approve") {
        const issues = await repository.selectDataQualityIssues([id], c);
        if (issues.rowCount)
          throw new ApiError(
            422,
            "IMPORT_ISSUES",
            "Resolve error-level import issues before approval",
          );
        await repository.updateDataDatasetVersions2([id, a.id], c);
      } else await repository.updateDataDatasetVersions3([id], c);
    }
    if (p.action === "publish") {
      if (v.status !== "approved" || v.is_demo)
        throw new ApiError(
          409,
          "INVALID_STATE",
          "Publish an approved, non-demo dataset",
        );
      if (
        p.publicAllowed === undefined ||
        p.planningAllowed === undefined ||
        p.exportAllowed === undefined
      )
        throw new ApiError(
          400,
          "PERMISSIONS_REQUIRED",
          "Set all three publication permissions explicitly",
        );
      await repository.updateDataDatasetVersions4([v.dataset_id], c);
      await repository.updateDataDatasetVersions5(
        [id, p.publicAllowed, p.planningAllowed, p.exportAllowed],
        c,
      );
    }
    if (p.action === "retire") {
      await repository.updateDataDatasetVersions6([id], c);
    }
    await repository.insertDataVersionEvents([id, a.id, p.action, p.reason], c);
    await audit(c, a, "data.dataset_versions", id, p.action);
    return { id, action: p.action };
  });
}
export async function approveDefinition(
  a: Actor,
  kind: string,
  id: string,
  input: unknown,
) {
  admin(a);
  uuid.parse(id);
  const p = z
    .object({
      action: z.enum(["approve", "retire"]),
      reason: z.string().trim().min(1).max(2000),
    })
    .strict()
    .parse(input);
  const tables = {
    methods: "plan.method_versions",
    forms: "mon.form_versions",
    indicators: "mon.indicator_versions",
  };
  const table = Object.hasOwn(tables, kind)
    ? tables[kind as keyof typeof tables]
    : undefined;
  if (!table) throw new ApiError(404, "NOT_FOUND", "Unknown definition");
  return transaction(async (c) => {
    const row = (await repository.selectSession([id], c, [table])).rows[0];
    if (!row) throw new ApiError(404, "NOT_FOUND", "Definition not found");
    if (p.action === "approve") {
      if (
        kind === "forms" &&
        (await repository.selectMonFormFields([id], c)).rowCount
      )
        throw new ApiError(
          422,
          "DUPLICATE_INDICATOR",
          "Use one field definition per indicator version",
        );
      if (row.approved_at)
        throw new ApiError(
          409,
          "ALREADY_APPROVED",
          "Definition already approved",
        );
      if (
        kind === "forms" &&
        !(await repository.selectMonFormFields2([id], c)).rowCount
      ) {
        if (!(await repository.selectMonFormFields3([id], c)).rowCount)
          throw new ApiError(422, "EMPTY_FORM", "Add form fields first");
      } else if (kind === "forms")
        throw new ApiError(
          422,
          "UNAPPROVED_FIELDS",
          "Approve all indicators first",
        );
      await repository.updateSession([id, a.id], c, [
        table,
        kind === "indicators" ? "" : ",status='approved'",
      ]);
    } else {
      if (kind === "indicators")
        throw new ApiError(
          405,
          "IMMUTABLE",
          "Create a new indicator version; do not retire pinned definitions",
        );
      await repository.updateSession2([id], c, [table]);
    }
    await audit(c, a, table, id, p.action, { reason: p.reason });
    return { id, action: p.action };
  });
}
export async function auditLog(a: Actor) {
  admin(a);
  return { data: (await repository.selectOpsAuditEvents([], undefined)).rows };
}
