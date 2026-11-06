import * as repository from "@/repositories/monitoring.repository";
import { z } from "zod";
import type { PoolClient } from "pg";
import { unitOfWork as transaction } from "@/infrastructure/database/unit-of-work";
import { projectAccess, type Actor } from "@/lib/auth";
import { audit } from "@/lib/governance";
import { ApiError, uuid } from "@/lib/http";
import {
  digest,
  validateValue,
  validateForm,
  calculateMonitoring,
  type Field,
  type Value,
} from "./monitoring-validation";
export const payloadTables = [
  "indicator_values",
  "energy_records",
  "harvest_records",
  "participation_records",
  "inclusion_totals",
  "income_records",
  "land_records",
  "practice_records",
  "scheme_linkages",
  "progress_records",
  "evidence",
];
async function revision(
  c: PoolClient,
  a: Actor,
  id: string,
  mode: "read" | "edit" | "review",
) {
  uuid.parse(id);
  const v = (await repository.selectMonSubmissionVersions([id], c)).rows[0];
  if (!v) throw new ApiError(404, "NOT_FOUND", "Revision not found");
  await projectAccess(a, v.project_id, mode, c);
  return v;
}
export async function createDraft(a: Actor, input: unknown) {
  const p = z
    .object({ obligationId: uuid, projectVersionId: uuid })
    .strict()
    .parse(input);
  return transaction(async (c) => {
    const o = (await repository.selectMonObligations([p.obligationId], c))
      .rows[0];
    if (!o) throw new ApiError(404, "NOT_FOUND", "Obligation not found");
    await projectAccess(a, o.project_id, "edit", c);
    if (o.waived_at)
      throw new ApiError(409, "OBLIGATION_WAIVED", "This return is waived");
    if ((await repository.selectMonSubmissions([o.id], c)).rowCount)
      throw new ApiError(
        409,
        "RETURN_EXISTS",
        "Use the existing return or create its correction revision",
      );
    if (
      !(
        await repository.selectProjectVersions(
          [p.projectVersionId, o.project_id],
          c,
        )
      ).rowCount
    )
      throw new ApiError(
        400,
        "INVALID_BASELINE",
        "Use an approved project baseline",
      );
    if (
      !(await repository.selectMonFormVersions([o.form_version_id], c)).rowCount
    )
      throw new ApiError(
        422,
        "FORM_NOT_APPROVED",
        "Approve the reporting form first",
      );
    const s = (
      await repository.insertMonSubmissions([o.id, o.project_id, a.id], c)
    ).rows[0];
    const row = (
      await repository.insertMonSubmissionVersions(
        [s.id, o.project_id, p.projectVersionId],
        c,
      )
    ).rows[0];
    await audit(c, a, "mon.submission_versions", row.id, "draft_created");
    return row;
  });
}
async function fields(c: PoolClient, submissionId: string) {
  return (await repository.selectMonFormFields([submissionId], c))
    .rows as Field[];
}
const valueInput = z
  .object({
    indicatorVersionId: uuid,
    repeatKey: z
      .string()
      .regex(/^[A-Za-z0-9_:.\-]{1,100}$/)
      .default("site"),
    valueNumber: z.number().finite().optional(),
    valueText: z.string().max(30000).optional(),
    valueBoolean: z.boolean().optional(),
    valueDate: z.iso.date().optional(),
    valueJson: z.json().optional(),
    missingReason: z.string().trim().min(1).max(1000).optional(),
  })
  .strict()
  .refine((v) => {
    const n = [
      v.valueNumber,
      v.valueText,
      v.valueBoolean,
      v.valueDate,
      v.valueJson,
    ].filter((x) => x !== undefined).length;
    return (n === 1 && !v.missingReason) || (n === 0 && !!v.missingReason);
  }, "Supply exactly one value or a missing reason");
