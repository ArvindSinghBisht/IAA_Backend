import { databaseEnvironment } from "@/config/environment";
import pg, { type PoolClient } from "pg";
import { pgConfig } from "@/lib/pg-config";
const globalDb = globalThis as unknown as { iaaPool?: pg.Pool };
export function pool() {
  const env = databaseEnvironment();
  return (globalDb.iaaPool ??= new pg.Pool({
    ...pgConfig(env.DATABASE_URL),
    max: env.DB_POOL_MAX,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    statement_timeout: env.DB_QUERY_TIMEOUT_MS,
  }));
}
export async function execute(
  text: string,
  values: unknown[] = [],
  client?: PoolClient,
) {
  return client ? client.query(text, values) : pool().query(text, values);
}
