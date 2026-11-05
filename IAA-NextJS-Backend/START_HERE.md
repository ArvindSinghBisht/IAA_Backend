# IAA backend 0.2 — start here

This is the combined Next.js backend source for WP1, WP2, WP3 and administration. It includes the 116-table canonical baseline, six ordered migrations, 68 allowlisted resource APIs, project and monitoring review workflows, imports, files, GIS and configurable planning engines. Database tables and API resources are different counts; some tables are written only by workflow services.

## Use your existing Neon database

1. Extract the ZIP to a new directory. Keep your previous project until this version is verified.
2. Copy your working `.env` into the extracted project directory. The ZIP contains placeholders only.
3. Run these in PowerShell from that directory:

```powershell
npm ci
npm run db:check
node --import tsx scripts/check-database.ts --migration
npm run db:migrate
npm test
npm run build
npm run dev
```

Open `http://localhost:3000/api/v1/health` then `/api/v1/ready`.

Migrations 001–004 are unchanged from the previous extended package. This version adds 005 and 006. If the migration runner reports a checksum difference, stop and retain the exact error; do not delete the tracker or edit applied SQL. Application accounts use `iaa_auth`; Neon's managed `auth` schema is untouched.

The database login must be able to install PostGIS during initial setup. A successful connection check alone does not mean migrations have been applied.

## Required configuration

| Setting | Purpose |
| --- | --- |
| DATABASE_URL | Pooled Neon runtime connection; use a restricted iaa_app login for deployment |
| MIGRATION_DATABASE_URL | Direct/unpooled owner connection; used locally for migrations only |
| OIDC_ISSUER | Issuer of your identity provider |
| OIDC_AUDIENCE | API audience included in access tokens |
| OIDC_JWKS_URL | Provider's signing-key endpoint |
| DB_POOL_MAX | Default five runtime database connections per application process |

Configure an OIDC provider that issues RS256 or ES256 access tokens with `sub`, `exp`, `iat`, correct issuer and audience. Provision the token's exact subject in `iaa_auth.users` using `db:provision-user`. Protected APIs deliberately remain unavailable until authentication is configured; no shared default password or auth bypass is shipped. The backend verifies access tokens; it does not host its own identity-provider login pages.

You need separate contributor and reviewer accounts for independent approvals. Global administrators can provision identities; ordinary roles remain scoped to their assigned organisation or project membership.

After all migrations, create a restricted LOGIN role named `iaa_app`, run `db/runtime-grants.sql` as migration owner, then put that runtime user's pooled URI in the server's DATABASE_URL. Keep the owner URI only in local/CI migration configuration. Do not expose either URI in frontend code.

## What to open next

- `docs/WORKFLOWS.md`: exact setup order and JSON examples.
- `docs/RESOURCE_APIS.md`: all resource names and scopes.
- `docs/openapi.json`: import into an OpenAPI viewer/Postman; resource write schemas contain writable columns and required fields. Workflow payload examples are in WORKFLOWS.md.
- `docs/IAA.postman_collection.json`: workflow request index; supply IDs, tokens and request bodies.
- `src/lib/client.ts`: browser/client integration helper for the existing portal.
- `docs/OPERATIONS.md`: Render/Vercel, backup, file review and testing.
- `docs/DELIVERY_STATUS.md`: verification and scientific-model boundaries.

## Isolated development data

Only on a development database:

```powershell
$env:ALLOW_DEMO_SEED="true"
npm run db:seed:dev
```

This creates references and three demo identity subjects, without publishing projects/datasets. Your OIDC tokens must still match the subjects. Replace these identities with your actual users before deployment. No business data, Excel records or project facts are invented or auto-published.

## Frontend connection

This is the backend package. Deploying it does not automatically wire the old static portal. The UI needs to call these APIs and use returned database UUIDs. A browser access token must come from your identity-provider login flow. Use the client helper or your existing fetch layer. Prefer same-origin UI and API; configure a reviewed proxy or explicit CORS policy if you host them separately.
