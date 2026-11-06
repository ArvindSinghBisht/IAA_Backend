# Backend refactor — version 0.3

## What was found in the upload

The uploaded backend had a catch-all API dispatcher plus an extended dispatcher, queries embedded throughout services and some route code, and a static portal that fetched Information Layer JSON directly from public files. The browser bridge used HTTP APIs; the inspected browser code did not open a PostgreSQL connection directly.

The server must still read/write PostgreSQL. The change is to the access boundary: browser requests go to APIs, and only server-side repositories execute database queries.

## Implemented changes

| Layer | Responsibility |
| --- | --- |
| src/app/api/v1 | Individual native Next.js route modules and allowed HTTP methods |
| src/http/handler.ts | Authentication policy, route UUIDs, JSON limits/media type, CORS, request context and response handling |
| src/controllers | Thin explorer/planning/projects/monitoring/admin/files/learning/documentation controllers |
| src/services | Validation and domain rules: project scope, drafts, review, publication, corrections, imports and calculations |
| src/repositories | Query definitions and server-side reference/document access |
| src/infrastructure/database | Lazy validated pg pool and transactional unit of work |
| src/config | Server environment validation |

82 explicit HTTP operations across 74 native route modules, plus a JSON 404 fallback. The 68 allowlisted resource families remain available through the resource routes. Unsupported methods on known native endpoints receive the framework's 405 response. The route manifest is checked against the filesystem in tests.

Existing payload names, service workflows, migration checksums and public publication gates are retained. Some responses are clarified: unknown routes consistently return 404, malformed IDs return 400 before database work, unavailable database configuration returns 503, and JSON writes require application/json.

### Data and security

- SQL and pg query calls removed from route/controller/service modules. Architectural tests prevent their reintroduction.
- Pool size and query timeout validated; owner and runtime database credentials remain separate deployment settings.
- Strict Zod validation, bounded request/file reads and parameterized values retained.
- Exact-origin CORS configured through CORS_ALLOWED_ORIGINS, including readable error responses to allowed origins.
- Consistent error envelopes and X-Request-Id on success/error responses.
- Fixed approved form-field movement: parent IDs including form, method and layer cannot be switched to escape immutability checks.
- JWT signature, issuer, audience, subject provisioning and database role resolution exercised together in a test using an ephemeral local JWKS server.
- Source-pack endpoints are read-only, backed by private server files. They preserve the legacy JSON shape and send X-IAA-Data-Mode: reference-pack. They do not masquerade as approved live records.
- Developer diagnostics in the static portal are opt-in on localhost with ?debug; they are not added to the normal production UI.

### Deployment

The build now prepares standalone public/static assets. This fixes the missing-asset problem that occurs when a standalone server is deployed without its public/ and .next/static contents. Reference packs and API documentation are copied explicitly. A non-root multi-stage Dockerfile and .dockerignore exclude local secrets and build clutter.

## What is verified

The self-contained suite exercises actual PostgreSQL/PostGIS SQL using the PGlite PostGIS test extension. That extension is experimental and is a dev dependency only; production remains native PostgreSQL/PostGIS via pg. The supplied native PostGIS integration test/CI configuration remains available for staging parity.

Verified flows include:

- All six migrations executing successfully.
- Source/dataset/version creation, independent approval and publication.
- Project profile creation, frozen child records, review and publication.
- Form/indicator/obligation setup; typed response and energy facts; sealed submission, independent review, restricted release, correction and supersession.
- Capability-protected planning creation, stored runs and idempotent replay.
- File upload/quarantine/review/download, CSV import provenance, accepted/error rows, issue resolution and replay protection.
- GIS feature queries, bounding boxes, nearby infrastructure, district observations and export-permission refusal.
- JWT signature/claims/user/role integration and invalid-token refusal.
- Route manifest, architectural boundaries, browser data-source checks, units, validation and calculations.

See VERIFICATION.json for exact final test/build/runtime results. Test coverage is meaningful workflow coverage, not a claim that every possible branch, hosting limit or source dataset has been validated.

## Remaining deployment/business dependencies

- Your live Neon connection, restricted runtime login, OIDC provider accounts and actual access tokens must be configured and exercised in staging.
- The static portal still needs full UI bindings for monitoring/admin form submission. This is backend delivery, not a claim that every frontend button is now wired.
- Actual cleaned source datasets and the final IAA template dictionary need their reviewed mappings and release decisions.
- Partner-approved scientific methods are still required for engineering-grade outputs. The shipped geometric shading model does not calculate weather-based ground temperature; no temperature or grid approval is fabricated.
- File review is a manual gate after off-system scanning; no antivirus service or external email/SMS transport is silently installed.

These requirements are separate from the runnable routing and database-access architecture.

Final result: 36 automated tests passed; six migrations executed in embedded PostGIS; 12 standalone HTTP checks passed. All six migration files are byte-identical to the uploaded source.
