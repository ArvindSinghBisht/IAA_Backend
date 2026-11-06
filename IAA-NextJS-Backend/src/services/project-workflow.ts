import * as repository from "@/repositories/project-workflow.repository";
import { z } from "zod";
import { unitOfWork as transaction } from "@/infrastructure/database/unit-of-work";
import { projectAccess, type Actor } from "@/lib/auth";
import { audit } from "@/lib/governance";
import { ApiError, uuid } from "@/lib/http";
import { resources } from "./resources";
export const publicProjectFields = [
  "project_id",
  "code",
  "name",
  "area_id",
  "model_id",
  "typology_id",
  "status",
  "capacity_dc_mwp",
  "point",
  "summary",
  "objective",
  "capacity_ac_mw",
  "site_area_ha",
  "cultivated_area_ha",
  "commissioned_on",
  "notes",
  "designs",
  "crop_plans",
  "grid_connections",
  "land_uses",
  "partners",
  "documents",
  "ownership_model_id",
  "land_ownership_model_id",
] as const;
export async function updateProfile(a: Actor, id: string, input: unknown) {
  uuid.parse(id);
  const p = z
    .object({
      name: z.string().min(1).max(200).optional(),
      area_id: uuid.optional(),
      model_id: uuid.nullable().optional(),
      typology_id: uuid.nullable().optional(),
      ownership_model_id: uuid.nullable().optional(),
      land_ownership_model_id: uuid.nullable().optional(),
      status: z
        .enum([
          "planned",
          "pilot",
          "construction",
          "operational",
          "inactive",
          "closed",
        ])
        .optional(),
      point: z
        .object({
          lat: z.number().min(-90).max(90),
          lon: z.number().min(-180).max(180),
        })
        .optional(),
      commissioned_on: z.iso.date().nullable().optional(),
      capacity_dc_mwp: z.number().nonnegative().nullable().optional(),
      capacity_ac_mw: z.number().nonnegative().nullable().optional(),
      storage_mwh: z.number().nonnegative().nullable().optional(),
      site_area_ha: z.number().positive().nullable().optional(),
      cultivated_area_ha: z.number().nonnegative().nullable().optional(),
      agripv_footprint_ha: z.number().nonnegative().nullable().optional(),
      objective: z.string().max(20000).nullable().optional(),
      summary: z.string().max(20000).nullable().optional(),
      effective_from: z.iso.date().optional(),
      effective_to: z.iso.date().nullable().optional(),
    })
    .strict()
    .parse(input);
  return transaction(async (c) => {
    const v = (await repository.selectProjectVersions([id], c)).rows[0];
    if (!v) throw new ApiError(404, "NOT_FOUND", "Profile not found");
    await projectAccess(a, v.project_id, "edit", c);
    if (v.review_status !== "draft")
      throw new ApiError(
        409,
        "IMMUTABLE",
        "Create a new revision to change this profile",
      );
    const names = Object.keys(p);
    if (!names.length)
      throw new ApiError(400, "EMPTY_INPUT", "Provide changes");
    const vals = Object.values(p).map((x) =>
      typeof x === "object" && x ? JSON.stringify(x) : x,
    );
    const set = names.map((n, i) =>
      n === "point"
        ? `point=ST_SetSRID(ST_MakePoint(($${i + 2}::jsonb->>'lon')::numeric,($${i + 2}::jsonb->>'lat')::numeric),4326)`
        : `${n}=$${i + 2}`,
    );
    await repository.updateProjectVersions([id, ...vals], c, [set]);
    await audit(c, a, "project.versions", id, "profile_updated", {
      fields: names,
    });
    return { id };
  });
}
export async function profileTransition(a: Actor, id: string, input: unknown) {
  uuid.parse(id);
  const p = z
    .object({
      action: z.enum([
        "submit",
        "return",
        "approve",
        "reject",
        "publish",
        "revoke",
      ]),
      reason: z.string().trim().min(1).max(2000),
      fields: z.array(z.enum(publicProjectFields)).min(7).optional(),
    })
    .strict()
    .parse(input);
  return transaction(async (c) => {
    const v = (await repository.selectProjectVersions2([id], c)).rows[0];
    if (!v) throw new ApiError(404, "NOT_FOUND", "Profile not found");
    await projectAccess(
      a,
      v.project_id,
      p.action === "submit" ? "edit" : "review",
      c,
    );
    if (p.action === "submit") {
      if (v.review_status !== "draft")
        throw new ApiError(409, "INVALID_STATE", "Submit a draft");
      if (!v.name || !v.area_id)
        throw new ApiError(
          422,
          "PROFILE_INCOMPLETE",
          "Name and area are required",
        );
      await repository.updateProjectVersions2([id, a.id], c);
    } else if (["approve", "return", "reject"].includes(p.action)) {
      if (v.review_status !== "submitted")
        throw new ApiError(409, "INVALID_STATE", "Review a submitted profile");
      if (v.submitted_by === a.id)
        throw new ApiError(
          403,
          "SELF_REVIEW",
          "A different reviewer must decide",
        );
      const state = {
        approve: "approved",
        return: "returned",
        reject: "rejected",
      }[p.action as "approve" | "return" | "reject"];
      await repository.updateProjectVersions3([id, state, a.id], c);
    } else if (p.action === "publish") {
      if (v.review_status !== "approved")
        throw new ApiError(409, "INVALID_STATE", "Publish an approved profile");
      const mandatory = [
        "project_id",
        "code",
        "name",
        "area_id",
        "model_id",
        "typology_id",
        "status",
        "capacity_dc_mwp",
      ];
      if (
        !p.fields ||
        mandatory.some(
          (f) => !p.fields!.includes(f as (typeof publicProjectFields)[number]),
        )
      )
        throw new ApiError(
          400,
          "WHITELIST_REQUIRED",
          "Include all base registry fields explicitly",
        );
      await repository.updateProjectPublications([v.project_id], c);
      await repository.insertProjectPublications(
        [id, a.id, JSON.stringify(p.fields), p.reason],
        c,
      );
    } else await repository.updateProjectPublications2([id], c);
    await repository.insertProjectReviewEvents(
      [id, a.id, p.action, p.reason],
      c,
    );
    await audit(c, a, "project.versions", id, p.action);
    return { id, action: p.action };
  });
}
export async function reviseProfile(a: Actor, id: string, input: unknown) {
  uuid.parse(id);
  const p = z
    .object({ reason: z.string().trim().min(1).max(2000) })
    .strict()
    .parse(input);
  return transaction(async (c) => {
    const initial = (await repository.selectProjectVersions3([id], c)).rows[0];
    if (!initial) throw new ApiError(404, "NOT_FOUND", "Profile not found");
    await projectAccess(a, initial.project_id, "edit", c);
    await repository.selectProjectProjects([initial.project_id], c);
    const v = (await repository.selectProjectVersions4([id], c)).rows[0];
    if (["draft", "submitted"].includes(v.review_status))
      throw new ApiError(
        409,
        "INVALID_STATE",
        "Revise an approved, returned or rejected profile",
      );
    if ((await repository.selectProjectVersions5([v.project_id], c)).rowCount)
      throw new ApiError(
        409,
        "ACTIVE_DRAFT",
        "A draft or review is already active",
      );
    const cols = [
      "project_id",
      "area_id",
      "model_id",
      "typology_id",
      "ownership_model_id",
      "land_ownership_model_id",
      "name",
      "status",
      "point",
      "footprint",
      "commissioned_on",
      "capacity_dc_mwp",
      "capacity_ac_mw",
      "storage_mwh",
      "site_area_ha",
      "cultivated_area_ha",
      "agripv_footprint_ha",
      "objective",
      "summary",
      "effective_from",
      "effective_to",
    ];
    const row = (
      await repository.insertProjectVersions([id, v.project_id], c, [
        cols,
        cols,
      ])
    ).rows[0];
    for (const [table, d] of Object.entries(resources).filter(
      ([, d]) => d.scope === "profile",
    )) {
      const names = Object.keys(d.columns).filter(
        (n) => !["id", "created_at", "project_version_id"].includes(n),
      );
      await repository.insertSession([id, row.id], c, [
        table,
        names,
        names,
        table,
      ]);
    }
    await repository.insertProjectReviewEvents2([row.id, a.id, p.reason], c);
    await audit(c, a, "project.versions", row.id, "revision_created", {
      supersedes: id,
    });
    return row;
  });
}
