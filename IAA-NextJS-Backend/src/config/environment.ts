import { z } from "zod";
import { InfrastructureError } from "@/lib/errors";
const databaseSchema = z.object({
  DATABASE_URL: z
    .string()
    .url()
    .refine((v) => ["postgres:", "postgresql:"].includes(new URL(v).protocol)),
  DB_POOL_MAX: z.coerce.number().int().min(1).max(50).default(5),
  DB_QUERY_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(100)
    .max(120000)
    .default(15000),
});
/** Lazy server-only validation allows health/build to work without database credentials. */
export function databaseEnvironment() {
  const result = databaseSchema.safeParse(process.env);
  if (!result.success)
    throw new InfrastructureError(
      "DATABASE_NOT_CONFIGURED",
      "Database configuration is missing or invalid",
    );
  return result.data;
}
