import type { PoolClient } from "pg";
import { execute } from "@/infrastructure/database/connection";

export function selectGeoAreas(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `SELECT 'area' AS kind,id,name,level AS subtype,NULL::jsonb AS geometry FROM geo.areas WHERE (valid_to IS NULL OR valid_to>=current_date) AND name ILIKE '%'||$1||'%' UNION ALL SELECT kind,id,name,subtype,ST_AsGeoJSON(point)::jsonb FROM wp1.api_features WHERE name ILIKE '%'||$1||'%' UNION ALL SELECT 'project',r.project_id,r.name,r.status,ST_AsGeoJSON(r.point)::jsonb FROM project.public_registry r JOIN project.projects p ON p.id=r.project_id WHERE p.archived_at IS NULL AND r.name ILIKE '%'||$1||'%' ORDER BY name,id LIMIT $2 OFFSET $3`,
    values,
    tx,
  );
}

export function selectVId(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `SELECT ${fragments[0]},s.name AS source,v.version_label,v.reference_start,v.reference_end FROM ${fragments[1]} t JOIN data.dataset_versions v ON v.id=t.dataset_version_id JOIN data.datasets d ON d.id=v.dataset_id JOIN data.sources s ON s.id=d.source_id WHERE t.area_id=$1 AND ${fragments[2]} ORDER BY t.id LIMIT $2 OFFSET $3`,
    values,
    tx,
  );
}

export function selectGeoLayers(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `SELECT l.id,l.code,l.name,l.layer_type,l.geometry_type,l.style,l.legend,l.tile_service_reference,l.dataset_version_id,v.reference_start,v.reference_end,s.name AS source FROM geo.layers l JOIN data.dataset_versions v ON v.id=l.dataset_version_id JOIN data.datasets d ON d.id=v.dataset_id JOIN data.sources s ON s.id=d.source_id WHERE ${fragments[0]} ORDER BY l.name,l.id`,
    values,
    tx,
  );
}

export function selectGeoFeatures(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `SELECT f.id,f.attributes,ST_AsGeoJSON(f.geom)::jsonb AS geometry FROM geo.features f JOIN geo.layers l ON l.id=f.layer_id JOIN data.dataset_versions v ON v.id=l.dataset_version_id JOIN data.datasets d ON d.id=v.dataset_id WHERE l.id=$1 AND ${fragments[0]} AND ($4::numeric IS NULL OR ST_Intersects(f.geom,ST_MakeEnvelope($4,$5,$6,$7,4326))) ORDER BY f.id LIMIT $2 OFFSET $3`,
    values,
    tx,
  );
}

export function selectGeoBoundaries(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `SELECT b.id,b.area_id,b.dataset_version_id,ST_AsGeoJSON(b.geom)::jsonb AS geometry FROM geo.boundaries b JOIN data.dataset_versions v ON v.id=b.dataset_version_id JOIN data.datasets d ON d.id=v.dataset_id WHERE b.area_id=$1 AND ${fragments[0]} ORDER BY b.valid_from DESC NULLS LAST,b.id LIMIT 10`,
    values,
    tx,
  );
}

export function selectVId2(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `SELECT t.area_id,t.value,t.value_status,t.dataset_version_id,s.name AS source FROM wp1.environment_observations t JOIN data.dataset_versions v ON v.id=t.dataset_version_id JOIN data.datasets d ON d.id=v.dataset_id JOIN data.sources s ON s.id=d.source_id WHERE t.area_id=ANY($1::uuid[]) AND t.metric_code=$2 AND t.category_code=$3 AND t.period_start=$4 AND t.period_end=$5 AND t.unit_id=$6 AND ${fragments[0]} ORDER BY t.area_id,t.id`,
    values,
    tx,
  );
}

export function selectDataDatasetVersions(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `SELECT v.id FROM data.dataset_versions v JOIN data.datasets d ON d.id=v.dataset_id WHERE v.id=$1 AND ${fragments[0]} AND v.export_allowed`,
    values,
    tx,
  );
}

export function selectSession(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `SELECT ${fragments[0]} FROM ${fragments[1]} t WHERE dataset_version_id=$1 ORDER BY id LIMIT $2 OFFSET $3`,
    values,
    tx,
  );
}

export function selectProjectVersions(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `SELECT v.*,p.code,pub.public_fields FROM project.versions v JOIN project.projects p ON p.id=v.project_id JOIN project.publications pub ON pub.project_version_id=v.id WHERE p.id=$1 AND p.archived_at IS NULL AND NOT p.is_demo AND v.review_status='approved' AND pub.revoked_at IS NULL ORDER BY pub.released_at DESC LIMIT 1`,
    values,
    tx,
  );
}

export function selectProjectVersions2(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT ST_AsGeoJSON(point)::jsonb AS geometry FROM project.versions WHERE id=$1",
    values,
    tx,
  );
}

export function selectSession2(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `SELECT ${fragments[0]} FROM ${fragments[1]} WHERE project_version_id=$1 ${fragments[2]} ORDER BY id`,
    values,
    tx,
  );
}

export function selectProjectDocuments(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT d.file_id,d.category,d.caption FROM project.documents d JOIN data.files f ON f.id=d.file_id WHERE d.project_version_id=$1 AND d.public_allowed AND f.scan_status='clean' ORDER BY d.id",
    values,
    tx,
  );
}

export function selectSession3(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `SELECT kind,count(*)::int AS records,count(point)::int AS mapped FROM wp1.api_map_features GROUP BY kind ORDER BY kind`,
    values,
    tx,
  );
}

export function selectDataDatasets(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `SELECT d.code,d.title,d.domain_no,v.id AS version_id,v.version_label,v.approved_at FROM data.datasets d JOIN data.dataset_versions v ON v.dataset_id=d.id WHERE ${fragments[0]} ORDER BY v.approved_at DESC LIMIT 10`,
    values,
    tx,
  );
}
