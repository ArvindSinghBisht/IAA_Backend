import * as repository from "@/repositories/administration.repository";
import { z } from "zod";
import { unitOfWork as transaction } from "@/infrastructure/database/unit-of-work";
import type { Actor } from "@/lib/auth";
import { admin, audit } from "@/lib/governance";
import { uuid, ApiError } from "@/lib/http";
export async function users(a: Actor) {
  admin(a);
  return { data: (await repository.selectIaaAuthUsers([], undefined)).rows };
}
export async function provision(a: Actor, input: unknown) {
  admin(a);
  const p = z
    .object({
      subject: z.string().min(1).max(500),
      email: z.email(),
      name: z.string().min(1).max(200),
      organisationId: uuid.optional(),
      role: z.enum([
        "system_admin",
        "reviewer",
        "data_steward",
        "project_user",
        "management",
      ]),
    })
    .strict()
    .parse(input);
  if (p.role !== "system_admin" && !p.organisationId)
    throw new ApiError(
      400,
      "ORGANISATION_REQUIRED",
      "Organisation is required",
    );
  return transaction(async (c) => {
    const u = (
      await repository.insertIaaAuthUsers(
        [p.subject, p.email, p.name, p.organisationId ?? null],
        c,
      )
    ).rows[0];
    await repository.insertIaaAuthUserRoles(
      [u.id, p.role === "system_admin" ? null : p.organisationId, p.role],
      c,
    );
    await audit(c, a, "iaa_auth.users", u.id, "user_provisioned", {
      role: p.role,
    });
    return u;
  });
}
export async function deactivate(a: Actor, id: string) {
  admin(a);
  uuid.parse(id);
  if (id === a.id)
    throw new ApiError(409, "SELF_DISABLE", "Cannot disable your own account");
  return transaction(async (c) => {
    const r = (await repository.updateIaaAuthUsers([id], c)).rows[0];
    if (!r) throw new ApiError(404, "NOT_FOUND", "User not found");
    await audit(c, a, "iaa_auth.users", id, "user_disabled");
    return r;
  });
}
export async function notifications(a: Actor) {
  return {
    data: (await repository.selectOpsNotifications([a.id], undefined)).rows,
  };
}
export async function acknowledge(a: Actor, id: string) {
  uuid.parse(id);
  const r = (await repository.updateOpsNotifications([id, a.id], undefined))
    .rows[0];
  if (!r) throw new ApiError(404, "NOT_FOUND", "Notification not found");
  return r;
}
export async function reminders(a: Actor) {
  admin(a);
  return transaction(async (c) => {
    const r = await repository.insertOpsNotifications([], c);
    return { created: r.rowCount };
  });
}
export async function membership(a: Actor, id: string, input: unknown) {
  admin(a);
  uuid.parse(id);
  const p = z
    .object({
      userId: uuid,
      role: z.enum(["project_user", "data_steward", "management"]),
      validUntil: z.iso.datetime({ offset: true }).optional(),
    })
    .strict()
    .parse(input);
  return transaction(async (c) => {
    const m = (
      await repository.insertProjectMemberships(
        [id, p.userId, p.role, p.validUntil ?? null],
        c,
      )
    ).rows[0];
    await audit(c, a, "project.memberships", m.id, "membership_granted");
    return m;
  });
}
