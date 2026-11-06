# Version 0.3 deployment update

The current build prepares standalone assets automatically. `npm run build` now runs `next build` followed by scripts/prepare-standalone.mjs. Use `npm run test:production` to start a temporary standalone server and test real HTTP requests with intentionally empty database/OIDC configuration. The self-contained default `npm test` also runs actual embedded PostGIS lifecycle tests, without Docker/Neon. Native PostGIS staging tests remain available separately. Explicit cross-origin browser access is supported via CORS_ALLOWED_ORIGINS. See PROFESSIONAL_BACKEND.md and START_HERE.md first.

# Operations, deployment and verification

## Render

The package includes render.yaml. Deploy as a Node web service, not a static site. Build `npm ci && npm run build`. Start `node .next/standalone/server.js`. Set NODE_ENV=production and HOSTNAME=0.0.0.0; Render supplies PORT. Configure runtime DATABASE_URL and OIDC values. Run migrations separately using the direct owner connection before routing traffic to the new version. Do not include MIGRATION_DATABASE_URL in frontend/build output.

The API has no browser assets beyond a minimal health landing page. The original portal needs its API calls wired using src/lib/client.ts or your fetch layer. For a separate frontend domain, use an explicit reviewed reverse proxy/CORS configuration; do not allow arbitrary origins with credentials.

## Vercel

Import as a Next.js project. Add runtime DATABASE_URL/OIDC configuration in project environment settings. Run migrations separately before deployment. A small pg pool is created per application process; use pooled Neon and tune DB_POOL_MAX to your concurrency allowance. Large XLSX imports should be split into smaller files or moved to a durable worker if they exceed your plan's execution limits. The current importer is transactional and synchronous, capped at 10,000 rows; a hosting plan with too-short request duration can terminate it and roll back.

## Files

This version stores file bytes in PostgreSQL data.file_payloads, capped at 5 MiB, so files survive instance restarts/serverless execution. Metadata uses data.files and database/<uuid> keys. This is an intentional working storage implementation, not an S3 adapter. For larger documents/rasters, replace the blob store with a private object-store adapter while preserving IDs, checksums, scan gates and publication permissions.

Files start pending. An administrator must perform off-system malware checking and then review clean/rejected. No automatic scanning claim is made. Upload types are PDF/JPEG/PNG/XLSX/CSV/JSON, with basic signature checks for binary formats. XLSX parsing is administrator-only and requires a clean reviewed file; do not feed untrusted compressed workbooks to an unsupervised import worker. Restrict administrator accounts and maintain external archive/malware limits.

Protected downloads are owner/admin or authorised project evidence readers. Public downloads require a clean file explicitly attached to published knowledge/policy or an explicitly public project document under its released field whitelist. Source workbooks are not automatically made public.

## Authentication

Use your organisation's OIDC provider and a browser login library compatible with it. Backend verification checks signature, algorithm, issuer, audience, expiry and subject. It provisions no default passwords and does not accept demo auth headers. Match provider subject to provisioned users. Provision two independent reviewers for approval workflows. Backups must include iaa_auth application records; do not modify the provider's managed auth schema.

## Rate limits and request sizes

JSON limit 256 KiB; file limit 5 MiB. A database-backed throttle protects public assessment mutations, default 60 requests/minute shared across callers. Set TRUSTED_CLIENT_IP_HEADER only if your edge proxy reliably overwrites that header; otherwise keep the shared bucket. Add hosting/WAF limits for broad traffic, public searches and upload concurrency. Never use unverified X-Forwarded-For as an identity assertion.

The ops.api_rate_limits table can be pruned by a controlled scheduled SQL job for buckets older than a day. In-app reminders use an explicit admin endpoint; an external scheduler is not automatically enabled by deploying the application. No email/SMS transport is configured or silently invoked.

## Backups and migrations

Use Neon backup/restore and your organisation's retention policy; test recovery on a separate branch/database. Keep exported secrets out of backups shared with clients. db:migrate uses ordered checksummed migrations, a session advisory lock and one transaction per file. Existing migrations must remain byte-identical. New deployments add migrations rather than replacing the baseline. No drop/reset script is used for live data.

Database failures redact SQL/credentials in API errors. Logs include request ID/error type; audit rows record actor/action/target and field names, not sensitive payload copies. Use the database audit stream for review, and retain application/deployment logs according to policy.

## Tests

```powershell
npm test
npm run typecheck
npm run build
```

Unit tests cover permissions, unit calculations, form values/repeats, payload hashing, static table/column allowlists, CSV edge cases, MCDA, shading and cashflow arithmetic. These do not establish live database acceptance.

The package contains tests/integration/lifecycle.test.ts and a GitHub Actions workflow using a PostGIS service. To run against a disposable test server:

```powershell
$env:INTEGRATION_ADMIN_URL="postgresql://test_owner:test_password@localhost:5432/postgres"
npm run test:integration
```

The test creates a uniquely named database on that server, applies every migration, runs data/project/form/monitoring/correction/planning lifecycles, then drops only the database it created. The supplied admin connection therefore needs CREATE DATABASE permission. Do not point it at production infrastructure. Without INTEGRATION_ADMIN_URL the test is explicitly skipped.

Before production acceptance, run that test and a real OIDC login/reviewer exercise on your staging environment. Check imported source records and public permissions with IAA. Review method configuration, units, comparators and required evidence with CSTEP/TERI/IAA before treating outputs as partner-approved analyses.