export async function saveValue(a: Actor, id: string, input: unknown) {
  const p = valueInput.parse(input);
  return transaction(async (c) => {
    const v = await revision(c, a, id, "edit");
    if (v.status !== "draft")
      throw new ApiError(409, "IMMUTABLE", "Only drafts are editable");
    const f = (await fields(c, v.submission_id)).find(
      (f) => f.id === p.indicatorVersionId,
    );
    if (!f)
      throw new ApiError(
        400,
        "INVALID_INDICATOR",
        "Indicator is not approved in this form",
      );
    if (!f.repeat_group && p.repeatKey !== "site")
      throw new ApiError(
        400,
        "REPEAT_KEY",
        "Non-repeating field requires site",
      );
    const supplied =
      p.valueNumber !== undefined
        ? "number"
        : p.valueBoolean !== undefined
          ? "boolean"
          : p.valueDate !== undefined
            ? "date"
            : p.valueJson !== undefined
              ? "json"
              : "text";
    if (
      !p.missingReason &&
      f.value_type !== supplied &&
      !(f.value_type === "choice" && supplied === "text")
    )
      throw new ApiError(400, "TYPE_MISMATCH", "Use the declared typed value");
    const val: Value = {
      indicator_version_id: p.indicatorVersionId,
      repeat_key: p.repeatKey,
      value_number: p.valueNumber,
      value_text: p.valueText,
      value_boolean: p.valueBoolean,
      value_date: p.valueDate,
      value_json: p.valueJson,
      missing_reason: p.missingReason,
    };
    const issues = validateValue(f, val);
    if (issues.length)
      throw new ApiError(422, "VALUE_INVALID", issues.join("; "));
    const row = (
      await repository.insertMonIndicatorValues(
        [
          id,
          p.indicatorVersionId,
          p.repeatKey,
          p.valueNumber ?? null,
          p.valueText ?? null,
          p.valueBoolean ?? null,
          p.valueDate ?? null,
          p.valueJson === undefined ? null : JSON.stringify(p.valueJson),
          p.missingReason ?? null,
        ],
        c,
      )
    ).rows[0];
    await repository.updateMonSubmissionVersions([id], c);
    await audit(c, a, "mon.submission_versions", id, "value_saved");
    return row;
  });
}
async function snapshot(c: PoolClient, id: string) {
  const out: Record<string, Record<string, unknown>[]> = {};
  for (const table of payloadTables)
    out[table] = (await repository.selectSession([id], c, [table])).rows;
  out.baseline_context = (await repository.selectMonBaselines([id], c)).rows;
  return out;
}
async function validate(c: PoolClient, v: Record<string, any>) {
  const s = await snapshot(c, v.id),
    issues = validateForm(
      await fields(c, v.submission_id),
      s.indicator_values as Value[],
      s.evidence as { indicator_version_id: string | null }[],
    );
  const p = (await repository.selectMonPeriods([v.submission_id], c)).rows[0];
  const start = Date.parse(p.start_date),
    end = Date.parse(p.end_date) + 86400000;
  for (const e of s.energy_records) {
    if (
      Date.parse(String(e.start_at)) < start ||
      Date.parse(String(e.end_at)) > end ||
      Date.parse(String(e.end_at)) <= Date.parse(String(e.start_at))
    )
      issues.push({
        field: "energy",
        message: "Energy segment is outside reporting period",
      });
    if (
      Number(e.export_mwh ?? 0) + Number(e.onsite_mwh ?? 0) >
      Number(e.generation_mwh)
    )
      issues.push({
        field: "energy",
        message: "Export plus onsite consumption exceeds generation",
      });
    const hours =
      (Date.parse(String(e.end_at)) - Date.parse(String(e.start_at))) / 3600000;
    if (Number(e.reference_hours) > hours + 0.01)
      issues.push({
        field: "energy",
        message: "Reference hours exceed segment duration",
      });
  }
  const sorted = [...s.energy_records].sort(
    (a, b) => Date.parse(String(a.start_at)) - Date.parse(String(b.start_at)),
  );
  for (let i = 1; i < sorted.length; i++)
    if (
      Date.parse(String(sorted[i].start_at)) <
      Date.parse(String(sorted[i - 1].end_at))
    )
      issues.push({
        field: "energy",
        message:
          "Energy segments overlap; aggregate meter segments must not double count",
      });
  for (const h of s.harvest_records) {
    if (
      h.harvest_date &&
      (Date.parse(String(h.harvest_date)) < start ||
        Date.parse(String(h.harvest_date)) >= end)
    )
      issues.push({
        field: "harvest",
        message: "Harvest date is outside reporting period",
      });
    if (
      h.baseline_id &&
      !(
        await repository.selectMonBaselines2(
          [h.baseline_id, v.project_id, h.crop_id, h.plot_code],
          c,
        )
      ).rowCount
    )
      issues.push({ field: "harvest", message: "Baseline mismatch" });
  }
  if (s.participation_records.length && s.inclusion_totals.length)
    issues.push({
      field: "inclusion",
      message:
        "Choose person records or aggregate totals to avoid double counting",
    });
  for (const e of s.evidence)
    if (!(await repository.selectDataFiles([e.file_id], c)).rowCount)
      issues.push({ field: "evidence", message: "Evidence file is not clean" });
  return {
    snapshot: s,
    hash: digest(s),
    issues,
    metrics: calculateMonitoring(s),
  };
}
export async function validateRevision(a: Actor, id: string) {
  return transaction(async (c) => {
    const v = await revision(c, a, id, "read");
    const result = await validate(c, v);
    return {
      id,
      payloadHash: result.hash,
      valid: !result.issues.length,
      issues: result.issues,
      metrics: result.metrics,
    };
  });
}
export async function transition(a: Actor, id: string, input: unknown) {
  const p = z
    .object({
      action: z.enum(["submit", "return", "approve", "reject"]),
      reason: z.string().trim().min(1).max(2000).optional(),
    })
    .strict()
    .parse(input);
  return transaction(async (c) => {
    const v = await revision(
      c,
      a,
      id,
      p.action === "submit" ? "edit" : "review",
    );
    if (p.action === "submit") {
      if (v.status !== "draft")
        throw new ApiError(
          409,
          "INVALID_STATE",
          "Only drafts may be submitted",
        );
      const result = await validate(c, v);
      if (result.issues.length)
        throw new ApiError(
          422,
          "VALIDATION_FAILED",
          result.issues.map((i) => i.field + ": " + i.message).join("; "),
        );
      await repository.updateMonSubmissionVersions2([id, a.id, result.hash], c);
      await repository.insertMonValidationResults([id, result.hash], c);
      await repository.insertMonApiMetrics(
        [id, result.hash, JSON.stringify(result.metrics)],
        c,
      );
    } else {
      if (v.status !== "submitted")
        throw new ApiError(
          409,
          "INVALID_STATE",
          "Review requires a submitted return",
        );
      if (v.submitted_by === a.id)
        throw new ApiError(
          403,
          "SELF_REVIEW",
          "A different reviewer must decide",
        );
      if (p.action !== "approve" && !p.reason)
        throw new ApiError(
          400,
          "REASON_REQUIRED",
          "Explain the review decision",
        );
      const state = {
        approve: "approved",
        return: "returned",
        reject: "rejected",
      }[p.action];
      if (p.action === "approve") {
        const check = await validate(c, v);
        if (check.issues.length || check.hash !== v.payload_hash)
          throw new ApiError(
            422,
            "PAYLOAD_MISMATCH",
            "Sealed payload or validation changed",
          );
        if (v.supersedes_id) {
          const old = (
            await repository.selectMonSubmissionVersions2([v.supersedes_id], c)
          ).rows[0];
          if (old?.status === "approved") {
            await repository.updateMonSubmissionVersions3([v.supersedes_id], c);
            await repository.updateMonReleases([v.supersedes_id], c);
            await repository.insertMonReviewEvents([v.supersedes_id, a.id], c);
          }
        }
      }
      await repository.updateMonSubmissionVersions4([id, state, a.id], c);
    }
    await repository.insertMonReviewEvents2(
      [id, a.id, p.action, p.reason ?? null],
      c,
    );
    await audit(c, a, "mon.submission_versions", id, p.action);
    return { id, action: p.action };
  });
}
export async function correction(a: Actor, id: string, input: unknown) {
  const p = z
    .object({ reason: z.string().trim().min(1).max(2000) })
    .strict()
    .parse(input);
  return transaction(async (c) => {
    const v = await revision(c, a, id, "edit");
    await repository.selectMonSubmissions2([v.submission_id], c);
    if (!["returned", "rejected", "approved"].includes(v.status))
      throw new ApiError(
        409,
        "INVALID_STATE",
        "Correct a returned, rejected or approved return",
      );
    if (
      (await repository.selectMonSubmissionVersions3([v.submission_id], c))
        .rowCount
    )
      throw new ApiError(
        409,
        "ACTIVE_REVISION",
        "A draft or review already exists",
      );
    const r = (
      await repository.insertMonSubmissionVersions2(
        [v.submission_id, v.project_id, v.project_version_id, id, p.reason],
        c,
      )
    ).rows[0];
    for (const table of payloadTables) {
      const cols = (
        await repository.selectInformationSchemaColumns([table], c)
      ).rows.map((x) => x.column_name);
      await repository.insertSession([id, r.id], c, [table, cols, cols, table]);
    }
    await audit(c, a, "mon.submission_versions", r.id, "correction_created", {
      supersedes: id,
    });
    return r;
  });
}
