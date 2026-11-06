import type { PoolClient } from "pg";
import { execute } from "@/infrastructure/database/connection";

export function selectContentQueryResponses(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "SELECT q.*,COALESCE((SELECT jsonb_agg(jsonb_build_object('answer',r.answer,'created_at',r.created_at)) FROM content.query_responses r WHERE r.query_id=q.id),'[]'::jsonb) AS responses FROM content.queries q WHERE $2 OR q.asked_by=$1 ORDER BY q.created_at DESC LIMIT 100",
    values,
    tx,
  );
}

export function insertContentQueries(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "INSERT INTO content.queries(asked_by,area_id,question,bottleneck_category) VALUES($1,$2,$3,$4) RETURNING id,status",
    values,
    tx,
  );
}

export function selectContentQueries(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "SELECT 1 FROM content.queries WHERE id=$1 FOR UPDATE",
    values,
    tx,
  );
}

export function insertContentQueryResponses(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    "INSERT INTO content.query_responses(query_id,author_id,resource_id,answer) VALUES($1,$2,$3,$4) RETURNING id",
    values,
    tx,
  );
}

export function updateContentQueries(values: unknown[] = [], tx?: PoolClient) {
  return execute(
    "UPDATE content.queries SET status='closed' WHERE id=$1",
    values,
    tx,
  );
}
