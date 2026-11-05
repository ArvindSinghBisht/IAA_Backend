# Workflows and request examples

All paths start `/api/v1`. UUID placeholders must be replaced with existing IDs returned by this database. JSON examples are illustrative inputs, not seeded or approved project facts.

## 1. Create references and users

Use `npm run db:provision-user` with the environment variables documented in `scripts/provision-user.ts` to create the first global administrator. Identity subjects must match real access-token `sub` claims. Thereafter `POST /admin/users` accepts:

```json
{"subject":"provider-subject","email":"person@example.org","name":"Project contributor","organisationId":"<organisation-id>","role":"project_user"}
```

Allowed roles: system_admin, data_steward, project_user, reviewer, management. Non-admin roles require an organisation. POST `/admin/projects/:projectId/memberships` assigns cross-organisation read/edit membership with `userId`, `role` (project_user/data_steward/management), optional `validUntil`. Review authority requires an organisation reviewer role or a global administrator, not a contributor membership.

`GET /manage/resources` returns the full resource dictionary to administrators. For each resource:

```text
GET    /manage/resources/core.organisations?limit=50&offset=0
POST   /manage/resources/core.organisations
PATCH  /manage/resources/core.organisations/:recordId
```

Example organisation body:
```json
{"code":"IAA-PARTNER","name":"Partner organisation","organisation_type":"research"}
```

Reference/configuration writes are global-administrator only. Profile/fact writes use project permissions. Scoped list endpoints require `parentId`: a project-version UUID for profile resources, a submission-revision UUID for fact resources, or a project UUID for project resources. Unknown fields/tables and direct approval/status/publication assignments are rejected. Resource column names use snake_case. OpenAPI lists all required columns and types.

## 2. Dataset import and publication

1. Create `data.sources` (name, optional licence/rights/source_uri), then `data.datasets` (source_id, code, title, domain_no 1–10).
2. Create `data.dataset_versions` (dataset_id, version_label, optional reference dates, source CRS/units, limitations/coverage_notes). This always starts private and draft. `is_demo` can explicitly mark test data; demo versions cannot publish.
3. POST raw file bytes to `/files` with Bearer token, the actual supported MIME in Content-Type and a plain X-File-Name header. Limit 5 MiB. Response gives a file ID with pending review.
4. An administrator reviews the file after off-system malware checking: POST `/files/:id/review` with `{"status":"clean","reason":"Checked using organisation scanner"}` or status rejected. This is a manual review gate; the backend does not pretend to run a virus scanner.
5. Create stable referenced identities first, e.g. facilities, substations, feeders, crops and geographic areas. Import version rows using real UUID mappings; there is no guessed matching of district names.
6. POST `/admin/imports`:

```json
{
  "datasetVersionId":"<draft-version-id>",
  "fileId":"<clean-file-id>",
  "sheet":"Sheet1",
  "target":"wp1.environment_observations",
  "headerRows":1,
  "mapping":{"metric_code":0,"period_start":1,"period_end":2,"value":3},
  "constants":{"area_id":"<area-id>","unit_id":"<unit-id>","resolution":"district"},
  "idempotencyKey":"partner-weather-import-001"
}
```

Mapping column indices start at zero. Repeated headers remain preserved in original cell arrays. Formula cells are quarantined rather than executed or trusted from cached results. CSV and JSON arrays-of-arrays use the same mapping. Dates should be ISO dates or actual XLSX dates. Import geometry is a GeoJSON Geometry in EPSG:4326; reproject source geometries before import and record source CRS. GeoJSON FeatureCollections need preprocessing into rows.

The target must be an allowlisted version-bound GIS/content table. The service inserts accepted rows under the exact dataset version, retains original rows and quarantines failures. Maximum 10,000 rows and 300 columns per file. Inspect `GET /admin/imports/:jobId/rows?limit=50&offset=0`. `POST /admin/issues/:issueId/resolve` takes a documented resolution. Resolving an issue does not invent or insert a missing observation; review whether the failed row was deliberately excluded or corrected using the resource API.

7. Submit dataset with `POST /admin/datasets/:versionId/transition`:
```json
{"action":"submit","reason":"Source and row validation complete"}
```
8. A different administrator approves with action approve and reason; unresolved error-level import issues block approval. Reject is also supported. For publication:
```json
{"action":"publish","reason":"Partner-approved release and rights checked","publicAllowed":true,"planningAllowed":true,"exportAllowed":false}
```

