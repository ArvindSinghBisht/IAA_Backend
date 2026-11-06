# IAA portal backend — version 0.3

Next.js / TypeScript APIs for WP1, WP2, WP3 and administration, with PostgreSQL/PostGIS behind a server-side repository layer.

**Start with [START_HERE.md](START_HERE.md).**

## Architecture

Browser → explicit API route → controller → validated service and permissions → repository → PostgreSQL/PostGIS.

- Native route modules under `src/app/api/v1/`, rather than a single routing switch.
- Thin domain controllers under `src/controllers/`.
- Business workflows under `src/services/`; no direct database queries in routes/controllers/services.
- Parameterized queries under `src/repositories/`; connection pooling and atomic transactions under `src/infrastructure/database/`.
- OIDC JWT verification, organisation/project scope, strict request validation, explicit CORS and consistent request-ID errors.
- Existing schema, data publication gates, planning method/version pins, monitoring review history and audit controls retained.
- Browser source-pack reads now use `/api/v1/wp1/information-layer` endpoints. The supplied reference pack remains distinct from approved database publications.

## Commands

```powershell
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm start
```

`npm test` is self-contained: unit/architecture/route tests plus actual SQL lifecycle tests using embedded PostgreSQL/PostGIS. No Neon credentials or Docker are needed for that suite. Production still connects to PostgreSQL through `pg`; the embedded database is a development-test dependency only.

Actual database-backed endpoints require a configured DATABASE_URL and applied migrations. Protected endpoints additionally require your OIDC provider and provisioned subjects. See START_HERE.md. No credentials or authentication bypass are shipped.

## Documentation

- [Professional refactor and verification](docs/PROFESSIONAL_BACKEND.md)
- [Workflow request examples](docs/WORKFLOWS.md)
- [Resource API index](docs/RESOURCE_APIS.md)
- OpenAPI: `docs/openapi.json`, served at `/api/v1/openapi`
- Postman: `docs/IAA.postman_collection.json`
- [Deployment and operations](docs/OPERATIONS.md)

Scientific-method and live-deployment boundaries remain explicit; software tests do not imply partner approval of analytical formulas.
