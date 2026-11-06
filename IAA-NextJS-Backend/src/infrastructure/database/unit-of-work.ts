import type { PoolClient } from "pg";
import { pool } from "./connection";
/** A single checked-out connection keeps all business operation writes atomic. */
export async function unitOfWork<T>(
  action: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    const result = await action(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* Preserve the original domain/database error. */
    }
    throw error;
  } finally {
    client.release();
  }
}
