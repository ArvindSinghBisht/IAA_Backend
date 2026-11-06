import * as repository from "@/repositories/project-editor.repository";
import { z } from "zod";
import { unitOfWork as transaction } from "@/infrastructure/database/unit-of-work";
import { projectAccess, isGlobal, type Actor } from "@/lib/auth";
import { ApiError, uuid } from "@/lib/http";
export const sectionCodes = [
  "overview",
  "land_community",
  "technical_design",
  "grid_policy",
  "agriculture",
  "socio_economic_learning",
] as const;
export const profileInput = z
  .object({
    name: z.string().trim().min(1).max(200),
    areaId: uuid,
    status: z.enum([
      "planned",
      "pilot",
      "construction",
      "operational",
      "inactive",
      "closed",
    ]),
    effectiveFrom: z.iso.date(),
    capacityDcMwp: z.number().nonnegative().optional(),
    siteAreaHa: z.number().positive().optional(),
    summary: z.string().max(10000).optional(),
  })
  .strict();
export async function createProject(a: Actor, input: unknown) {
  const p = z
    .object({
      code: z.string().regex(/^[A-Za-z0-9_-]{1,80}$/),
      organisationId: uuid,
      profile: profileInput,
    })
    .strict()
    .parse(input);
  if (
    !isGlobal(a) &&
    !a.roles.some(
      (r) =>
        r.organisation_id === p.organisationId &&
        ["project_user", "data_steward"].includes(r.code),
    )
  )
    throw new ApiError(
      403,
      "FORBIDDEN",
      "No create permission in this organisation",
    );
  return transaction(async (c) => {
    const row = (
      await repository.insertProjectProjects(
        [p.code, p.organisationId, a.id],
        c,
      )
    ).rows[0];
    const v = (
      await repository.insertProjectVersions(
        [
          row.id,
          p.profile.name,
          p.profile.areaId,
          p.profile.status,
          p.profile.effectiveFrom,
          p.profile.capacityDcMwp ?? null,
          p.profile.siteAreaHa ?? null,
          p.profile.summary ?? null,
        ],
        c,
      )
    ).rows[0];
    return { ...row, version: v };
  });
}
export async function getProfile(a: Actor, id: string) {
  uuid.parse(id);
  const v = (await repository.selectProjectVersions([id], undefined)).rows[0];
  if (!v) throw new ApiError(404, "NOT_FOUND", "Profile not found");
  await projectAccess(a, v.project_id, "read");
  delete v.point;
  delete v.footprint;
  return {
    ...v,
    notes: (await repository.selectProjectProfileNotes([id], undefined)).rows,
  };
}
export async function saveNote(a: Actor, id: string, input: unknown) {
  uuid.parse(id);
  const p = z
    .object({
      fieldCode: z.string().regex(/^[a-z0-9_]{1,100}$/),
      sectionCode: z.enum(sectionCodes),
      narrative: z.string().trim().min(1).max(20000),
      visibility: z.enum(["restricted", "public"]).default("restricted"),
    })
    .strict()
    .parse(input);
  return transaction(async (c) => {
    const v = (await repository.selectProjectVersions2([id], c)).rows[0];
    if (!v) throw new ApiError(404, "NOT_FOUND", "Profile not found");
    await projectAccess(a, v.project_id, "edit", c);
    if (v.review_status !== "draft")
      throw new ApiError(
        409,
        "IMMUTABLE",
        "Only draft profile notes can be edited",
      );
    return (
      await repository.insertProjectProfileNotes(
        [id, p.fieldCode, p.sectionCode, p.narrative, p.visibility],
        c,
      )
    ).rows[0];
  });
}
export async function myProjects(a: Actor) {
  const orgs = a.roles
    .filter((r) =>
      ["project_user", "data_steward", "reviewer", "management"].includes(
        r.code,
      ),
    )
    .map((r) => r.organisation_id)
    .filter(Boolean);
  return {
    data: (
      await repository.selectProjectProjects(
        [
          isGlobal(a),
          orgs,
          a.id,
          ["project_user", "data_steward", "reviewer", "management"],
        ],
        undefined,
      )
    ).rows,
  };
}
