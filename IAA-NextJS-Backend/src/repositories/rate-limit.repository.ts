import type { PoolClient } from "pg";
import { execute } from "@/infrastructure/database/connection";

export function insertOpsApiRateLimits(
  values: unknown[] = [],
  tx?: PoolClient,
) {
  return execute(
    `INSERT INTO ops.api_rate_limits(bucket) VALUES($1) ON CONFLICT(bucket) DO UPDATE SET requests=CASE WHEN ops.api_rate_limits.window_start<now()-interval '1 minute' THEN 1 ELSE ops.api_rate_limits.requests+1 END,window_start=CASE WHEN ops.api_rate_limits.window_start<now()-interval '1 minute' THEN now() ELSE ops.api_rate_limits.window_start END RETURNING requests`,
    values,
    tx,
  );
}
