import * as repository from "@/repositories/catalogue.repository";
import { z } from "zod";

import { ApiError, pageQuery, uuid } from "@/lib/http";
const released = `v.status='approved' AND v.is_current AND v.public_allowed AND NOT v.is_demo AND d.is_active`;
export async function catalogue(kind: string, params: Record<string, string>) {
  const p = pageQuery
    .extend({ areaId: uuid.optional(), theme: z.string().max(100).optional() })
    .parse(params);
  if (kind === "resources")
    return {
      data: (
        await repository.selectContentResources(
          [p.q, p.theme ?? null, p.areaId ?? null, p.limit, p.offset],
          undefined,
          [released],
        )
      ).rows,
      meta: p,
    };
  if (kind === "policies")
    return {
      data: (
        await repository.selectContentPolicies(
          [p.q, p.areaId ?? null, p.limit, p.offset],
          undefined,
          [released],
        )
      ).rows,
      meta: {
        ...p,
        eligibility:
          "Published rules; eligibility and entitlement require verification.",
      },
    };
  throw new ApiError(404, "NOT_FOUND", "Unknown catalogue");
}
export async function district(id: string, params: Record<string, string>) {
  uuid.parse(id);
  const p = pageQuery.parse(params);
  const area = (await repository.selectGeoAreas([id], undefined)).rows[0];
  if (!area) throw new ApiError(404, "NOT_FOUND", "Area not found");
  const rows = (
    await repository.selectVId([id, p.limit, p.offset], undefined, [released])
  ).rows;
  return {
    data: { area, observations: rows },
    meta: {
      ...p,
      coverage:
        "Exact area only; livestock metrics appear when supplied as approved environmental observations. Missing metrics are unavailable, not zero.",
    },
  };
}
export async function masters(kind: string) {
  const tables = {
    crops: "core.crops",
    seasons: "core.seasons",
    units: "core.units",
    models: "core.models",
    locales: "core.locales",
    practices: "core.practices",
  };
  const table = Object.hasOwn(tables, kind)
    ? tables[kind as keyof typeof tables]
    : undefined;
  if (!table)
    throw new ApiError(404, "NOT_FOUND", "Unknown reference catalogue");
  return {
    data: (await repository.selectSession([], undefined, [table])).rows,
  };
}
export async function datasetDetail(id: string) {
  uuid.parse(id);
  const r = await repository.selectDataDatasets([id], undefined, [released]);
  if (!r.rowCount) throw new ApiError(404, "NOT_FOUND", "No published dataset");
  return { data: r.rows };
}
