# Run the IAA backend

## 1. Install

Use Node.js 22 or newer. Open PowerShell **inside the extracted IAA-NextJS-Backend folder**, where package.json is located:

```powershell
npm ci
```

Keep your existing working `.env`. For a fresh folder only:

```powershell
if (!(Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
```

Set DATABASE_URL to the pooled runtime PostgreSQL/Neon connection and MIGRATION_DATABASE_URL to the unpooled migration-owner connection. Never put these in browser JavaScript or NEXT_PUBLIC variables. Set the OIDC issuer/audience/JWKS values to use protected APIs.

## 2. Verify database configuration and migrations

```powershell
npm run db:check
node --import tsx scripts/check-database.ts --migration
npm run db:migrate
```

All six migration files are unchanged from the uploaded project. Existing applied migrations are skipped by their checksums. **Do not delete the migration tracker, reset schemas, or rewrite applied migrations.** The application uses iaa_auth, not Neon's managed auth schema.

Use a separate restricted iaa_app login for the deployed DATABASE_URL. Apply db/runtime-grants.sql as owner after migrations. Keep migration-owner credentials out of the web application's frontend and source repository.

## 3. Verify and start

```powershell
npm run typecheck
npm test
npm run build
npm start
```

For development, `npm run dev` starts the development server instead. Open:

- http://localhost:3000 — portal
- http://localhost:3000/api/v1 — API index
- http://localhost:3000/api/v1/health — process health
- http://localhost:3000/api/v1/ready — database availability (503 while unconfigured)
- http://localhost:3000/api/v1/openapi — API specification

Tests can run **without configuring Neon**. They use a disposable embedded PostgreSQL/PostGIS instance, never your live database. Production execution does not use that test database.

## 4. Authentication and frontend

The backend validates real OIDC access tokens. Provision the provider's exact subject using scripts/provision-user.ts or the authenticated admin user API. Use separate contributor and reviewer identities for independent approvals. The identity-provider login UI and real provider settings remain your deployment configuration.

The included static portal now obtains the supplied Information Layer pack through API endpoints; it is not automatically converted into a live editor for every monitoring/admin API. Fully connecting those UI forms is a separate frontend task. Use src/lib/client.ts and docs/WORKFLOWS.md. Published database records use their dedicated WP1 APIs and remain subject to approval/publication permissions.

For a separate frontend origin, set `CORS_ALLOWED_ORIGINS=https://your-frontend.example` (comma-separated exact origins). Same-origin access needs no CORS setting. Never use a wildcard for authenticated application origins.

## 5. Deploy

Render configuration, Dockerfile and a standalone preparation script are included. `npm run build` copies the portal assets, source packs and OpenAPI document into .next/standalone. Start it with:

```powershell
node .next/standalone/server.js
```

Run migrations separately before deployment. On Render/Vercel, set the runtime database/OIDC environment values through hosting settings. See docs/OPERATIONS.md and docs/PROFESSIONAL_BACKEND.md for verified behaviour and remaining deployment dependencies.
