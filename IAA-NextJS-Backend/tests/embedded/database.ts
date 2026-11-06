import { PGlite } from "@electric-sql/pglite";
import { postgis } from "@electric-sql/pglite-postgis";
import { readFile, readdir } from "node:fs/promises";
import type pg from "pg";
/** Test-only PostgreSQL/PostGIS WASM adapter. Production continues to use pg/Neon. */
export async function embeddedDatabase() {
  const db = new PGlite({ extensions: { postgis } });
  for (const name of (await readdir("db/migrations"))
    .filter((n) => n.endsWith(".sql"))
    .sort())
    await db.exec(await readFile("db/migrations/" + name, "utf8"));
  let gate = Promise.resolve();
  async function acquire() {
    const previous = gate;
    let release!: () => void;
    gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    await previous;
    return release;
  }
  async function execute(sql: string, values: unknown[] = []) {
    const out = await db.query(sql, values);
    for (const row of out.rows as Record<string, unknown>[])
      for (const [key, value] of Object.entries(row))
        if (value instanceof Uint8Array) row[key] = Buffer.from(value);
    return {
      ...out,
      rowCount: out.rows.length || out.affectedRows || 0,
      command: sql.trim().split(/\s+/)[0],
    };
  }
  const adapter = {
    query: async (sql: string, values: unknown[] = []) => {
      const release = await acquire();
      try {
        return await execute(sql, values);
      } finally {
        release();
      }
    },
    connect: async () => {
      const release = await acquire();
      return { query: execute, release };
    },
    end: async () => db.close(),
  } as unknown as pg.Pool;
  const state = globalThis as unknown as { iaaPool?: pg.Pool };
  const previous = state.iaaPool;
  state.iaaPool = adapter;
  // Dummy address satisfies lazy configuration only; no network connection is made by this adapter.
  const old = process.env.DATABASE_URL;
  process.env.DATABASE_URL =
    "postgresql://test_only:test_only@127.0.0.1/embedded";
  return {
    db,
    pool: adapter,
    close: async () => {
      state.iaaPool = previous;
      if (old) process.env.DATABASE_URL = old;
      else delete process.env.DATABASE_URL;
      await db.close();
    },
  };
}
