import * as repository from "@/repositories/queries.repository";
import { z } from "zod";
import { unitOfWork as transaction } from "@/infrastructure/database/unit-of-work";
import { isGlobal, type Actor } from "@/lib/auth";
import { admin, audit } from "@/lib/governance";
import { ApiError, uuid } from "@/lib/http";
export async function listQueries(a: Actor) {
  return {
    data: (
      await repository.selectContentQueryResponses(
        [a.id, isGlobal(a)],
        undefined,
      )
    ).rows,
  };
}
export async function ask(a: Actor, input: unknown) {
  const p = z
    .object({
      question: z.string().trim().min(5).max(10000),
      areaId: uuid.optional(),
      category: z.string().max(100).optional(),
    })
    .strict()
    .parse(input);
  return transaction(async (c) => {
    const q = (
      await repository.insertContentQueries(
        [a.id, p.areaId ?? null, p.question, p.category ?? null],
        c,
      )
    ).rows[0];
    await audit(c, a, "content.queries", q.id, "query_created");
    return q;
  });
}
export async function answer(a: Actor, id: string, input: unknown) {
  admin(a);
  uuid.parse(id);
  const p = z
    .object({
      answer: z.string().trim().min(1).max(20000),
      resourceId: uuid.optional(),
      close: z.boolean().default(true),
    })
    .strict()
    .parse(input);
  return transaction(async (c) => {
    if (!(await repository.selectContentQueries([id], c)).rowCount)
      throw new ApiError(404, "NOT_FOUND", "Query not found");
    const q = (
      await repository.insertContentQueryResponses(
        [id, a.id, p.resourceId ?? null, p.answer],
        c,
      )
    ).rows[0];
    if (p.close) await repository.updateContentQueries([id], c);
    await audit(c, a, "content.queries", id, "query_answered");
    return q;
  });
}
