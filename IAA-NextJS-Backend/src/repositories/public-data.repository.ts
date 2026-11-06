import type { PoolClient } from "pg";
import { execute } from "@/infrastructure/database/connection";

export function selectSession(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `SELECT kind,id,name,subtype,area_id,dataset_version_id,reference_start,reference_end,attributes,ST_AsGeoJSON(point)::jsonb AS geometry,ST_Distance(point::geography,ST_SetSRID(ST_MakePoint($1,$2),4326)::geography)/1000 AS distance_km FROM wp1.api_map_features WHERE point IS NOT NULL AND ST_DWithin(point::geography,ST_SetSRID(ST_MakePoint($1,$2),4326)::geography,$3) ORDER BY distance_km,id LIMIT $4`,
    values,
    tx,
  );
}

export function selectSession2(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `SELECT kind,id,name,subtype,area_id,dataset_version_id,reference_start,reference_end,attributes,ST_AsGeoJSON(point)::jsonb AS geometry FROM wp1.api_map_features WHERE ($1='' OR name ILIKE '%'||$1||'%') AND ($2::text IS NULL OR kind=$2) AND ($3::uuid IS NULL OR area_id=$3) ORDER BY name,id LIMIT $4 OFFSET $5`,
    values,
    tx,
  );
}

export function selectProjectPublicRegistry(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    `SELECT DISTINCT r.project_id,r.code,r.project_version_id,r.name,r.area_id,r.model_id,r.typology_id,r.status,r.capacity_dc_mwp,ST_AsGeoJSON(r.point)::jsonb AS geometry FROM project.public_registry r JOIN project.projects p ON p.id=r.project_id WHERE p.archived_at IS NULL AND ($1='' OR r.name ILIKE '%'||$1||'%') AND ($2::uuid IS NULL OR r.area_id=$2) AND ($3::text IS NULL OR r.status=$3) ORDER BY r.name,r.project_id LIMIT $4 OFFSET $5`,
    values,
    tx,
  );
}

export function selectProjectProjects(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `SELECT p.id AS project_id,p.code,v.id AS project_version_id,v.name,v.status,v.capacity_dc_mwp,v.site_area_ha,v.cultivated_area_ha,ST_AsGeoJSON(v.point)::jsonb AS geometry,district.name AS district,state.name AS state,design.mounting_type,cp.crop,cp.season,cp.area_ha AS crop_area_ha FROM project.projects p JOIN LATERAL(SELECT * FROM project.versions WHERE project_id=p.id ORDER BY revision DESC LIMIT 1)v ON true JOIN geo.areas district ON district.id=v.area_id LEFT JOIN geo.areas state ON state.id=district.parent_id LEFT JOIN LATERAL(SELECT mounting_type FROM project.designs WHERE project_version_id=v.id ORDER BY array_code LIMIT 1)design ON true LEFT JOIN LATERAL(SELECT c.name AS crop,s.name AS season,cp.area_ha FROM project.crop_plans cp JOIN core.crops c ON c.id=cp.crop_id JOIN core.seasons s ON s.id=cp.season_id WHERE cp.project_version_id=v.id ORDER BY cp.agricultural_year DESC LIMIT 1)cp ON true WHERE p.code='WP1-DEMO-001' AND p.is_demo AND p.archived_at IS NULL AND v.review_status='draft' AND NOT EXISTS(SELECT 1 FROM project.publications pub WHERE pub.project_version_id=v.id AND pub.revoked_at IS NULL) LIMIT 1`,
    values,
    tx,
  );
}

export function selectProjectPublicRegistry2(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    `SELECT DISTINCT r.project_id,r.code,r.project_version_id,r.name,r.area_id,r.model_id,r.typology_id,r.status,r.capacity_dc_mwp,ST_AsGeoJSON(r.point)::jsonb AS geometry FROM project.public_registry r JOIN project.projects p ON p.id=r.project_id WHERE r.project_id=$1 AND p.archived_at IS NULL`,
    values,
    tx,
  );
}

export function selectGeoAreas(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `SELECT id,code_system,code,name,level,parent_id FROM geo.areas WHERE (valid_to IS NULL OR valid_to>=current_date) AND ($1='' OR name ILIKE '%'||$1||'%') AND ($2::uuid IS NULL OR parent_id=$2) AND ($3::text IS NULL OR level=$3) ORDER BY name,id LIMIT $4 OFFSET $5`,
    values,
    tx,
  );
}

export function selectDataDatasets(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `SELECT d.id,d.code,d.title,d.domain_no,d.update_frequency,d.spatial_resolution,v.id AS version_id,v.version_label,v.reference_start,v.reference_end,v.coverage_notes,v.limitations,v.export_allowed,s.name AS source FROM data.datasets d JOIN data.dataset_versions v ON v.dataset_id=d.id JOIN data.sources s ON s.id=d.source_id WHERE d.is_active AND v.status='approved' AND v.is_current AND v.public_allowed AND NOT v.is_demo ORDER BY d.domain_no,d.code`,
    values,
    tx,
  );
}
