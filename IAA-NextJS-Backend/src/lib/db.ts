/** Compatibility for migration scripts and database fixtures. Application code uses repositories. */
export { pool, execute as query } from "@/infrastructure/database/connection";
export { unitOfWork as transaction } from "@/infrastructure/database/unit-of-work";
