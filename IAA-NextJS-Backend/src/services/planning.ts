import * as repository from "@/repositories/planning.repository";
import { randomBytes, createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import type { PoolClient } from "pg";
import { unitOfWork as transaction } from "@/infrastructure/database/unit-of-work";
import { ApiError, uuid } from "@/lib/http";
import { estimateEnergy, energyInput } from "./calculations";
import { runEngine, implementationDigest } from "./planning-engines";
import { digest } from "./monitoring-validation";
const hash = (v: string) => createHash("sha256").update(v).digest("hex");
export const scenarioInput = z
  .object({
    name: z.string().trim().min(1).max(150),
    parameters: z
      .object({
        capacityDcMwp: z.number().positive().max(10000).optional(),
        specificYieldKwhPerKwpYear: z.number().positive().max(4000).optional(),
        referenceHours: z.number().positive().max(8784).default(8760),
        functions: z
          .record(z.string(), z.record(z.string(), z.json()))
          .optional(),
        methodVersionIds: z.array(uuid).max(9).optional(),
        datasetVersionIds: z.array(uuid).max(50).optional(),
        feederVersionId: uuid.optional(),
      })
      .strict()
      .refine(
        (p) =>
          (p.capacityDcMwp === undefined) ===
          (p.specificYieldKwhPerKwpYear === undefined),
        "Supply capacity and yield together",
      )
      .refine(
        (p) =>
          p.capacityDcMwp !== undefined ||
          Object.keys(p.functions ?? {}).length > 0,
        "Supply energy inputs or function inputs",
      ),
  })
  .strict();
export async function createAssessment(input: unknown) {
  const p = z
    .object({
      name: z.string().trim().min(1).max(150),
      areaId: uuid,
      lat: z.number().min(-90).max(90),
      lon: z.number().min(-180).max(180),
    })
    .strict()
    .parse(input);
  const token = randomBytes(32).toString("base64url");
  return transaction(async (c) => {
    const a = (
      await repository.insertPlanAssessments(
        [p.name, p.areaId, p.lon, p.lat, hash(token)],
        c,
      )
    ).rows[0];
    return { ...a, accessToken: token };
  });
}
async function access(c: PoolClient, id: string, token: string | null) {
  uuid.parse(id);
  if (!token || token.length > 200)
    throw new ApiError(
      401,
      "PLAN_TOKEN_REQUIRED",
      "Send X-Planning-Token from assessment creation",
    );
  const a = (await repository.selectPlanAssessments([id], c)).rows[0];
  const expected = a?.access_token_hash;
  const actual = hash(token);
  if (
    !expected ||
    expected.length !== actual.length ||
    !timingSafeEqual(Buffer.from(expected), Buffer.from(actual))
  )
    throw new ApiError(404, "NOT_FOUND", "Assessment unavailable or expired");
  return a;
}
export async function getAssessment(id: string, token: string | null) {
  return transaction(async (c) => {
    const a = await access(c, id, token);
    return {
      id: a.id,
      name: a.name,
      areaId: a.area_id,
      expiresAt: a.expires_at,
      scenarios: (await repository.selectPlanScenarios([id], c)).rows,
    };
  });
}
export async function saveScenario(
  id: string,
  token: string | null,
  input: unknown,
) {
  const p = scenarioInput.parse(input);
  return transaction(async (c) => {
    await access(c, id, token);
    return (
      await repository.insertPlanScenarios(
        [
          id,
          p.name,
          JSON.stringify(p.parameters),
          hash(JSON.stringify(p.parameters)),
        ],
        c,
      )
    ).rows[0];
  });
}
export async function runScenario(
  id: string,
  token: string | null,
  input: unknown,
) {
  const p = z
    .object({ scenarioId: uuid, idempotencyKey: z.string().min(8).max(100) })
    .strict()
    .parse(input);
  return transaction(async (c) => {
    await access(c, id, token);
    const s = (await repository.selectPlanScenarios2([p.scenarioId, id], c))
      .rows[0];
    if (!s) throw new ApiError(404, "NOT_FOUND", "Scenario not found");
    const key = hash(id + ":" + p.idempotencyKey);
    const existing = (await repository.selectPlanRuns([key], c)).rows[0];
    if (existing) {
      if (existing.input_hash !== s.input_hash || existing.scenario_id !== s.id)
        throw new ApiError(
          409,
          "IDEMPOTENCY_CONFLICT",
          "Use a new key after changing inputs",
        );
      return existing;
    }
    const selected = await repository.selectPlanMethodVersions(
      [s.parameters.methodVersionIds ?? []],
      c,
    );
    if (selected.rowCount !== (s.parameters.methodVersionIds ?? []).length)
      throw new ApiError(
        422,
        "METHOD_NOT_APPROVED",
        "Every selected method must be approved",
      );
    if (
      new Set(selected.rows.map((m) => m.function_code)).size !==
      selected.rows.length
    )
      throw new ApiError(
        400,
        "DUPLICATE_METHOD",
        "Select one method per function",
      );
    const versions = await repository.selectDataDatasetVersions(
      [s.parameters.datasetVersionIds ?? []],
      c,
    );
    if (versions.rowCount !== (s.parameters.datasetVersionIds ?? []).length)
      throw new ApiError(
        422,
        "DATASET_NOT_APPROVED",
        "Every selected dataset must permit planning",
      );
    const functions = [];
    for (const functionCode of [
      "suitability",
      "grid",
      "model",
      "market",
      "scheme",
      "retrofit",
      "shading",
      "finance",
    ]) {
      const method = selected.rows.find(
        (m) => m.function_code === functionCode,
      );
      if (!method) {
        functions.push({
          functionCode,
          status: "cannot_assess",
          result: {},
          explanation:
            "Select an approved method and provide its required inputs.",
        });
        continue;
      }
      const installed: Record<string, string> = {
        suitability: "weighted-score-v1",
        grid: "hosting-check-v1",
        model: "model-rules-v1",
        market: "market-distance-v1",
        scheme: "eligibility-rules-v1",
        retrofit: "retrofit-checks-v1",
        shading: "row-shadow-v1",
        finance: "discounted-cashflow-v1",
      };
      if (installed[functionCode] !== method.configuration.implementation)
        throw new ApiError(
          422,
          "ENGINE_FUNCTION",
          "Approved method implementation does not match function",
        );
      if (
        method.code_digest !==
        implementationDigest(method.configuration.implementation)
      )
        throw new ApiError(
          422,
          "ENGINE_DIGEST",
          "Method code digest does not match installed engine",
        );
      const inputs = { ...(s.parameters.functions?.[functionCode] ?? {}) };
      if (functionCode === "grid") {
        delete inputs.approvedHostingMw;
        if (s.parameters.feederVersionId) {
          const feeder = (
            await repository.selectDvId([s.parameters.feederVersionId], c)
          ).rows[0];
          if (feeder && feeder.approved_hosting_mw !== null) {
            inputs.approvedHostingMw = Number(feeder.approved_hosting_mw);
            if (!versions.rows.some((v) => v.id === feeder.dataset_version_id))
              throw new ApiError(
                422,
                "DATASET_PIN_REQUIRED",
                "Include the feeder datasetVersionId in the scenario",
              );
          }
        }
      }
      let result;
      if (functionCode === "market") {
        if (method.configuration.implementation !== "market-distance-v1")
          throw new ApiError(
            422,
            "ENGINE_FUNCTION",
            "Market function requires the spatial distance engine",
          );
        const markets = await repository.selectNId(
          [id, versions.rows.map((v) => v.id)],
          c,
        );
        result = {
          status: markets.rowCount
            ? ("indicative" as const)
            : ("cannot_assess" as const),
          result: {
            facilities: markets.rows,
            distanceMethod: "geodesic_straight_line",
            radiusKm: 50,
          },
          explanation: markets.rowCount
            ? "Nearest approved facilities in selected dataset versions; no travel times or market demand are inferred."
            : "No mapped facilities within 50 km in the selected approved dataset versions.",
        };
      } else result = runEngine(method.configuration, inputs);
      functions.push({ functionCode, methodVersionId: method.id, ...result });
    }
    const energy =
      s.parameters.capacityDcMwp !== undefined &&
      s.parameters.specificYieldKwhPerKwpYear !== undefined
        ? estimateEnergy(
            energyInput.parse({
              capacityDcMwp: s.parameters.capacityDcMwp,
              specificYieldKwhPerKwpYear:
                s.parameters.specificYieldKwhPerKwpYear,
              referenceHours: s.parameters.referenceHours,
            }),
          )
        : {
            status: "cannot_assess",
            reason: "Energy inputs were not provided for this scenario",
          };
    const output = {
      energy,
      functions,
      datasets: versions.rows,
      weatherHeatmap: {
        status: "cannot_assess",
        reason:
          "Ground-temperature modelling requires weather, soil and a validated thermal model.",
      },
    };
    const r = (
      await repository.insertPlanRuns(
        [s.id, s.revision, JSON.stringify(s.parameters), s.input_hash, key],
        c,
      )
    ).rows[0];
    await repository.insertPlanApiRunSummaries(
      [r.id, JSON.stringify(output)],
      c,
    );
    for (const v of versions.rows)
      await repository.insertPlanRunDatasets([r.id, v.id], c);
    for (const m of selected.rows)
      await repository.insertPlanRunMethods([r.id, m.id, m.function_code], c);
    for (const f of functions) {
      if ("methodVersionId" in f)
        await repository.insertPlanResults(
          [
            r.id,
            f.methodVersionId,
            f.functionCode,
            f.status,
            JSON.stringify(f.result),
            f.explanation,
          ],
          c,
        );
      if (f.status === "cannot_assess")
        await repository.insertPlanGaps(
          [r.id, f.functionCode, f.explanation],
          c,
        );
    }
    return { ...r, output };
  });
}
export async function getRuns(id: string, token: string | null) {
  return transaction(async (c) => {
    await access(c, id, token);
    return (await repository.selectPlanRuns2([id], c)).rows;
  });
}
