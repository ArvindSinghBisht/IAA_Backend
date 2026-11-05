# Dedicated application authentication schema

The existing Neon auth schema is owned by cloud_admin and is not modified. This build uses iaa_auth for application users, roles, permissions and user-role mappings. All baseline foreign keys, workflow SQL, API queries, provisioning and runtime grants have been updated. API paths such as /api/v1/auth/me and the source file src/lib/auth.ts are unchanged.

This baseline adjustment is for the reported state where NO migrations were applied. Do not apply it over an already migrated database without a proper incremental migration.

Preserve your existing private .env. Install dependencies if necessary, then run npm run typecheck and npm run db:migrate. If baseline succeeds but a later migration fails, keep the successful migrations and share the next error; do not drop schemas or edit an already applied migration.

There is no need to grant permissions on auth or change its owner. PostgreSQL transaction rollback should have removed the failed baseline's objects; the migration tracker is intentionally retained.

Live Neon migration execution remains unverified from this workspace.
