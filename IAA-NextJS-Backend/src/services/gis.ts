import * as repository from "@/repositories/gis.repository";
import { z } from "zod";

import { ApiError, pageQuery, uuid } from "@/lib/http";
import { selectColumns, definition } from "./resources";
const publicVersion = `v.status='approved' AND v.is_current AND v.public_allowed AND NOT v.is_demo AND d.is_active`;
export async function search(params: Record<string, string>) {
  const p = pageQuery.parse(params);
  const r = await repository.selectGeoAreas(
    [p.q, p.limit, p.offset],
    undefined,
  );
  return { data: r.rows, meta: p };
}
export async function districtDomain(
  id: string,
  domain: string,
  params: Record<string, string>,
) {
  uuid.parse(id);
  const p = pageQuery.parse(params);
  const tables = {
    crops: "wp1.crop_production",
    land: "wp1.land_statistics",
    irrigation: "wp1.irrigation_statistics",
    environment: "wp1.environment_observations",
  };
  const table = Object.hasOwn(tables, domain)
    ? tables[domain as keyof typeof tables]
    : undefined;
  if (!table)
    throw new ApiError(
      404,
      "DOMAIN_NOT_FOUND",
      "Use crops, land, irrigation or environment",
    );
  return {
    data: (
      await repository.selectVId([id, p.limit, p.offset], undefined, [
        selectColumns(table),
        table,
        publicVersion,
      ])
    ).rows,
    meta: {
      ...p,
      coverage:
        "Exact-area records. Missing observations are not zero; compare matching units, categories and periods.",
    },
  };
}
export async function layers() {
  return {
    data: (await repository.selectGeoLayers([], undefined, [publicVersion]))
      .rows,
  };
}
export async function layerFeatures(
  id: string,
  params: Record<string, string>,
) {
  uuid.parse(id);
  const p = pageQuery
    .extend({
      west: z.coerce.number().min(-180).max(180).optional(),
      south: z.coerce.number().min(-90).max(90).optional(),
      east: z.coerce.number().min(-180).max(180).optional(),
      north: z.coerce.number().min(-90).max(90).optional(),
    })
    .parse(params);
  const bbox = [p.west, p.south, p.east, p.north];
  if (
    bbox.some((x) => x !== undefined) &&
    (bbox.some((x) => x === undefined) ||
      p.west! >= p.east! ||
      p.south! >= p.north!)
  )
    throw new ApiError(400, "BBOX", "Provide ordered west,south,east,north");
  const r = await repository.selectGeoFeatures(
    [id, p.limit, p.offset, ...bbox.map((x) => x ?? null)],
    undefined,
    [publicVersion],
  );
  return {
    type: "FeatureCollection",
    features: r.rows.map(({ geometry, ...properties }) => ({
      type: "Feature",
      geometry,
      properties,
    })),
    meta: p,
  };
}
export async function boundary(id: string) {
  uuid.parse(id);
  return {
    data: (
      await repository.selectGeoBoundaries([id], undefined, [publicVersion])
    ).rows,
  };
}
export async function compare(input: unknown) {
  const p = z
    .object({
      areaIds: z.array(uuid).min(2).max(4),
      metricCode: z.string().min(1).max(100),
      categoryCode: z.string().max(100).default(""),
      periodStart: z.iso.date(),
      periodEnd: z.iso.date(),
      unitId: uuid,
    })
    .strict()
    .parse(input);
  const r = await repository.selectVId2(
    [
      p.areaIds,
      p.metricCode,
      p.categoryCode,
      p.periodStart,
      p.periodEnd,
      p.unitId,
    ],
    undefined,
    [publicVersion],
  );
  return {
    data: p.areaIds.map((areaId) => ({
      areaId,
      status: r.rows.some((x) => x.area_id === areaId)
        ? "available"
        : "unavailable",
      observations: r.rows.filter((x) => x.area_id === areaId),
    })),
    meta: p,
  };
}
export function csvCell(value: unknown) {
  const s =
    value == null
      ? ""
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);
  return '"' + (/^[=+\-@\t\r]/.test(s) ? "'" + s : s).replace(/"/g, '""') + '"';
}
export async function exportDataset(
  id: string,
  resource: string,
  params: Record<string, string>,
) {
  uuid.parse(id);
  const d = definition(resource);
  if (d.scope !== "admin" || !d.columns.dataset_version_id)
    throw new ApiError(
      400,
      "EXPORT_RESOURCE",
      "Choose a version-bound GIS or content resource",
    );
  const p = pageQuery.parse(params);
  const v = (
    await repository.selectDataDatasetVersions([id], undefined, [publicVersion])
  ).rows[0];
  if (!v)
    throw new ApiError(
      403,
      "EXPORT_NOT_PERMITTED",
      "This version does not permit public export",
    );
  const rows = (
    await repository.selectSession([id, p.limit, p.offset], undefined, [
      selectColumns(resource),
      resource,
    ])
  ).rows;
  const columns = Object.keys(d.columns).filter(
    (x) => x !== "source_record_id",
  );
  const text = [
    columns.map(csvCell).join(","),
    ...rows.map((row) => columns.map((k) => csvCell(row[k])).join(",")),
  ].join("\r\n");
  return new Response(text, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="iaa-export.csv"',
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
      "X-Page-Limit": String(p.limit),
      "X-Page-Offset": String(p.offset),
    },
  });
}
export async function publicProfile(id: string) {
  uuid.parse(id);
  const r = (await repository.selectProjectVersions([id], undefined)).rows[0];
  if (!r) throw new ApiError(404, "NOT_FOUND", "No released profile");
  const out: Record<string, unknown> = { project_id: id, version_id: r.id };
  for (const f of r.public_fields)
    if (
      [
        "name",
        "code",
        "area_id",
        "model_id",
        "typology_id",
        "status",
        "capacity_dc_mwp",
        "summary",
        "objective",
        "capacity_ac_mw",
        "site_area_ha",
        "cultivated_area_ha",
        "commissioned_on",
        "ownership_model_id",
        "land_ownership_model_id",
      ].includes(f)
    )
      out[f] = r[f];
  if (r.public_fields.includes("point"))
    out.geometry = (
      await repository.selectProjectVersions2([r.id], undefined)
    ).rows[0].geometry;
  for (const child of [
    "notes",
    "designs",
    "crop_plans",
    "grid_connections",
    "land_uses",
    "partners",
  ])
    if (r.public_fields.includes(child)) {
      const table =
        child === "notes" ? "project.profile_notes" : "project." + child;
      let cols = Object.keys(definition(table).columns).filter(
        (c) =>
          ![
            "id",
            "created_at",
            "project_version_id",
            "approval_file_id",
          ].includes(c),
      );
      if (child === "grid_connections")
        cols = cols.filter(
          (c) =>
            !["connection_code", "tariff_inr_kwh", "tariff_category"].includes(
              c,
            ),
        );
      out[child] = (
        await repository.selectSession2([r.id], undefined, [
          cols,
          table,
          child === "notes" ? "AND visibility='public'" : "",
        ])
      ).rows;
    }
  if (r.public_fields.includes("documents"))
    out.documents = (
      await repository.selectProjectDocuments([r.id], undefined)
    ).rows;
  return { data: out };
}
export async function home() {
  const coverage = (await repository.selectSession3([], undefined)).rows;
  const updates = (
    await repository.selectDataDatasets([], undefined, [publicVersion])
  ).rows;
  return {
    data: { coverage, updates },
    meta: {
      coverage:
        "Counts describe published records only, not total national infrastructure. Livestock facilities require actual source records with that facility type.",
    },
  };
}
