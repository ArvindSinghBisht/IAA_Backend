# Delivery status — backend 0.2

## Implemented source

- Next.js API server, parameterised PostgreSQL/PostGIS queries, bounded JSON/file reads, structured errors, OIDC access-token verification, organisation/project RBAC and append-only auditing.
- 116-table canonical schema, immutable monitoring payload guards, six ordered migrations, 68 strictly allowlisted resource definitions and 73 explicit public/workflow routes in the API index. The resource routes add their own CRUD operations; this is not a count of 73 total HTTP operations.
- WP1: public/current/approved data gates, mixed area/project/infrastructure search, nearby geodesic queries, GIS layer metadata and bounding-box features, boundaries, exact-area environmental/crop/land/irrigation data, comparisons, permitted paged CSV, metadata, project whitelists, knowledge/policies and approved attachments.
- WP2: expiring anonymous capabilities, scenario revisions, immutable idempotent run snapshots, dataset/method pins, eight configurable engine implementations, rule explanations, gaps and printable report JSON.
- Project backend: creation, baseline edits, typed design/grid/crop/land/partner/document records, six-section narratives, independent review, publication/revocation and cloned revisions.
- WP3: master forms/indicators/periods/obligations, configurable answers including date/choice/JSON/repeats/visibility, all canonical payload fact tables, validation, sealed payload hashes, independent review, corrections, supersession/revocation, descriptive metrics and restricted approved dashboards.
- Admin: source/version management, XLSX/CSV/JSON row mapping, provenance and quarantine, manual file-review gate, identity provisioning, project memberships, pseudonymous beneficiary records, queries/answers, due-date in-app reminders and audit reads.
- Deployment files, SDK helper, OpenAPI resource schemas, request index, example workflow guide, explicit dev seed and PostGIS integration test/CI configuration.

## Boundaries that cannot be filled by inventing outputs

1. Source data is not bundled as approved business data. Your actual cleaned sheets, geography UUID mappings, source rights and release decisions must be imported and reviewed. Detailed GIS coverage is limited to supplied datasets; basemap licences/tiles are external.
2. Partner-approved methods and thresholds are not silently seeded. The installed configurable engines execute actual arithmetic/rules, but output remains indicative where inputs are user declared. Method approval is an explicit administrative decision, not proof that CSTEP/TERI/IAA endorsed a formula.
3. Shading is a flat-ground single-instant geometric projection using supplied sun position. Annual irradiance, diffuse light, terrain, crop response and weather-driven ground heat require a validated scientific model/data source; temperature is never fabricated.
4. Hosting compares requested MW against the recorded approved hosting value. It does not infer feeder hosting from spare nameplate capacity or grant grid connection permission. Market distances are geodesic, without road routing/travel-time claims. Scheme matches are potential eligibility matches.
5. Monitoring provides descriptive calculations and workflow checks. A formal dual-productivity/LER calculation needs agreed conventional-energy and crop comparators plus approved methods. Public small-cell/person reporting is deliberately not exposed. The backend does not implement plaintext personal-contact/beneficiary-PII capture; use the encrypted private-table design only after a reviewed key-management integration.
6. Files are working database blobs up to 5 MiB with manual review. Automated antivirus, private cloud object storage for large rasters, email/SMS delivery and asynchronous external connectors are deployment integrations, not silently active features.
7. Authentication requires your configured OIDC provider. The original static frontend still needs API wiring and the login flow. Browser mini-map movement is UI logic, not a backend calculation.
8. The source-specific 74-field template dictionary and the unavailable feature DOCX were not independently verified in this run. Typed schema resources plus field-code narratives provide storage, but a field-by-field source-template acceptance check is still required.

## Verification

The unit suite and production build are run during packaging. See VERIFICATION.json for exact results. All six SQL migration files are parsed with a PostgreSQL parser; syntax validation does not validate runtime permissions or every PostGIS plan. The end-to-end PostGIS test is supplied but was skipped here because no disposable integration database was configured. Live Neon migrations, provider login and IAA acceptance are not claimed as passed.
