import * as repository from "@/repositories/public-data.repository";
import { z } from "zod";

import { pageQuery, uuid, ApiError } from "@/lib/http";
export const nearbyQuery = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().positive().max(50).default(10),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});
export async function nearby(params: Record<string, string>) {
  const p = nearbyQuery.parse(params);
  const out = await repository.selectSession(
    [p.lon, p.lat, p.radiusKm * 1000, p.limit],
    undefined,
  );
  return {
    data: out.rows,
    meta: {
      distanceMethod: "geodesic_straight_line",
      radiusKm: p.radiusKm,
      limit: p.limit,
      coverage:
        "Only approved public records with coordinates. Empty does not mean no facility exists.",
      truncated: out.rows.length === p.limit,
    },
  };
}
export async function features(params: Record<string, string>) {
  const p = pageQuery
    .extend({
      kind: z.enum(["feeder", "facility", "substation", "project"]).optional(),
      areaId: uuid.optional(),
    })
    .parse(params);
  const out = await repository.selectSession2(
    [p.q, p.kind ?? null, p.areaId ?? null, p.limit, p.offset],
    undefined,
  );
  return {
    type: "FeatureCollection",
    features: out.rows.map(({ geometry, ...properties }) => ({
      type: "Feature",
      geometry,
      properties,
    })),
    meta: { ...p, missingGeometryIncluded: true },
  };
}
export async function projects(params: Record<string, string>) {
  const p = pageQuery
    .extend({
      areaId: uuid.optional(),
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
    })
    .parse(params);
  const out = await repository.selectProjectPublicRegistry(
    [p.q, p.areaId ?? null, p.status ?? null, p.limit, p.offset],
    undefined,
  );
  return { data: out.rows, meta: p };
}
export async function demoProject() {
  const out = await repository.selectProjectProjects([], undefined);
  if (!out.rowCount)
    throw new ApiError(
      404,
      "NOT_FOUND",
      "Illustrative WP1 project is not seeded in this development database",
    );
  return {
    data: {
      ...out.rows[0],
      illustrative_only: true,
      publicly_released: false,
      review_status: "draft",
      ownership: "Illustrative only",
      generation: null,
      yield: null,
      baseline: null,
      livestock: null,
    },
  };
}
export async function projectPublic(id: string) {
  uuid.parse(id);
  const r = await repository.selectProjectPublicRegistry2([id], undefined);
  if (!r.rowCount)
    throw new ApiError(404, "NOT_FOUND", "No public project release");
  return { data: r.rows };
}
export async function areas(params: Record<string, string>) {
  const p = pageQuery
    .extend({
      parentId: uuid.optional(),
      level: z
        .enum([
          "country",
          "state",
          "district",
          "subdistrict",
          "village",
          "city",
        ])
        .optional(),
    })
    .parse(params);
  return {
    data: (
      await repository.selectGeoAreas(
        [p.q, p.parentId ?? null, p.level ?? null, p.limit, p.offset],
        undefined,
      )
    ).rows,
  };
}
export async function datasets() {
  return { data: (await repository.selectDataDatasets([], undefined)).rows };
}