Publication switches the current version atomically. Historical versions remain pinned to old runs. Retire removes current/public/planning/export permissions. Approved version rows cannot be edited through the resource API; create a new version.

## 3. WP1 screen data

| Screen/use | API |
| --- | --- |
| Home | GET /wp1/home |
| Universal search | GET /wp1/search?q=... |
| District selector | GET /wp1/areas?level=district&parentId=... |
| Map features | GET /wp1/features?kind=substation&areaId=... |
| Nearby infrastructure/projects | GET /wp1/nearby?lat=28.6&lon=77.2&radiusKm=10 |
| Layer legend/style | GET /wp1/layers |
| Overlay features | GET /wp1/layers/:id/features?west=...&south=...&east=...&north=... |
| Area polygon | GET /wp1/areas/:id/boundary |
| Climate/solar/livestock metrics | GET /wp1/districts/:id or /wp1/districts/:id/environment |
| Crops, land, irrigation | GET /wp1/districts/:id/crops, /land, /irrigation |
| Public project registry/detail | GET /wp1/projects, /wp1/projects/:projectId |
| Metadata and download permissions | GET /wp1/datasets, /wp1/datasets/:datasetId |
| Knowledge/policy panels | GET /wp1/resources, /wp1/policies |
| Public reviewed attachment | GET /wp1/files/:fileId |
| Permitted paged CSV | GET /wp1/exports/:datasetVersionId/wp1.environment_observations?limit=200&offset=0 |

Facilities distinguish real livestock/fodder sites through facility_type; electricity feeders remain electrical feeders. A district livestock statistic does not imply a livestock facility at a point. Missing coordinates are not guessed. Nearby uses geodesic straight-line kilometres, not road travel time. Detailed GIS coverage depends on supplied approved data; this backend does not ship nationwide source data or a licensed basemap service.

POST `/wp1/compare` enforces the same metric, unit, category and dates across 2–4 areaIds:
```json
{"areaIds":["<area-1>","<area-2>"],"metricCode":"annual_rainfall","categoryCode":"","periodStart":"2025-01-01","periodEnd":"2025-12-31","unitId":"<mm-unit-id>"}
```

The draggable map/mini-map is frontend behaviour. These APIs supply geometry and location data for every tab; they do not implement browser window dragging.

## 4. Project profile and six sections

POST `/internal/projects`:
```json
{"code":"IAA-001","organisationId":"<org-id>","profile":{"name":"Site A","areaId":"<area-id>","status":"planned","effectiveFrom":"2026-11-03","capacityDcMwp":2,"siteAreaHa":4}}
```

GET `/internal/projects` lists accessible projects. GET `/internal/projects/:projectId` lists revisions. GET `/internal/profiles/:versionId` returns baseline and notes. PATCH the latter with snake_case baseline fields (capacity_ac_mw, storage_mwh, point:{lat,lon}, ownership model IDs, areas, commissioning date, summary, objective, effective dates). Only drafts can change.

Use scoped resource APIs for `project.partners`, `project.land_uses`, `project.designs`, `project.grid_connections`, `project.crop_plans`, `project.profile_notes`, `project.documents`. A draft array example:
```json
{"project_version_id":"<version-id>","array_code":"A","module_technology":"mono-Si","module_power_wp":550,"module_count":100,"clearance_m":3,"row_pitch_m":6,"tilt_degrees":20,"azimuth_degrees":180}
```

Narrative fields use POST `/internal/profiles/:versionId/notes`:
```json
{"fieldCode":"grazing_arrangement","sectionCode":"land_community","narrative":"Verified arrangement description","visibility":"restricted"}
```

Six section codes: overview, land_community, technical_design, grid_policy, agriculture, socio_economic_learning. Measurable facts belong in typed tables; field notes can store the remaining template narratives by stable fieldCode. The source-specific 74-field dictionary must be checked against IAA's final template; this package does not claim that an unavailable source DOCX has been verified field by field.

