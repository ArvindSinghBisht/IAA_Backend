# Your Neon integration

The code is configured for the supplied Neon project. The private connection settings have been set in the working environment only. Downloadable code uses .env.example with the endpoint/database/username configured and the password replaced by a placeholder. Never commit .env.

The remote connection was attempted on 2 November 2026 but the execution environment could not resolve the hostname (EAI_AGAIN). No schema inspection, migrations, tables, grants or data imports were executed against Neon. DNS failure is not evidence of an incorrect password or a database outage.

## On your Windows machine
1. Extract the package and open IAA-NextJS-Backend.
2. Run npm ci.
3. Run Copy-Item .env.example .env .
4. Open .env in your editor. Replace REPLACE_WITH_YOUR_PASSWORD in both URLs with your Neon password (URL-encode reserved characters if any). Confirm the direct URL in Neon Connect with pooling disabled. This template derives that hostname by removing the documented -pooler suffix; it was not independently connected here.
5. Run npm run db:check. This should print connected: true.
6. Inspect existing schemas before running any migration. If your database already contains the IAA schemas, stop and baseline/adapt them; do not drop schemas.
7. For a NEW empty development DB, run npm run db:migrate. It uses MIGRATION_DATABASE_URL (direct/unpooled) and rejects pooled migration URLs.
8. Run npm run db:check -- --migration to inspect available PostGIS/schema state through the owner connection.
9. Run npm run db:stage to stage the supplied JSON privately.
10. Run npm run dev. Check /api/v1/health and /api/v1/ready on localhost:3000.

The current supplied role is a database-owner role, suitable for schema setup. Before production, create the restricted iaa_app role from the main README/grant script and replace DATABASE_URL with its pooled connection; keep owner MIGRATION_DATABASE_URL only in your local/admin environment.

## Render
Create a Node Web Service (NOT a Static Site). Build npm ci && npm run build; start node .next/standalone/server.js. Add DATABASE_URL in the Render Environment settings using the pooled Neon connection. OIDC variables are needed for WP3 protected APIs. Keep the migration-owner URL out of the deployed service. Run migrations separately before deployment.

## Vercel
Use the Next.js framework preset; set pooled DATABASE_URL and OIDC settings as private environment variables. Do not use NEXT_PUBLIC_DATABASE_URL. Run schema migrations separately, not in a public route.

A connection contains a password. As it has been pasted into chat, rotate it in Neon and update your private environment settings. The ZIP contains no password.
