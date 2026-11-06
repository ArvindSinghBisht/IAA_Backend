import * as repository from "@/repositories/monitoring-records.repository";
import { z } from "zod";
import { unitOfWork as transaction } from "@/infrastructure/database/unit-of-work";
import { projectAccess, type Actor } from "@/lib/auth";
import { ApiError, uuid } from "@/lib/http";
const text = z.string().trim().min(1).max(2000),
  number = z.number().finite().nonnegative();
export const factSchemas = {
  energy: z
    .object({
      segment_code: text,
      start_at: z.iso.datetime({ offset: true }),
      end_at: z.iso.datetime({ offset: true }),
      generation_mwh: number,
      export_mwh: number.optional(),
      onsite_mwh: number.optional(),
      capacity_dc_mwp: z.number().positive(),
      capacity_ac_mw: z.number().positive().optional(),
      operational_hours: number.optional(),
      reference_hours: z.number().positive(),
      meter_reference: text,
    })
    .strict()
    .refine(
      (x) => Date.parse(x.end_at) > Date.parse(x.start_at),
      "End must follow start",
    )
    .refine(
      (x) =>
        x.operational_hours === undefined ||
        x.operational_hours <= x.reference_hours,
      "Operational hours exceed reference hours",
    )
    .refine(
      (x) => (x.export_mwh ?? 0) + (x.onsite_mwh ?? 0) <= x.generation_mwh,
      "Export and onsite consumption exceed generation",
    ),
  land: z
    .object({
      plot_code: text,
      site_area_ha: z.number().positive(),
      solar_area_ha: number.optional(),
      cultivated_area_ha: number.optional(),
      water_used_m3: number.optional(),
      notes: text.optional(),
    })
    .strict()
    .refine(
      (x) =>
        (x.solar_area_ha ?? 0) <= x.site_area_ha &&
        (x.cultivated_area_ha ?? 0) <= x.site_area_ha,
      "Areas exceed site area",
    ),
  income: z
    .object({
      scope_kind: z.enum(["project", "fpo", "household"]),
      scope_key: text,
      component: text,
      amount_inr: z.number().finite(),
      accounting_basis: z.enum([
        "gross_receipt",
        "expense",
        "net_income",
        "transfer",
      ]),
      source_reference: text,
    })
    .strict(),
  inclusion: z
    .object({
      population_code: text,
      women: number.int(),
      men: number.int(),
      other_gender: number.int(),
      gender_unknown: number.int(),
      youth: number.int().optional(),
      households: number.int().optional(),
      count_basis: text,
    })
    .strict()
    .refine(
      (x) =>
        x.youth === undefined ||
        x.youth <= x.women + x.men + x.other_gender + x.gender_unknown,
      "Youth exceed population",
    ),
};
const tables = {
  energy: "mon.energy_records",
  land: "mon.land_records",
  income: "mon.income_records",
  inclusion: "mon.inclusion_totals",
};
function config(kind: string) {
  if (!Object.hasOwn(tables, kind))
    throw new ApiError(404, "NOT_FOUND", "Unknown monitoring record type");
  return {
    table: tables[kind as keyof typeof tables],
    schema: factSchemas[kind as keyof typeof factSchemas],
  };
}
export async function records(a: Actor, id: string, kind: string) {
  uuid.parse(id);
  const { table } = config(kind);
  const v = (await repository.selectMonSubmissionVersions([id], undefined))
    .rows[0];
  if (!v) throw new ApiError(404, "NOT_FOUND", "Revision not found");
  await projectAccess(a, v.project_id, "read");
  return (await repository.selectSession([id], undefined, [table])).rows;
}
export async function addRecord(
  a: Actor,
  id: string,
  kind: string,
  input: unknown,
) {
  uuid.parse(id);
  const { table, schema } = config(kind),
    p = schema.parse(input);
  return transaction(async (c) => {
    const v = (await repository.selectMonSubmissionVersions2([id], c)).rows[0];
    if (!v) throw new ApiError(404, "NOT_FOUND", "Revision not found");
    await projectAccess(a, v.project_id, "edit", c);
    if (v.status !== "draft")
      throw new ApiError(409, "IMMUTABLE", "Only drafts are editable");
    const columns = Object.keys(p),
      values = Object.values(p);
    const result = (
      await repository.insertSession([id, ...values], c, [
        table,
        columns.join(","),
        columns.map((_, i) => "$" + (i + 2)).join(","),
      ])
    ).rows[0];
    await repository.updateMonSubmissionVersions([id], c);
    await repository.insertOpsAuditEvents([a.id, table, result.id], c);
    return result;
  });
}
export async function obligations(a: Actor, id: string) {
  uuid.parse(id);
  await projectAccess(a, id, "read");
  return (await repository.selectMonObligations([id], undefined)).rows;
}
export async function form(a: Actor, id: string) {
  uuid.parse(id);
  const o = (await repository.selectMonObligations2([id], undefined)).rows[0];
  if (!o) throw new ApiError(404, "NOT_FOUND", "Obligation not found");
  await projectAccess(a, o.project_id, "read");
  return (await repository.selectMonFormFields([o.form_version_id], undefined))
    .rows;
}
export async function deleteRecord(
  a: Actor,
  id: string,
  kind: string,
  recordId: string,
) {
  uuid.parse(id);
  uuid.parse(recordId);
  const { table } = config(kind);
  return transaction(async (c) => {
    const v = (await repository.selectMonSubmissionVersions3([id], c)).rows[0];
    if (!v) throw new ApiError(404, "NOT_FOUND", "Revision not found");
    await projectAccess(a, v.project_id, "edit", c);
    if (v.status !== "draft")
      throw new ApiError(409, "IMMUTABLE", "Only draft records can be deleted");
    const r = await repository.deleteSession([recordId, id], c, [table]);
    if (!r.rowCount) throw new ApiError(404, "NOT_FOUND", "Record not found");
    await repository.updateMonSubmissionVersions2([id], c);
    await repository.insertOpsAuditEvents2([a.id, table, recordId], c);
    return { id: recordId, deleted: true };
  });
}
