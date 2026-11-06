import {
  identifier as quoted,
  selectColumns,
  insertExpressions,
  updateAssignments,
} from "@/repositories/resource-sql";
import * as repository from "@/repositories/resources.repository";
import { z } from "zod";
import type { PoolClient } from "pg";
import definitions from "@/generated/resources.json";
import { unitOfWork as transaction } from "@/infrastructure/database/unit-of-work";
import { projectAccess, type Actor } from "@/lib/auth";
import { admin, audit, fileAccess } from "@/lib/governance";
import { ApiError, pageQuery, uuid } from "@/lib/http";
type Column = {
  type: string;
  required: boolean;
  nullable: boolean;
  default: boolean;
  references?: string;
  enum?: string[];
};
type Definition = { scope: string; columns: Record<string, Column> };

export function validCoordinates(value: unknown, depth = 0): boolean {
  if (!Array.isArray(value) || !value.length || depth > 5) return false;
  if (typeof value[0] === "number")
    return (
      value.length >= 2 &&
      value.length <= 3 &&
      value.every((x) => typeof x === "number" && Number.isFinite(x)) &&
      value[0] >= -180 &&
      value[0] <= 180 &&
      value[1] >= -90 &&
      value[1] <= 90
    );
  return value.every((x) => validCoordinates(x, depth + 1));
}
export const resources = definitions as Record<string, Definition>;
export function definition(key: string) {
  if (!Object.hasOwn(resources, key))
    throw new ApiError(404, "RESOURCE_NOT_FOUND", "Unknown resource");
  return resources[key];
}
const reserved = new Set([
  "id",
  "created_at",
  "approved_at",
  "approved_by",
  "status",
  "is_current",
  "public_allowed",
  "planning_allowed",
  "export_allowed",
]);
const stateTables = new Set([
  "data.dataset_versions",
  "plan.method_versions",
  "mon.form_versions",
]);
export function resourceInput(key: string, input: unknown, patch = false) {
  const d = definition(key),
    shape: Record<string, z.ZodType> = {};
  for (const [name, c] of Object.entries(d.columns)) {
    if (
      ["id", "created_at", "approved_at", "approved_by"].includes(name) ||
      (stateTables.has(key) && reserved.has(name))
    )
      continue;
    let t: z.ZodType;
    if (c.enum) t = z.enum(c.enum as [string, ...string[]]);
    else if (c.type === "uuid") t = uuid;
    else if (["smallint", "integer", "bigint"].includes(c.type))
      t = z.number().int().min(-2147483648).max(2147483647);
    else if (c.type.startsWith("numeric")) t = z.number().finite();
    else if (c.type === "boolean") t = z.boolean();
    else if (c.type === "date") t = z.iso.date();
    else if (c.type === "timestamptz") t = z.iso.datetime({ offset: true });
    else if (c.type === "jsonb") t = z.json();
    else if (c.type.startsWith("geometry"))
      t = z
        .object({
          type: z.enum([
            "Point",
            "LineString",
            "MultiLineString",
            "Polygon",
            "MultiPolygon",
          ]),
          coordinates: z
            .array(z.unknown())
            .refine(
              (v) => validCoordinates(v),
              "Coordinates must be finite EPSG:4326 longitude/latitude positions",
            ),
        })
        .strict();
    else t = z.string().max(30000);
    if (c.nullable) t = t.nullable();
    if (patch || !c.required) t = t.optional();
    shape[name] = t;
  }
  return z.object(shape).strict().parse(input) as Record<string, unknown>;
}
export { selectColumns } from "@/repositories/resource-sql";
export async function insertResource(
  c: PoolClient,
  key: string,
  input: unknown,
) {
  const p = resourceInput(key, input),
    columns = Object.keys(p);
  if (!columns.length)
    throw new ApiError(400, "EMPTY_INPUT", "Supply resource fields");
  const vals = columns.map((n) =>
    typeof p[n] === "object" && p[n] !== null ? JSON.stringify(p[n]) : p[n],
  );
  const expr = insertExpressions(key, columns);
  return (
    await repository.insertSession(vals, c, [key, columns.map(quoted), expr])
  ).rows[0];
}
async function guard(
  c: PoolClient,
  a: Actor,
  key: string,
  p: Record<string, unknown>,
  write: boolean,
) {
  const d = definition(key);
  if (d.scope === "admin") {
    admin(a);
    if (
      write &&
      key === "mon.periods" &&
      p.id &&
      (await repository.selectMonObligations([p.id], c)).rowCount
    )
      throw new ApiError(
        409,
        "PERIOD_PINNED",
        "Reporting period is already referenced",
      );
    if (write && p.form_version_id) {
      const form = (
        await repository.selectMonFormVersions([p.form_version_id], c)
      ).rows[0];
      if (form?.status !== "draft")
        throw new ApiError(
          409,
          "IMMUTABLE",
          "Only draft form definitions are editable",
        );
    }
    if (write && p.method_version_id) {
      const m = (
        await repository.selectPlanMethodVersions([p.method_version_id], c)
      ).rows[0];
      if (m?.status !== "draft" && key === "plan.criteria")
        throw new ApiError(
          409,
          "IMMUTABLE",
          "Only draft method criteria are editable",
        );
    }
    if (write && key === "geo.features") {
      const l = (await repository.selectGeoLayers([p.layer_id], c)).rows[0];
      if (!l) throw new ApiError(400, "LAYER_REQUIRED", "Layer does not exist");
      p = { ...p, dataset_version_id: l.dataset_version_id };
    }
    if (
      write &&
      p.source_record_id &&
      p.dataset_version_id &&
      !(
        await repository.selectDataSourceRecords(
          [p.source_record_id, p.dataset_version_id],
          c,
        )
      ).rowCount
    )
      throw new ApiError(
        400,
        "SOURCE_VERSION_MISMATCH",
        "Source row belongs to another dataset version",
      );
    if (p.dataset_version_id) {
      const v = (
        await repository.selectDataDatasetVersions([p.dataset_version_id], c)
      ).rows[0];
      if (write && v?.status !== "draft")
        throw new ApiError(
          409,
          "IMMUTABLE",
          "Only draft dataset rows are editable",
        );
    }
    return;
  }
  if (d.scope === "profile") {
    const v = (
      await repository.selectProjectVersions([p.project_version_id], c)
    ).rows[0];
    if (!v) throw new ApiError(404, "NOT_FOUND", "Profile not found");
    await projectAccess(a, v.project_id, write ? "edit" : "read", c);
    if (write && v.review_status !== "draft")
      throw new ApiError(409, "IMMUTABLE", "Only draft profiles are editable");
  }
  if (d.scope === "submission") {
    const v = (
      await repository.selectMonSubmissionVersions([p.submission_version_id], c)
    ).rows[0];
    if (!v) throw new ApiError(404, "NOT_FOUND", "Revision not found");
    await projectAccess(a, v.project_id, write ? "edit" : "read", c);
    if (write && v.status !== "draft")
      throw new ApiError(409, "IMMUTABLE", "Only drafts are editable");
    if (write && p.baseline_id) {
      const b = (await repository.selectMonBaselines([p.baseline_id], c))
        .rows[0];
      if (
        !b ||
        b.project_id !== v.project_id ||
        b.crop_id !== p.crop_id ||
        b.plot_code !== p.plot_code
      )
        throw new ApiError(
          400,
          "BASELINE_MISMATCH",
          "Baseline must match project, crop and plot",
        );
    }
    if (write && p.beneficiary_id) {
      if (
        !(
          await repository.selectMonProjectBeneficiaries(
            [v.project_id, p.beneficiary_id],
            c,
          )
        ).rowCount
      )
        throw new ApiError(
          400,
          "BENEFICIARY_MISMATCH",
          "Beneficiary is not linked to this project",
        );
    }
  }
  if (d.scope === "project") {
    if (
      write &&
      key === "mon.obligations" &&
      p.id &&
      (await repository.selectMonSubmissions([p.id], c)).rowCount
    )
      throw new ApiError(
        409,
        "OBLIGATION_PINNED",
        "An obligation with a return cannot be changed",
      );
    await projectAccess(
      a,
      uuid.parse(p.project_id),
      write ? "edit" : "read",
      c,
    );
    if (
      write &&
      [
        "mon.obligations",
        "mon.baselines",
        "mon.project_beneficiaries",
      ].includes(key)
    )
      admin(a);
    if (
      write &&
      key === "mon.baselines" &&
      p.id &&
      (await repository.selectMonHarvestRecords([p.id], c)).rowCount
    )
      throw new ApiError(
        409,
        "BASELINE_PINNED",
        "A referenced baseline is immutable",
      );
  }
  if (write)
    for (const n of ["file_id", "approval_file_id", "source_file_id"])
      if (p[n]) await fileAccess(c, a, String(p[n]));
}
export async function resourceList(
  a: Actor,
  key: string,
  params: Record<string, string>,
) {
  const d = definition(key),
    p = pageQuery.extend({ parentId: uuid.optional() }).parse(params);
  return transaction(async (c) => {
    const parent =
      d.scope === "profile"
        ? "project_version_id"
        : d.scope === "submission"
          ? "submission_version_id"
          : d.scope === "project"
            ? "project_id"
            : undefined;
    if (parent && !p.parentId)
      throw new ApiError(
        400,
        "PARENT_REQUIRED",
        "parentId is required for scoped resources",
      );
    await guard(c, a, key, parent ? { [parent]: p.parentId } : {}, false);
    const rows = await repository.selectSession(
      parent ? [p.limit, p.offset, p.parentId] : [p.limit, p.offset],
      c,
      [selectColumns(key), key, parent ? "WHERE " + parent + "=$3" : ""],
    );
    return { data: rows.rows, meta: p };
  });
}
export async function resourceWrite(
  a: Actor,
  key: string,
  input: unknown,
  id?: string,
  remove = false,
) {
  const d = definition(key);
  if (id) uuid.parse(id);
  return transaction(async (c) => {
    const old = id
      ? (await repository.selectSession2([id], c, [key])).rows[0]
      : undefined;
    if (id && !old) throw new ApiError(404, "NOT_FOUND", "Record not found");
    const p = remove ? {} : resourceInput(key, input, !!id);
    const merged = { ...old, ...p };
    for (const parent of [
      "project_version_id",
      "submission_version_id",
      "project_id",
      "dataset_version_id",
      "form_version_id",
      "method_version_id",
      "layer_id",
    ])
      if (old && p[parent] !== undefined && p[parent] !== old[parent])
        throw new ApiError(400, "PARENT_IMMUTABLE", "Parent cannot change");
    await guard(c, a, key, merged, true);
    if (
      old &&
      ((stateTables.has(key) && old.status !== "draft") ||
        (["mon.indicator_versions"].includes(key) && old.approved_at))
    )
      throw new ApiError(
        409,
        "IMMUTABLE",
        "Approved or reviewed definitions cannot be edited",
      );
    if (remove && d.scope === "admin")
      throw new ApiError(
        405,
        "DELETE_DISABLED",
        "Retire reference data rather than deleting history",
      );
    let result;
    if (remove) {
      await repository.deleteSession([id], c, [key]);
      result = { id, deleted: true };
    } else if (id) {
      const names = Object.keys(p);
      if (!names.length)
        throw new ApiError(400, "EMPTY_INPUT", "No changes supplied");
      const vals = names.map((n) =>
        typeof p[n] === "object" && p[n] !== null ? JSON.stringify(p[n]) : p[n],
      );
      const assignments = updateAssignments(key, names);
      result = (
        await repository.updateSession([id, ...vals], c, [key, assignments])
      ).rows[0];
    } else result = await insertResource(c, key, p);
    if (d.scope === "submission")
      await repository.updateMonSubmissionVersions(
        [merged.submission_version_id],
        c,
      );
    await audit(
      c,
      a,
      key,
      String(result.id),
      remove ? "deleted" : id ? "updated" : "created",
      { fields: Object.keys(p) },
    );
    return result;
  });
}
