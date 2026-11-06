import type { PoolClient } from "pg";
import { execute } from "@/infrastructure/database/connection";

export function insertPlanAssessments(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `INSERT INTO plan.assessments(name,area_id,point,access_token_hash,expires_at) VALUES($1,$2,ST_SetSRID(ST_MakePoint($3,$4),4326),$5,now()+interval '7 days') RETURNING id,name,area_id,expires_at`,
    values,
    tx,
  );
}

export function selectPlanAssessments(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT * FROM plan.assessments WHERE id=$1 AND expires_at>now() FOR UPDATE",
    values,
    tx,
  );
}

export function selectPlanScenarios(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT id,name,revision,parameters,updated_at FROM plan.scenarios WHERE assessment_id=$1 ORDER BY created_at",
    values,
    tx,
  );
}

export function insertPlanScenarios(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `INSERT INTO plan.scenarios(assessment_id,name,parameters,input_hash) VALUES($1,$2,$3,$4) ON CONFLICT(assessment_id,name) DO UPDATE SET parameters=excluded.parameters,input_hash=excluded.input_hash,revision=plan.scenarios.revision+1,updated_at=now() RETURNING id,name,revision,parameters`,
    values,
    tx,
  );
}

export function selectPlanScenarios2(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT * FROM plan.scenarios WHERE id=$1 AND assessment_id=$2 FOR UPDATE",
    values,
    tx,
  );
}

export function selectPlanRuns(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT r.id,r.input_hash,r.scenario_id,s.output FROM plan.runs r JOIN plan.api_run_summaries s ON s.run_id=r.id WHERE r.idempotency_key=$1",
    values,
    tx,
  );
}

export function selectPlanMethodVersions(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT mv.*,m.function_code FROM plan.method_versions mv JOIN plan.methods m ON m.id=mv.method_id WHERE mv.id=ANY($1::uuid[]) AND mv.status='approved'",
    values,
    tx,
  );
}

export function selectDataDatasetVersions(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT id,dataset_id,version_label,reference_start,reference_end FROM data.dataset_versions WHERE id=ANY($1::uuid[]) AND status='approved' AND planning_allowed AND NOT is_demo",
    values,
    tx,
  );
}

export function selectDvId(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT fv.approved_hosting_mw,fv.dataset_version_id FROM wp1.feeder_versions fv JOIN data.dataset_versions dv ON dv.id=fv.dataset_version_id WHERE fv.id=$1 AND dv.status='approved' AND dv.planning_allowed AND NOT dv.is_demo",
    values,
    tx,
  );
}

export function selectNId(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `SELECT f.id AS facility_version_id,f.dataset_version_id,n.name,n.facility_type,ST_Distance(f.point::geography,a.point::geography)/1000 AS distance_km FROM wp1.facility_versions f JOIN wp1.facilities n ON n.id=f.facility_id JOIN data.dataset_versions dv ON dv.id=f.dataset_version_id CROSS JOIN plan.assessments a WHERE a.id=$1 AND f.dataset_version_id=ANY($2::uuid[]) AND f.point IS NOT NULL AND dv.status='approved' AND dv.planning_allowed AND NOT dv.is_demo AND ST_DWithin(f.point::geography,a.point::geography,50000) ORDER BY distance_km,f.id LIMIT 50`,
    values,
    tx,
  );
}

export function insertPlanRuns(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    `INSERT INTO plan.runs(scenario_id,scenario_revision,input_snapshot,input_hash,engine_version,status,started_at,finished_at,idempotency_key) VALUES($1,$2,$3,$4,'iaa-api-engines-2','partial',now(),now(),$5) RETURNING id,status,scenario_revision,input_hash`,
    values,
    tx,
  );
}

export function insertPlanApiRunSummaries(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "INSERT INTO plan.api_run_summaries(run_id,output) VALUES($1,$2)",
    values,
    tx,
  );
}

export function insertPlanRunDatasets(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "INSERT INTO plan.run_datasets(run_id,dataset_version_id,usage_role) VALUES($1,$2,'scenario')",
    values,
    tx,
  );
}

export function insertPlanRunMethods(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "INSERT INTO plan.run_methods(run_id,method_version_id,function_code) VALUES($1,$2,$3)",
    values,
    tx,
  );
}

export function insertPlanResults(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "INSERT INTO plan.results(run_id,method_version_id,function_code,status,result,explanation) VALUES($1,$2,$3,$4,$5,$6)",
    values,
    tx,
  );
}

export function insertPlanGaps(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "INSERT INTO plan.gaps(run_id,function_code,severity,reason,required_action) VALUES($1,$2,'warning',$3,'Configure approved method and complete versioned inputs')",
    values,
    tx,
  );
}

export function selectPlanRuns2(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT r.id,r.scenario_id,r.scenario_revision,r.status,r.input_snapshot,r.input_hash,r.engine_version,r.created_at,s.output FROM plan.runs r JOIN plan.scenarios sc ON sc.id=r.scenario_id JOIN plan.api_run_summaries s ON s.run_id=r.id WHERE sc.assessment_id=$1 ORDER BY r.created_at DESC LIMIT 100",
    values,
    tx,
  );
}
