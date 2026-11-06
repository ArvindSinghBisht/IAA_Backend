import type { ClientConfig } from "pg";
/** Shared verified-TLS/channel-binding options for Neon and ordinary PostgreSQL. */
export function pgConfig(connectionString: string): ClientConfig {
  const url = new URL(connectionString);
  if (url.hostname.endsWith(".neon.tech")) {
    // Explicit verify-full avoids changing require-mode semantics in a future pg release.
    url.searchParams.set("sslmode", "verify-full");
  }
  return {
    connectionString: url.toString(),
    enableChannelBinding: true,
    connectionTimeoutMillis: 10000,
    query_timeout: 15000,
  };
}
