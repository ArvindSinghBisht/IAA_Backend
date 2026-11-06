# Delivery status — backend 0.3

The uploaded 0.2 backend has been refactored with explicit routing, controllers, services, repositories, validated environment settings and a prepared standalone runtime. All six supplied migrations remain byte-identical. See PROFESSIONAL_BACKEND.md for detailed changes and boundaries.

## Verified in this delivery

- Unit, routing, permission, architecture and calculation tests.
- Actual SQL execution of all six migrations in a disposable embedded PostgreSQL/PostGIS instance.
- Database workflows covering data/project approval, reporting submission and independent review, corrections/supersession, stored planning/idempotency, CSV import quarantine/review, file permissions and GIS queries.
- JWT signature/claims/user/role verification through a temporary local JWKS provider.
- Production compilation and standalone runtime HTTP smoke checks, including source-pack/OpenAPI/portal assets, JSON validation and correct unavailable/unknown/unsupported-method responses.

See VERIFICATION.json for exact counts. The embedded PostGIS extension is a dev-only experimental test dependency; production still uses pg with native PostgreSQL/PostGIS. Native database concurrency, live Neon infrastructure, real OIDC provider login and hosting load acceptance remain staging checks.

## Runtime configuration and business boundaries

Configure DATABASE_URL, migration-owner connection and OIDC settings. Your real source datasets, source-specific final template mapping and publication decisions still need review. The supplied static portal's reference-pack loading is API-based; full monitoring/admin frontend bindings remain a separate UI implementation task. Partner-approved engineering/weather/thermal/dual-productivity models are not fabricated. File-review gates are manual after off-system scanning; no external mail/SMS or antivirus account is provisioned automatically.

The backend package is runnable and has tested core database workflows. This is not a claim that every possible branch or scientific method has been independently accepted by IAA.
