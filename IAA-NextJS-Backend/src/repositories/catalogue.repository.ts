import type { PoolClient } from "pg";
import { execute } from "@/infrastructure/database/connection";

export function selectContentResources(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `SELECT r.id,r.code,r.resource_type,r.theme,rv.id AS version_id,rv.title,rv.body,rv.external_uri,rv.published_date,rv.locale_id,rv.file_id,v.id AS dataset_version_id,v.reference_start,v.reference_end,s.name AS source FROM content.resources r JOIN content.resource_versions rv ON rv.resource_id=r.id JOIN data.dataset_versions v ON v.id=rv.dataset_version_id JOIN data.datasets d ON d.id=v.dataset_id JOIN data.sources s ON s.id=d.source_id WHERE ${fragments[0]} AND ($1='' OR rv.title ILIKE '%'||$1||'%') AND ($2::text IS NULL OR r.theme=$2) AND ($3::uuid IS NULL OR EXISTS(SELECT 1 FROM content.resource_areas a WHERE a.resource_id=r.id AND a.area_id=$3)) ORDER BY rv.published_date DESC NULLS LAST,rv.id LIMIT $4 OFFSET $5`,
    values,
    tx,
  );
}

export function selectContentPolicies(
  values: unknown[] = [],
  tx?: PoolClient,
  fragments: readonly unknown[] = [],
) {
  return execute(
    `SELECT p.id,p.code,p.name,p.kind,pv.id AS version_id,pv.effective_from,pv.effective_to,pv.status,pv.eligibility,pv.benefits,pv.summary,pv.review_due,pv.file_id,v.id AS dataset_version_id,s.name AS source FROM content.policies p JOIN content.policy_versions pv ON pv.policy_id=p.id JOIN data.dataset_versions v ON v.id=pv.dataset_version_id JOIN data.datasets d ON d.id=v.dataset_id JOIN data.sources s ON s.id=d.source_id WHERE ${fragments[0]} AND ($1='' OR p.name ILIKE '%'||$1||'%') AND ($2::uuid IS NULL OR EXISTS(SELECT 1 FROM content.policy_areas a WHERE a.policy_version_id=pv.id AND a.area_id=$2)) ORDER BY p.name,pv.id LIMIT $3 OFFSET $4`,
    values,
    tx,
  );
}

export function selectGeoAreas(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT id,name,level,parent_id,code FROM geo.areas WHERE id=$1",
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
    `SELECT o.id,o.metric_code,o.category_code,o.period_start,o.period_end,o.value,o.value_status,o.unit_id,o.method_reference,o.dataset_version_id,s.name AS source,v.coverage_notes FROM wp1.environment_observations o JOIN data.dataset_versions v ON v.id=o.dataset_version_id JOIN data.datasets d ON d.id=v.dataset_id JOIN data.sources s ON s.id=d.source_id WHERE o.area_id=$1 AND ${fragments[0]} ORDER BY o.metric_code,o.period_end DESC,o.id LIMIT $2 OFFSET $3`,
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
    `SELECT * FROM ${fragments[0]} ORDER BY code LIMIT 1000`,
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
    `SELECT d.id,d.code,d.title,d.domain_no,d.update_frequency,d.spatial_resolution,v.id AS version_id,v.version_label,v.reference_start,v.reference_end,v.coverage_notes,v.limitations,v.export_allowed,s.name AS source,s.source_uri,s.licence,s.rights_notes FROM data.datasets d JOIN data.dataset_versions v ON v.dataset_id=d.id JOIN data.sources s ON s.id=d.source_id WHERE d.id=$1 AND ${fragments[0]}`,
    values,
    tx,
  );
}