POST `/internal/profiles/:versionId/transition` with action submit, return, approve, reject, publish or revoke and a reason. A different reviewer must approve a submitted profile. Publishing requires explicit fields:
```json
{"action":"publish","reason":"Public profile verified","fields":["project_id","code","name","area_id","model_id","typology_id","status","capacity_dc_mwp","point","summary","notes","designs","crop_plans"]}
```

Only whitelisted sections appear publicly. Only notes explicitly marked public are included. Grid connection identifiers/tariff details and encrypted contacts are not returned by public profile output. Public documents require a documents whitelist entry, document public_allowed=true and a clean file. `POST /internal/profiles/:versionId/revise` with reason clones a new editable revision; old approved baselines retain their identity for historic returns.

## 5. WP2 planning, shading and finance

POST `/wp2/assessments`:
```json
{"name":"Site A","areaId":"<area-id>","lat":28.61,"lon":77.21}
```
Keep the returned accessToken for seven days. Follow-ups require X-Planning-Token; never put the token in URLs or logs.

POST `/wp2/assessments/:id/scenarios`:
```json
{"name":"Initial layout","parameters":{"capacityDcMwp":2,"specificYieldKwhPerKwpYear":1500,"referenceHours":8760,"methodVersionIds":[],"datasetVersionIds":[],"functions":{}}}
```

A named scenario upsert increments its revision. Energy fields may be omitted together for a shading-only or other function-only scenario; supply non-empty functions inputs in that case. Energy arithmetic is capacityDcMwp × specificYieldKwhPerKwpYear, expressed as MWh/year. It does not infer weather or losses.

Install partner-approved methods by creating plan.methods and plan.method_versions through administrator resource APIs. GET `/wp2/engines` returns installed implementation names and exact codeDigest values. Configuration must contain a supported implementation; save that exact digest in code_digest, approve the method version via POST `/admin/definitions/methods/:id` with action approve/reason, and select its UUID in the scenario. Functions use the same function_code as plan.methods.

| Function | implementation | Configuration / function inputs |
| --- | --- | --- |
| Suitability | weighted-score-v1 | configuration.criteria [{field,weight,min,max,direction:higher/lower}]; function input supplies each numeric field; weights sum to one; missing values withhold score |
| Grid | hosting-check-v1 | function input requestedMw; scenario feederVersionId; pin feeder's approved/planning-permitted datasetVersionId. Approved hosting MW comes from DB, never user input |
| Model | model-rules-v1 | configuration.options [{code,rules:[{field,op,value}]}] |
| Scheme | eligibility-rules-v1 | same rule shape; potential match only, not guaranteed entitlement |
| Retrofit | retrofit-checks-v1 | configuration.checks [{code,rule:{field,op,value},requiresFieldVerification}] |
| Market | market-distance-v1 | pinned facility dataset versions; queries facilities within 50 km of assessment point |
| Shading | row-shadow-v1 | function input clearanceM,panelChordM,tiltDeg,rowPitchM,sunElevationDeg,sunAzimuthDeg,rowNormalAzimuthDeg |
| Finance | discounted-cashflow-v1 | function input capexInr,discountRate (fraction),annualNetCashflowsInr array |

Rule operators: eq, gte, lte, in. Configuration and inputs are data, never evaluated code. For shading, sun position is an explicit input; this is single-instant flat-ground geometry, not annual diffuse radiation or a weather-based soil-temperature simulation. Ground temperature stays unavailable without a validated thermal model.

POST `/wp2/assessments/:id/runs`:
```json
{"scenarioId":"<scenario-id>","idempotencyKey":"site-a-run-001"}
```

Runs retain input snapshot/hash, method and dataset pins, outputs and missing-data explanations. Reusing a key replays identical inputs only. GET runs and GET report return stored outputs; the UI can render report JSON for printing. Results remain indicative because scenario inputs may be user supplied. Missing approved methods/inputs produce cannot_assess. The API is not a DISCOM connection approval or a bankable engineering study.

## 6. WP3 forms, reporting, validation and corrections

Administrator setup sequence:
1. Create mon.indicators (code/name/domain/aggregation).
2. Create mon.indicator_versions (indicator_id/version/value_type/validation/frequency/unit_id where applicable). Approve via POST `/admin/definitions/indicators/:id`.
3. Create draft mon.form_versions, then mon.form_fields. Approve form via POST `/admin/definitions/forms/:id`. All indicator definitions must already be approved.
4. Create mon.periods, then project-scoped mon.obligations (project_id, period_id, form_version_id, assigned_to, reporting_stream, due_at). An obligation with a return and a referenced reporting period are pinned.

