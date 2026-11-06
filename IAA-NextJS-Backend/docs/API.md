# Version 0.3 API architecture

Each implemented endpoint now has its own native Next.js route module. See PROFESSIONAL_BACKEND.md for the refactor and WORKFLOWS.md for existing payload contracts. The current manifest is src/generated/route-manifest.json; OpenAPI is served at /api/v1/openapi. Send application/json on JSON writes. API consumers never receive database credentials or a database driver.

# API reference

Base: `/api/v1`.

The current reference is `openapi.json`, `RESOURCE_APIS.md` and `WORKFLOWS.md` in this directory. The OpenAPI resource schemas list exact write fields. Workflow service payloads are illustrated in WORKFLOWS.md; the OpenAPI workflow body objects are broad descriptions, not a claim of complete machine-generated Zod parity.

JSON success is usually `{data: ...}`; paged responses also include `meta`. GeoJSON endpoints return FeatureCollection. Errors have `{error:{code,message,requestId}}`. Constraint failures return 409 or 422 without revealing SQL or credentials. JSON bodies are limited to 256 KiB; raw authenticated file uploads to 5 MiB. Files/CSV endpoints return bytes rather than JSON.

Protected endpoints use `Authorization: Bearer <access token>`. Anonymous planning follow-ups use `X-Planning-Token`. Public endpoints expose only approved/released records with explicit permissions; missing data is never a fabricated zero.