Supported indicator value_type: number, text, boolean, date, choice, json. Validation keys: min, max, maxLength, choices/enum, evidenceRequired, minRows, jsonType (array/object). Unsupported validation keys block submission instead of silently being ignored. A visibility_rule supports `{fieldCode,equals}`. Repeat groups require each required field for each observed repeatKey. Form fields use section_code and sort_order for UI rendering.

GET `/wp3/projects/:projectId/obligations`; GET `/wp3/obligations/:id/form`. Create return with POST `/wp3/submissions`:
```json
{"obligationId":"<obligation-id>","projectVersionId":"<approved-baseline-id>"}
```

PUT `/wp3/submissions/:revisionId/values`:
```json
{"indicatorVersionId":"<indicator-version-id>","repeatKey":"site","valueNumber":0}
```
Use exactly one of valueNumber, valueText, valueBoolean, valueDate, valueJson, or a missingReason. Required values cannot be marked missing. Non-repeating keys are site; repeated field groups share the same row key.

All authoritative fact resources are available through `/manage/resources/<resource>` with submission_version_id in the body and parentId in list queries: energy_records, harvest_records, participation_records, inclusion_totals, income_records, land_records, practice_records, scheme_linkages, progress_records and evidence (all under mon). Older convenience record endpoints support energy, land, income and inclusion only. Use the resource APIs for the complete set, including PATCH and draft DELETE.

Example energy segment:
```json
{"submission_version_id":"<revision-id>","segment_code":"A","start_at":"2026-01-01T00:00:00Z","end_at":"2026-01-02T00:00:00Z","generation_mwh":12,"capacity_dc_mwp":1,"reference_hours":24,"meter_reference":"Meter A"}
```

Capture harvest records with crop/season/plot/area/production and optional matched mon.baselines. Baselines are project-scoped and immutable once referenced. Person-level participation must use beneficiaries linked to the project. Choose person records or aggregate inclusion totals within a return to avoid double counting. Attach only reviewed clean files as evidence.

POST `/wp3/submissions/:revisionId/validate` returns issues, payload hash and descriptive metrics. Submission checks required/repeating/conditional answers, types/bounds/evidence, energy period/duration/overlap/balance, harvest dates/baselines, inclusion duplication and file review state. Database constraints enforce field ranges and foreign keys. Scientific indicator-specific rules beyond these checks must be represented by reviewed form/method configuration and partner acceptance.

POST `/wp3/submissions/:revisionId/transition` with action submit. It seals the full indicator/fact/evidence/comparator snapshot. A different scoped reviewer uses approve, return or reject; return/reject require a reason. Approval rechecks the sealed payload. Submitted facts are immutable at both API and database-trigger levels.

POST `/wp3/submissions/:revisionId/correct` with reason creates a new draft revision and clones facts. Approving a correction supersedes the old approved revision and revokes its releases in the same transaction. GET history preserves all revisions/review events.

POST `/wp3/submissions/:revisionId/release` with `{"action":"release","reason":"Authorised reporting approved"}` exposes approved metrics to that project's authorised readers. Action revoke withdraws release. GET `/wp3/projects/:id/dashboard` only includes approved, released, non-demo returns. It preserves period and reporting-stream grain rather than summing overlapping periods. Public beneficiary-level or small-cell aggregates are not exposed.

Metrics include generation, DC capacity factor from capacity-hours, crop yield, descriptive relative crop yield where a matched comparator exists, land shares and restricted income/inclusion facts. Dual-productivity/LER remains withheld without a valid conventional energy comparator and approved method.

## 7. Operations and learning

GET `/admin/audit` is global-administrator only. GET/POST `/queries` is authenticated; users see their own questions, administrators see all. POST `/queries/:id/answer` adds an administrator response and optionally closes the query. Published learning is separately curated as a reviewed resource.

POST `/admin/reminders` idempotently creates due-date in-app notifications for assigned users. Schedule this endpoint using your controlled server/CI scheduler and an administrator access token. GET `/notifications` and POST `/notifications/:id/read` are scoped to the current user. No messages are sent externally by these APIs.
