# IAA Backend API Reference

Generated from the checked-in OpenAPI specification (0.2.0). Base URL: `http://localhost:3000/api/v1`.

This document catalogs every documented operation, its authentication, parameters, request shape, and documented response status codes. For workflow behavior and concrete workflow payload examples, see [WORKFLOWS.md](./WORKFLOWS.md). For setup and response conventions, see [API.md](./API.md).

## Important limits of the current specification

- The OpenAPI specification defines exact request fields for the generated resource APIs. Workflow JSON bodies are generally marked as service-validated objects, so use the linked workflow guide for payload examples.
- Response bodies are not individually described in the current OpenAPI specification. The status codes below are what it documents; response envelopes and route behavior can vary. Common JSON errors use `{error:{code,message,requestId}}`; successful JSON responses usually use `{data: ...}` and paged results may include `meta`.
- Auth labels: `Public` needs no token, `JWT access token` uses the JWT authentication scheme in the `Authorization` header, and `Planning token` uses `X-Planning-Token`.

## Endpoint index

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/manage/resources/core.organisations` | JWT access token |
| POST | `/manage/resources/core.organisations` | JWT access token |
| PATCH | `/manage/resources/core.organisations/{id}` | JWT access token |
| GET | `/manage/resources/core.units` | JWT access token |
| POST | `/manage/resources/core.units` | JWT access token |
| PATCH | `/manage/resources/core.units/{id}` | JWT access token |
| GET | `/manage/resources/core.seasons` | JWT access token |
| POST | `/manage/resources/core.seasons` | JWT access token |
| PATCH | `/manage/resources/core.seasons/{id}` | JWT access token |
| GET | `/manage/resources/core.crops` | JWT access token |
| POST | `/manage/resources/core.crops` | JWT access token |
| PATCH | `/manage/resources/core.crops/{id}` | JWT access token |
| GET | `/manage/resources/core.models` | JWT access token |
| POST | `/manage/resources/core.models` | JWT access token |
| PATCH | `/manage/resources/core.models/{id}` | JWT access token |
| GET | `/manage/resources/core.practices` | JWT access token |
| POST | `/manage/resources/core.practices` | JWT access token |
| PATCH | `/manage/resources/core.practices/{id}` | JWT access token |
| GET | `/manage/resources/core.locales` | JWT access token |
| POST | `/manage/resources/core.locales` | JWT access token |
| PATCH | `/manage/resources/core.locales/{id}` | JWT access token |
| GET | `/manage/resources/core.translations` | JWT access token |
| POST | `/manage/resources/core.translations` | JWT access token |
| PATCH | `/manage/resources/core.translations/{id}` | JWT access token |
| GET | `/manage/resources/geo.areas` | JWT access token |
| POST | `/manage/resources/geo.areas` | JWT access token |
| PATCH | `/manage/resources/geo.areas/{id}` | JWT access token |
| GET | `/manage/resources/data.sources` | JWT access token |
| POST | `/manage/resources/data.sources` | JWT access token |
| PATCH | `/manage/resources/data.sources/{id}` | JWT access token |
| GET | `/manage/resources/data.datasets` | JWT access token |
| POST | `/manage/resources/data.datasets` | JWT access token |
| PATCH | `/manage/resources/data.datasets/{id}` | JWT access token |
| GET | `/manage/resources/data.dataset_versions` | JWT access token |
| POST | `/manage/resources/data.dataset_versions` | JWT access token |
| PATCH | `/manage/resources/data.dataset_versions/{id}` | JWT access token |
| GET | `/manage/resources/data.coverage` | JWT access token |
| POST | `/manage/resources/data.coverage` | JWT access token |
| PATCH | `/manage/resources/data.coverage/{id}` | JWT access token |
| GET | `/manage/resources/data.collection_tasks` | JWT access token |
| POST | `/manage/resources/data.collection_tasks` | JWT access token |
| PATCH | `/manage/resources/data.collection_tasks/{id}` | JWT access token |
| GET | `/manage/resources/geo.boundaries` | JWT access token |
| POST | `/manage/resources/geo.boundaries` | JWT access token |
| PATCH | `/manage/resources/geo.boundaries/{id}` | JWT access token |
| GET | `/manage/resources/geo.layers` | JWT access token |
| POST | `/manage/resources/geo.layers` | JWT access token |
| PATCH | `/manage/resources/geo.layers/{id}` | JWT access token |
| GET | `/manage/resources/geo.features` | JWT access token |
| POST | `/manage/resources/geo.features` | JWT access token |
| PATCH | `/manage/resources/geo.features/{id}` | JWT access token |
| GET | `/manage/resources/wp1.land_statistics` | JWT access token |
| POST | `/manage/resources/wp1.land_statistics` | JWT access token |
| PATCH | `/manage/resources/wp1.land_statistics/{id}` | JWT access token |
| GET | `/manage/resources/wp1.crop_production` | JWT access token |
| POST | `/manage/resources/wp1.crop_production` | JWT access token |
| PATCH | `/manage/resources/wp1.crop_production/{id}` | JWT access token |
| GET | `/manage/resources/wp1.facilities` | JWT access token |
| POST | `/manage/resources/wp1.facilities` | JWT access token |
| PATCH | `/manage/resources/wp1.facilities/{id}` | JWT access token |
| GET | `/manage/resources/wp1.facility_versions` | JWT access token |
| POST | `/manage/resources/wp1.facility_versions` | JWT access token |
| PATCH | `/manage/resources/wp1.facility_versions/{id}` | JWT access token |
| GET | `/manage/resources/wp1.substations` | JWT access token |
| POST | `/manage/resources/wp1.substations` | JWT access token |
| PATCH | `/manage/resources/wp1.substations/{id}` | JWT access token |
| GET | `/manage/resources/wp1.substation_versions` | JWT access token |
| POST | `/manage/resources/wp1.substation_versions` | JWT access token |
| PATCH | `/manage/resources/wp1.substation_versions/{id}` | JWT access token |
| GET | `/manage/resources/wp1.feeders` | JWT access token |
| POST | `/manage/resources/wp1.feeders` | JWT access token |
| PATCH | `/manage/resources/wp1.feeders/{id}` | JWT access token |
| GET | `/manage/resources/wp1.feeder_versions` | JWT access token |
| POST | `/manage/resources/wp1.feeder_versions` | JWT access token |
| PATCH | `/manage/resources/wp1.feeder_versions/{id}` | JWT access token |
| GET | `/manage/resources/wp1.feeder_load_readings` | JWT access token |
| POST | `/manage/resources/wp1.feeder_load_readings` | JWT access token |
| PATCH | `/manage/resources/wp1.feeder_load_readings/{id}` | JWT access token |
| GET | `/manage/resources/wp1.solar_installations` | JWT access token |
| POST | `/manage/resources/wp1.solar_installations` | JWT access token |
| PATCH | `/manage/resources/wp1.solar_installations/{id}` | JWT access token |
| GET | `/manage/resources/wp1.solar_installation_versions` | JWT access token |
| POST | `/manage/resources/wp1.solar_installation_versions` | JWT access token |
| PATCH | `/manage/resources/wp1.solar_installation_versions/{id}` | JWT access token |
| GET | `/manage/resources/wp1.environment_observations` | JWT access token |
| POST | `/manage/resources/wp1.environment_observations` | JWT access token |
| PATCH | `/manage/resources/wp1.environment_observations/{id}` | JWT access token |
| GET | `/manage/resources/wp1.agro_zones` | JWT access token |
| POST | `/manage/resources/wp1.agro_zones` | JWT access token |
| PATCH | `/manage/resources/wp1.agro_zones/{id}` | JWT access token |
| GET | `/manage/resources/wp1.crop_suitability` | JWT access token |
| POST | `/manage/resources/wp1.crop_suitability` | JWT access token |
| PATCH | `/manage/resources/wp1.crop_suitability/{id}` | JWT access token |
| GET | `/manage/resources/wp1.irrigation_statistics` | JWT access token |
| POST | `/manage/resources/wp1.irrigation_statistics` | JWT access token |
| PATCH | `/manage/resources/wp1.irrigation_statistics/{id}` | JWT access token |
| GET | `/manage/resources/wp1.land_parcels` | JWT access token |
| POST | `/manage/resources/wp1.land_parcels` | JWT access token |
| PATCH | `/manage/resources/wp1.land_parcels/{id}` | JWT access token |
| GET | `/manage/resources/content.resources` | JWT access token |
| POST | `/manage/resources/content.resources` | JWT access token |
| PATCH | `/manage/resources/content.resources/{id}` | JWT access token |
| GET | `/manage/resources/content.resource_versions` | JWT access token |
| POST | `/manage/resources/content.resource_versions` | JWT access token |
| PATCH | `/manage/resources/content.resource_versions/{id}` | JWT access token |
| GET | `/manage/resources/content.resource_areas` | JWT access token |
| POST | `/manage/resources/content.resource_areas` | JWT access token |
| PATCH | `/manage/resources/content.resource_areas/{id}` | JWT access token |
| GET | `/manage/resources/content.policies` | JWT access token |
| POST | `/manage/resources/content.policies` | JWT access token |
| PATCH | `/manage/resources/content.policies/{id}` | JWT access token |
| GET | `/manage/resources/content.policy_versions` | JWT access token |
| POST | `/manage/resources/content.policy_versions` | JWT access token |
| PATCH | `/manage/resources/content.policy_versions/{id}` | JWT access token |
| GET | `/manage/resources/content.policy_areas` | JWT access token |
| POST | `/manage/resources/content.policy_areas` | JWT access token |
| PATCH | `/manage/resources/content.policy_areas/{id}` | JWT access token |
| GET | `/manage/resources/project.partners` | JWT access token |
| POST | `/manage/resources/project.partners` | JWT access token |
| PATCH | `/manage/resources/project.partners/{id}` | JWT access token |
| DELETE | `/manage/resources/project.partners/{id}` | JWT access token |
| GET | `/manage/resources/project.land_uses` | JWT access token |
| POST | `/manage/resources/project.land_uses` | JWT access token |
| PATCH | `/manage/resources/project.land_uses/{id}` | JWT access token |
| DELETE | `/manage/resources/project.land_uses/{id}` | JWT access token |
| GET | `/manage/resources/project.designs` | JWT access token |
| POST | `/manage/resources/project.designs` | JWT access token |
| PATCH | `/manage/resources/project.designs/{id}` | JWT access token |
| DELETE | `/manage/resources/project.designs/{id}` | JWT access token |
| GET | `/manage/resources/project.grid_connections` | JWT access token |
| POST | `/manage/resources/project.grid_connections` | JWT access token |
| PATCH | `/manage/resources/project.grid_connections/{id}` | JWT access token |
| DELETE | `/manage/resources/project.grid_connections/{id}` | JWT access token |
| GET | `/manage/resources/project.crop_plans` | JWT access token |
| POST | `/manage/resources/project.crop_plans` | JWT access token |
| PATCH | `/manage/resources/project.crop_plans/{id}` | JWT access token |
| DELETE | `/manage/resources/project.crop_plans/{id}` | JWT access token |
| GET | `/manage/resources/project.profile_notes` | JWT access token |
| POST | `/manage/resources/project.profile_notes` | JWT access token |
| PATCH | `/manage/resources/project.profile_notes/{id}` | JWT access token |
| DELETE | `/manage/resources/project.profile_notes/{id}` | JWT access token |
| GET | `/manage/resources/project.documents` | JWT access token |
| POST | `/manage/resources/project.documents` | JWT access token |
| PATCH | `/manage/resources/project.documents/{id}` | JWT access token |
| DELETE | `/manage/resources/project.documents/{id}` | JWT access token |
| GET | `/manage/resources/plan.methods` | JWT access token |
| POST | `/manage/resources/plan.methods` | JWT access token |
| PATCH | `/manage/resources/plan.methods/{id}` | JWT access token |
| GET | `/manage/resources/plan.method_versions` | JWT access token |
| POST | `/manage/resources/plan.method_versions` | JWT access token |
| PATCH | `/manage/resources/plan.method_versions/{id}` | JWT access token |
| GET | `/manage/resources/plan.criteria` | JWT access token |
| POST | `/manage/resources/plan.criteria` | JWT access token |
| PATCH | `/manage/resources/plan.criteria/{id}` | JWT access token |
| GET | `/manage/resources/mon.periods` | JWT access token |
| POST | `/manage/resources/mon.periods` | JWT access token |
| PATCH | `/manage/resources/mon.periods/{id}` | JWT access token |
| GET | `/manage/resources/mon.indicators` | JWT access token |
| POST | `/manage/resources/mon.indicators` | JWT access token |
| PATCH | `/manage/resources/mon.indicators/{id}` | JWT access token |
| GET | `/manage/resources/mon.indicator_versions` | JWT access token |
| POST | `/manage/resources/mon.indicator_versions` | JWT access token |
| PATCH | `/manage/resources/mon.indicator_versions/{id}` | JWT access token |
| GET | `/manage/resources/mon.form_versions` | JWT access token |
| POST | `/manage/resources/mon.form_versions` | JWT access token |
| PATCH | `/manage/resources/mon.form_versions/{id}` | JWT access token |
| GET | `/manage/resources/mon.form_fields` | JWT access token |
| POST | `/manage/resources/mon.form_fields` | JWT access token |
| PATCH | `/manage/resources/mon.form_fields/{id}` | JWT access token |
| GET | `/manage/resources/mon.obligations` | JWT access token |
| POST | `/manage/resources/mon.obligations` | JWT access token |
| PATCH | `/manage/resources/mon.obligations/{id}` | JWT access token |
| DELETE | `/manage/resources/mon.obligations/{id}` | JWT access token |
| GET | `/manage/resources/mon.energy_records` | JWT access token |
| POST | `/manage/resources/mon.energy_records` | JWT access token |
| PATCH | `/manage/resources/mon.energy_records/{id}` | JWT access token |
| DELETE | `/manage/resources/mon.energy_records/{id}` | JWT access token |
| GET | `/manage/resources/mon.baselines` | JWT access token |
| POST | `/manage/resources/mon.baselines` | JWT access token |
| PATCH | `/manage/resources/mon.baselines/{id}` | JWT access token |
| DELETE | `/manage/resources/mon.baselines/{id}` | JWT access token |
| GET | `/manage/resources/mon.harvest_records` | JWT access token |
| POST | `/manage/resources/mon.harvest_records` | JWT access token |
| PATCH | `/manage/resources/mon.harvest_records/{id}` | JWT access token |
| DELETE | `/manage/resources/mon.harvest_records/{id}` | JWT access token |
| GET | `/manage/resources/mon.beneficiaries` | JWT access token |
| POST | `/manage/resources/mon.beneficiaries` | JWT access token |
| PATCH | `/manage/resources/mon.beneficiaries/{id}` | JWT access token |
| GET | `/manage/resources/mon.project_beneficiaries` | JWT access token |
| POST | `/manage/resources/mon.project_beneficiaries` | JWT access token |
| PATCH | `/manage/resources/mon.project_beneficiaries/{id}` | JWT access token |
| DELETE | `/manage/resources/mon.project_beneficiaries/{id}` | JWT access token |
| GET | `/manage/resources/mon.participation_records` | JWT access token |
| POST | `/manage/resources/mon.participation_records` | JWT access token |
| PATCH | `/manage/resources/mon.participation_records/{id}` | JWT access token |
| DELETE | `/manage/resources/mon.participation_records/{id}` | JWT access token |
| GET | `/manage/resources/mon.inclusion_totals` | JWT access token |
| POST | `/manage/resources/mon.inclusion_totals` | JWT access token |
| PATCH | `/manage/resources/mon.inclusion_totals/{id}` | JWT access token |
| DELETE | `/manage/resources/mon.inclusion_totals/{id}` | JWT access token |
| GET | `/manage/resources/mon.income_records` | JWT access token |
| POST | `/manage/resources/mon.income_records` | JWT access token |
| PATCH | `/manage/resources/mon.income_records/{id}` | JWT access token |
| DELETE | `/manage/resources/mon.income_records/{id}` | JWT access token |
| GET | `/manage/resources/mon.land_records` | JWT access token |
| POST | `/manage/resources/mon.land_records` | JWT access token |
| PATCH | `/manage/resources/mon.land_records/{id}` | JWT access token |
| DELETE | `/manage/resources/mon.land_records/{id}` | JWT access token |
| GET | `/manage/resources/mon.practice_records` | JWT access token |
| POST | `/manage/resources/mon.practice_records` | JWT access token |
| PATCH | `/manage/resources/mon.practice_records/{id}` | JWT access token |
| DELETE | `/manage/resources/mon.practice_records/{id}` | JWT access token |
| GET | `/manage/resources/mon.scheme_linkages` | JWT access token |
| POST | `/manage/resources/mon.scheme_linkages` | JWT access token |
| PATCH | `/manage/resources/mon.scheme_linkages/{id}` | JWT access token |
| DELETE | `/manage/resources/mon.scheme_linkages/{id}` | JWT access token |
| GET | `/manage/resources/mon.progress_records` | JWT access token |
| POST | `/manage/resources/mon.progress_records` | JWT access token |
| PATCH | `/manage/resources/mon.progress_records/{id}` | JWT access token |
| DELETE | `/manage/resources/mon.progress_records/{id}` | JWT access token |
| GET | `/manage/resources/mon.evidence` | JWT access token |
| POST | `/manage/resources/mon.evidence` | JWT access token |
| PATCH | `/manage/resources/mon.evidence/{id}` | JWT access token |
| DELETE | `/manage/resources/mon.evidence/{id}` | JWT access token |
| GET | `/health` | Public |
| GET | `/ready` | Public |
| GET | `/wp1/home` | Public |
| GET | `/wp1/areas` | Public |
| GET | `/wp1/areas/{id}/boundary` | Public |
| GET | `/wp1/search` | Public |
| GET | `/wp1/features` | Public |
| GET | `/wp1/nearby` | Public |
| GET | `/wp1/layers` | Public |
| GET | `/wp1/layers/{id}/features` | Public |
| GET | `/wp1/demo-project` | Public |
| GET | `/wp1/projects` | Public |
| GET | `/wp1/projects/{id}` | Public |
| GET | `/wp1/districts/{id}` | Public |
| GET | `/wp1/districts/{id}/{domain}` | Public |
| POST | `/wp1/compare` | Public |
| GET | `/wp1/datasets` | Public |
| GET | `/wp1/datasets/{id}` | Public |
| GET | `/wp1/resources` | Public |
| GET | `/wp1/policies` | Public |
| GET | `/wp1/files/{id}` | Public |
| GET | `/wp1/exports/{id}/{resource}` | Public |
| GET | `/reference/{kind}` | Public |
| POST | `/wp2/estimate-energy` | Public |
| GET | `/wp2/engines` | Public |
| POST | `/wp2/assessments` | Public |
| GET | `/wp2/assessments/{id}` | Planning token |
| POST | `/wp2/assessments/{id}/scenarios` | Planning token |
| POST | `/wp2/assessments/{id}/runs` | Planning token |
| GET | `/wp2/assessments/{id}/runs` | Planning token |
| GET | `/wp2/assessments/{id}/report` | Planning token |
| GET | `/auth/me` | JWT access token |
| GET | `/internal/projects` | JWT access token |
| POST | `/internal/projects` | JWT access token |
| GET | `/internal/projects/{id}` | JWT access token |
| GET | `/internal/profiles/{id}` | JWT access token |
| PATCH | `/internal/profiles/{id}` | JWT access token |
| POST | `/internal/profiles/{id}/notes` | JWT access token |
| POST | `/internal/profiles/{id}/transition` | JWT access token |
| POST | `/internal/profiles/{id}/revise` | JWT access token |
| POST | `/files` | JWT access token |
| GET | `/files/{id}` | JWT access token |
| POST | `/files/{id}/review` | JWT access token |
| GET | `/admin/users` | JWT access token |
| POST | `/admin/users` | JWT access token |
| POST | `/admin/users/{id}/deactivate` | JWT access token |
| POST | `/admin/projects/{id}/memberships` | JWT access token |
| GET | `/admin/audit` | JWT access token |
| POST | `/admin/reminders` | JWT access token |
| POST | `/admin/datasets/{id}/transition` | JWT access token |
| POST | `/admin/definitions/{kind}/{id}` | JWT access token |
| POST | `/admin/imports` | JWT access token |
| GET | `/admin/imports/{id}/rows` | JWT access token |
| POST | `/admin/issues/{id}/resolve` | JWT access token |
| GET | `/manage/resources` | JWT access token |
| GET | `/wp3/projects/{id}/obligations` | JWT access token |
| GET | `/wp3/projects/{id}/dashboard` | JWT access token |
| GET | `/wp3/obligations/{id}/form` | JWT access token |
| POST | `/wp3/submissions` | JWT access token |
| GET | `/wp3/submissions/{id}` | JWT access token |
| PUT | `/wp3/submissions/{id}/values` | JWT access token |
| POST | `/wp3/submissions/{id}/validate` | JWT access token |
| POST | `/wp3/submissions/{id}/transition` | JWT access token |
| POST | `/wp3/submissions/{id}/correct` | JWT access token |
| POST | `/wp3/submissions/{id}/release` | JWT access token |
| GET | `/wp3/submissions/{id}/history` | JWT access token |
| GET | `/wp3/submissions/{id}/records/{kind}` | JWT access token |
| POST | `/wp3/submissions/{id}/records/{kind}` | JWT access token |
| DELETE | `/wp3/submissions/{id}/records/{kind}/{recordId}` | JWT access token |
| GET | `/queries` | JWT access token |
| POST | `/queries` | JWT access token |
| POST | `/queries/{id}/answer` | JWT access token |
| GET | `/notifications` | JWT access token |
| POST | `/notifications/{id}/read` | JWT access token |

## Operation details

### Resources: admin

#### GET /manage/resources/core.organisations

List core.organisations

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/core.organisations

Create core.organisations

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `core.organisations`; required
  - Fields: `code` (required, string); `name` (required, string); `organisation_type` (required, string); `parent_id` (optional, string (uuid) or null); `is_active` (optional, boolean)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/core.organisations/{id}

Update mutable core.organisations fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `code` (optional, string); `name` (optional, string); `organisation_type` (optional, string); `parent_id` (optional, string (uuid) or null); `is_active` (optional, boolean)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/core.units

List core.units

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/core.units

Create core.units

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `core.units`; required
  - Fields: `code` (required, string); `name` (required, string); `dimension` (required, string); `canonical_factor` (optional, number or null); `context` (optional, object)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/core.units/{id}

Update mutable core.units fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `code` (optional, string); `name` (optional, string); `dimension` (optional, string); `canonical_factor` (optional, number or null); `context` (optional, object)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/core.seasons

List core.seasons

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/core.seasons

Create core.seasons

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `core.seasons`; required
  - Fields: `code` (required, string); `name` (required, string); `is_total` (optional, boolean)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/core.seasons/{id}

Update mutable core.seasons fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `code` (optional, string); `name` (optional, string); `is_total` (optional, boolean)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/core.crops

List core.crops

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/core.crops

Create core.crops

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `core.crops`; required
  - Fields: `code` (required, string); `name` (required, string); `category` (optional, string or null); `is_aggregate` (optional, boolean); `parent_id` (optional, string (uuid) or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/core.crops/{id}

Update mutable core.crops fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `code` (optional, string); `name` (optional, string); `category` (optional, string or null); `is_aggregate` (optional, boolean); `parent_id` (optional, string (uuid) or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/core.models

List core.models

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/core.models

Create core.models

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `core.models`; required
  - Fields: `code` (required, string); `name` (required, string); `kind` (required, string; allowed: agrivoltaics, system_typology, land_ownership, project_ownership); `description` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/core.models/{id}

Update mutable core.models fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `code` (optional, string); `name` (optional, string); `kind` (optional, string; allowed: agrivoltaics, system_typology, land_ownership, project_ownership); `description` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/core.practices

List core.practices

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/core.practices

Create core.practices

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `core.practices`; required
  - Fields: `code` (required, string); `name` (required, string); `category` (required, string)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/core.practices/{id}

Update mutable core.practices fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `code` (optional, string); `name` (optional, string); `category` (optional, string)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/core.locales

List core.locales

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/core.locales

Create core.locales

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `core.locales`; required
  - Fields: `code` (required, string); `name` (required, string); `is_enabled` (optional, boolean)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/core.locales/{id}

Update mutable core.locales fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `code` (optional, string); `name` (optional, string); `is_enabled` (optional, boolean)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/core.translations

List core.translations

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/core.translations

Create core.translations

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `core.translations`; required
  - Fields: `locale_id` (required, string (uuid)); `translation_key` (required, string); `translated_text` (required, string)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/core.translations/{id}

Update mutable core.translations fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `locale_id` (optional, string (uuid)); `translation_key` (optional, string); `translated_text` (optional, string)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/geo.areas

List geo.areas

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/geo.areas

Create geo.areas

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `geo.areas`; required
  - Fields: `code_system` (required, string); `code` (required, string); `name` (required, string); `level` (required, string; allowed: country, state, district, subdistrict, village, city); `parent_id` (optional, string (uuid) or null); `valid_from` (optional, string (date) or null); `valid_to` (optional, string (date) or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/geo.areas/{id}

Update mutable geo.areas fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `code_system` (optional, string); `code` (optional, string); `name` (optional, string); `level` (optional, string; allowed: country, state, district, subdistrict, village, city); `parent_id` (optional, string (uuid) or null); `valid_from` (optional, string (date) or null); `valid_to` (optional, string (date) or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/data.sources

List data.sources

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/data.sources

Create data.sources

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `data.sources`; required
  - Fields: `organisation_id` (optional, string (uuid) or null); `name` (required, string); `source_uri` (optional, string or null); `licence` (optional, string or null); `rights_notes` (optional, string or null); `contact_reference` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/data.sources/{id}

Update mutable data.sources fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `organisation_id` (optional, string (uuid) or null); `name` (optional, string); `source_uri` (optional, string or null); `licence` (optional, string or null); `rights_notes` (optional, string or null); `contact_reference` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/data.datasets

List data.datasets

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/data.datasets

Create data.datasets

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `data.datasets`; required
  - Fields: `source_id` (required, string (uuid)); `code` (required, string); `title` (required, string); `domain_no` (required, integer); `update_frequency` (optional, string or null); `spatial_resolution` (optional, string or null); `is_active` (optional, boolean)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/data.datasets/{id}

Update mutable data.datasets fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `source_id` (optional, string (uuid)); `code` (optional, string); `title` (optional, string); `domain_no` (optional, integer); `update_frequency` (optional, string or null); `spatial_resolution` (optional, string or null); `is_active` (optional, boolean)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/data.dataset_versions

List data.dataset_versions

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/data.dataset_versions

Create data.dataset_versions

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `data.dataset_versions`; required
  - Fields: `dataset_id` (required, string (uuid)); `file_id` (optional, string (uuid) or null); `version_label` (required, string); `received_at` (optional, string (date-time)); `reference_start` (optional, string (date) or null); `reference_end` (optional, string (date) or null); `source_crs` (optional, string or null); `source_units` (optional, string or null); `coverage_notes` (optional, string or null); `limitations` (optional, string or null); `is_demo` (optional, boolean); `supersedes_id` (optional, string (uuid) or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/data.dataset_versions/{id}

Update mutable data.dataset_versions fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `dataset_id` (optional, string (uuid)); `file_id` (optional, string (uuid) or null); `version_label` (optional, string); `received_at` (optional, string (date-time)); `reference_start` (optional, string (date) or null); `reference_end` (optional, string (date) or null); `source_crs` (optional, string or null); `source_units` (optional, string or null); `coverage_notes` (optional, string or null); `limitations` (optional, string or null); `is_demo` (optional, boolean); `supersedes_id` (optional, string (uuid) or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/data.coverage

List data.coverage

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/data.coverage

Create data.coverage

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `data.coverage`; required
  - Fields: `dataset_id` (required, string (uuid)); `area_id` (required, string (uuid)); `version_id` (optional, string (uuid) or null); `coverage_status` (required, string; allowed: missing, partial, available, stale, blocked); `required_resolution` (optional, string or null); `notes` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/data.coverage/{id}

Update mutable data.coverage fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `dataset_id` (optional, string (uuid)); `area_id` (optional, string (uuid)); `version_id` (optional, string (uuid) or null); `coverage_status` (optional, string; allowed: missing, partial, available, stale, blocked); `required_resolution` (optional, string or null); `notes` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/data.collection_tasks

List data.collection_tasks

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/data.collection_tasks

Create data.collection_tasks

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `data.collection_tasks`; required
  - Fields: `area_id` (required, string (uuid)); `provider_id` (optional, string (uuid) or null); `owner_id` (optional, string (uuid) or null); `dataset_id` (optional, string (uuid) or null); `requested_data` (required, string); `status` (optional, string; allowed: not_started, requested, in_progress, received, validated, blocked); `due_date` (optional, string (date) or null); `notes` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/data.collection_tasks/{id}

Update mutable data.collection_tasks fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `area_id` (optional, string (uuid)); `provider_id` (optional, string (uuid) or null); `owner_id` (optional, string (uuid) or null); `dataset_id` (optional, string (uuid) or null); `requested_data` (optional, string); `status` (optional, string; allowed: not_started, requested, in_progress, received, validated, blocked); `due_date` (optional, string (date) or null); `notes` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/geo.boundaries

List geo.boundaries

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/geo.boundaries

Create geo.boundaries

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `geo.boundaries`; required
  - Fields: `area_id` (required, string (uuid)); `dataset_version_id` (required, string (uuid)); `valid_from` (optional, string (date) or null); `valid_to` (optional, string (date) or null); `geom` (required, object)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/geo.boundaries/{id}

Update mutable geo.boundaries fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `area_id` (optional, string (uuid)); `dataset_version_id` (optional, string (uuid)); `valid_from` (optional, string (date) or null); `valid_to` (optional, string (date) or null); `geom` (optional, object)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/geo.layers

List geo.layers

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/geo.layers

Create geo.layers

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `geo.layers`; required
  - Fields: `dataset_version_id` (required, string (uuid)); `file_id` (optional, string (uuid) or null); `code` (required, string); `name` (required, string); `layer_type` (required, string; allowed: vector, raster, table); `geometry_type` (optional, string or null); `style` (optional, object); `legend` (optional, object); `tile_service_reference` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/geo.layers/{id}

Update mutable geo.layers fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `dataset_version_id` (optional, string (uuid)); `file_id` (optional, string (uuid) or null); `code` (optional, string); `name` (optional, string); `layer_type` (optional, string; allowed: vector, raster, table); `geometry_type` (optional, string or null); `style` (optional, object); `legend` (optional, object); `tile_service_reference` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/geo.features

List geo.features

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/geo.features

Create geo.features

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `geo.features`; required
  - Fields: `layer_id` (required, string (uuid)); `source_record_id` (optional, string (uuid) or null); `source_feature_key` (required, string); `geom` (required, object); `attributes` (optional, object)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/geo.features/{id}

Update mutable geo.features fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `layer_id` (optional, string (uuid)); `source_record_id` (optional, string (uuid) or null); `source_feature_key` (optional, string); `geom` (optional, object); `attributes` (optional, object)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/wp1.land_statistics

List wp1.land_statistics

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/wp1.land_statistics

Create wp1.land_statistics

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `wp1.land_statistics`; required
  - Fields: `dataset_version_id` (required, string (uuid)); `source_record_id` (optional, string (uuid) or null); `area_id` (required, string (uuid)); `unit_id` (optional, string (uuid) or null); `source_state` (required, string); `source_district` (optional, string or null); `agricultural_year` (required, string); `row_kind` (required, string; allowed: district, state_total); `reporting_area` (optional, number or null); `forest_area` (optional, number or null); `non_agricultural_area` (optional, number or null); `barren_area` (optional, number or null); `non_cultivable_total` (optional, number or null); `pasture_area` (optional, number or null); `tree_crop_area` (optional, number or null); `culturable_waste_area` (optional, number or null); `other_uncultivated_total` (optional, number or null); `other_fallow_area` (optional, number or null); `current_fallow_area` (optional, number or null); `fallow_total` (optional, number or null); `net_sown_area` (optional, number or null); `gross_cropped_area` (optional, number or null); `multi_sown_area` (optional, number or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/wp1.land_statistics/{id}

Update mutable wp1.land_statistics fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `dataset_version_id` (optional, string (uuid)); `source_record_id` (optional, string (uuid) or null); `area_id` (optional, string (uuid)); `unit_id` (optional, string (uuid) or null); `source_state` (optional, string); `source_district` (optional, string or null); `agricultural_year` (optional, string); `row_kind` (optional, string; allowed: district, state_total); `reporting_area` (optional, number or null); `forest_area` (optional, number or null); `non_agricultural_area` (optional, number or null); `barren_area` (optional, number or null); `non_cultivable_total` (optional, number or null); `pasture_area` (optional, number or null); `tree_crop_area` (optional, number or null); `culturable_waste_area` (optional, number or null); `other_uncultivated_total` (optional, number or null); `other_fallow_area` (optional, number or null); `current_fallow_area` (optional, number or null); `fallow_total` (optional, number or null); `net_sown_area` (optional, number or null); `gross_cropped_area` (optional, number or null); `multi_sown_area` (optional, number or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/wp1.crop_production

List wp1.crop_production

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/wp1.crop_production

Create wp1.crop_production

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `wp1.crop_production`; required
  - Fields: `dataset_version_id` (required, string (uuid)); `source_record_id` (optional, string (uuid) or null); `area_id` (required, string (uuid)); `crop_id` (required, string (uuid)); `season_id` (required, string (uuid)); `unit_id` (required, string (uuid)); `agricultural_year` (required, string); `production` (optional, number or null); `source_value` (required, string); `value_status` (required, string; allowed: numeric, included_in_rabi, included_in_kharif, not_reported, non_numeric); `source_page` (optional, integer or null); `source_crop_number` (optional, integer or null); `unit_context` (optional, object); `notes` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/wp1.crop_production/{id}

Update mutable wp1.crop_production fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `dataset_version_id` (optional, string (uuid)); `source_record_id` (optional, string (uuid) or null); `area_id` (optional, string (uuid)); `crop_id` (optional, string (uuid)); `season_id` (optional, string (uuid)); `unit_id` (optional, string (uuid)); `agricultural_year` (optional, string); `production` (optional, number or null); `source_value` (optional, string); `value_status` (optional, string; allowed: numeric, included_in_rabi, included_in_kharif, not_reported, non_numeric); `source_page` (optional, integer or null); `source_crop_number` (optional, integer or null); `unit_context` (optional, object); `notes` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/wp1.facilities

List wp1.facilities

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/wp1.facilities

Create wp1.facilities

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `wp1.facilities`; required
  - Fields: `code` (required, string); `facility_type` (required, string); `name` (required, string); `operator_id` (optional, string (uuid) or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/wp1.facilities/{id}

Update mutable wp1.facilities fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `code` (optional, string); `facility_type` (optional, string); `name` (optional, string); `operator_id` (optional, string (uuid) or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/wp1.facility_versions

List wp1.facility_versions

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/wp1.facility_versions

Create wp1.facility_versions

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `wp1.facility_versions`; required
  - Fields: `dataset_version_id` (required, string (uuid)); `source_record_id` (optional, string (uuid) or null); `facility_id` (required, string (uuid)); `area_id` (optional, string (uuid) or null); `geocode_review_id` (optional, string (uuid) or null); `capacity_unit_id` (optional, string (uuid) or null); `source_state` (optional, string or null); `source_district` (optional, string or null); `city` (optional, string or null); `address` (optional, string or null); `point` (optional, object or null); `location_accuracy` (optional, string); `established_year` (optional, integer or null); `source_area_text` (optional, string or null); `area_ha` (optional, number or null); `capacity_value` (optional, number or null); `operational_status` (optional, string or null); `as_of_date` (optional, string (date) or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/wp1.facility_versions/{id}

Update mutable wp1.facility_versions fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `dataset_version_id` (optional, string (uuid)); `source_record_id` (optional, string (uuid) or null); `facility_id` (optional, string (uuid)); `area_id` (optional, string (uuid) or null); `geocode_review_id` (optional, string (uuid) or null); `capacity_unit_id` (optional, string (uuid) or null); `source_state` (optional, string or null); `source_district` (optional, string or null); `city` (optional, string or null); `address` (optional, string or null); `point` (optional, object or null); `location_accuracy` (optional, string); `established_year` (optional, integer or null); `source_area_text` (optional, string or null); `area_ha` (optional, number or null); `capacity_value` (optional, number or null); `operational_status` (optional, string or null); `as_of_date` (optional, string (date) or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/wp1.substations

List wp1.substations

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/wp1.substations

Create wp1.substations

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `wp1.substations`; required
  - Fields: `code` (required, string); `name` (required, string); `discom_id` (optional, string (uuid) or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/wp1.substations/{id}

Update mutable wp1.substations fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `code` (optional, string); `name` (optional, string); `discom_id` (optional, string (uuid) or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/wp1.substation_versions

List wp1.substation_versions

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/wp1.substation_versions

Create wp1.substation_versions

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `wp1.substation_versions`; required
  - Fields: `dataset_version_id` (required, string (uuid)); `source_record_id` (optional, string (uuid) or null); `substation_id` (required, string (uuid)); `area_id` (required, string (uuid)); `point` (optional, object or null); `high_voltage_kv` (optional, number or null); `low_voltage_kv` (optional, number or null); `capacity_mva` (optional, number or null); `loading_pct` (optional, number or null); `observed_at` (optional, string (date-time) or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/wp1.substation_versions/{id}

Update mutable wp1.substation_versions fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `dataset_version_id` (optional, string (uuid)); `source_record_id` (optional, string (uuid) or null); `substation_id` (optional, string (uuid)); `area_id` (optional, string (uuid)); `point` (optional, object or null); `high_voltage_kv` (optional, number or null); `low_voltage_kv` (optional, number or null); `capacity_mva` (optional, number or null); `loading_pct` (optional, number or null); `observed_at` (optional, string (date-time) or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/wp1.feeders

List wp1.feeders

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/wp1.feeders

Create wp1.feeders

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `wp1.feeders`; required
  - Fields: `discom_id` (required, string (uuid)); `source_code` (required, string); `name` (required, string)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/wp1.feeders/{id}

Update mutable wp1.feeders fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `discom_id` (optional, string (uuid)); `source_code` (optional, string); `name` (optional, string)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/wp1.feeder_versions

List wp1.feeder_versions

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/wp1.feeder_versions

Create wp1.feeder_versions

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `wp1.feeder_versions`; required
  - Fields: `dataset_version_id` (required, string (uuid)); `source_record_id` (optional, string (uuid) or null); `feeder_id` (required, string (uuid)); `substation_id` (optional, string (uuid) or null); `area_id` (required, string (uuid)); `point` (optional, object or null); `line_geom` (optional, object or null); `voltage_kv` (optional, number or null); `sanctioned_mw` (optional, number or null); `peak_load_mw` (optional, number or null); `approved_hosting_mw` (optional, number or null); `saidi_minutes` (optional, number or null); `saifi_count` (optional, number or null); `reference_start` (optional, string (date) or null); `reference_end` (optional, string (date) or null); `outage_threshold_minutes` (optional, number or null); `method_reference` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/wp1.feeder_versions/{id}

Update mutable wp1.feeder_versions fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `dataset_version_id` (optional, string (uuid)); `source_record_id` (optional, string (uuid) or null); `feeder_id` (optional, string (uuid)); `substation_id` (optional, string (uuid) or null); `area_id` (optional, string (uuid)); `point` (optional, object or null); `line_geom` (optional, object or null); `voltage_kv` (optional, number or null); `sanctioned_mw` (optional, number or null); `peak_load_mw` (optional, number or null); `approved_hosting_mw` (optional, number or null); `saidi_minutes` (optional, number or null); `saifi_count` (optional, number or null); `reference_start` (optional, string (date) or null); `reference_end` (optional, string (date) or null); `outage_threshold_minutes` (optional, number or null); `method_reference` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/wp1.feeder_load_readings

List wp1.feeder_load_readings

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/wp1.feeder_load_readings

Create wp1.feeder_load_readings

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `wp1.feeder_load_readings`; required
  - Fields: `dataset_version_id` (required, string (uuid)); `source_record_id` (optional, string (uuid) or null); `feeder_id` (required, string (uuid)); `observed_at` (required, string (date-time)); `load_mw` (required, number); `quality_flag` (required, string); `interval_minutes` (optional, integer or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/wp1.feeder_load_readings/{id}

Update mutable wp1.feeder_load_readings fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `dataset_version_id` (optional, string (uuid)); `source_record_id` (optional, string (uuid) or null); `feeder_id` (optional, string (uuid)); `observed_at` (optional, string (date-time)); `load_mw` (optional, number); `quality_flag` (optional, string); `interval_minutes` (optional, integer or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/wp1.solar_installations

List wp1.solar_installations

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/wp1.solar_installations

Create wp1.solar_installations

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `wp1.solar_installations`; required
  - Fields: `code` (required, string); `name` (required, string); `installation_type` (required, string); `owner_id` (optional, string (uuid) or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/wp1.solar_installations/{id}

Update mutable wp1.solar_installations fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `code` (optional, string); `name` (optional, string); `installation_type` (optional, string); `owner_id` (optional, string (uuid) or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/wp1.solar_installation_versions

List wp1.solar_installation_versions

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/wp1.solar_installation_versions

Create wp1.solar_installation_versions

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `wp1.solar_installation_versions`; required
  - Fields: `dataset_version_id` (required, string (uuid)); `source_record_id` (optional, string (uuid) or null); `installation_id` (required, string (uuid)); `area_id` (required, string (uuid)); `point` (optional, object or null); `footprint` (optional, object or null); `capacity_dc_mwp` (optional, number or null); `capacity_ac_mw` (optional, number or null); `clearance_m` (optional, number or null); `row_pitch_m` (optional, number or null); `layout_type` (optional, string or null); `land_rights_status` (optional, string or null); `operational_status` (optional, string or null); `as_of_date` (optional, string (date) or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/wp1.solar_installation_versions/{id}

Update mutable wp1.solar_installation_versions fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `dataset_version_id` (optional, string (uuid)); `source_record_id` (optional, string (uuid) or null); `installation_id` (optional, string (uuid)); `area_id` (optional, string (uuid)); `point` (optional, object or null); `footprint` (optional, object or null); `capacity_dc_mwp` (optional, number or null); `capacity_ac_mw` (optional, number or null); `clearance_m` (optional, number or null); `row_pitch_m` (optional, number or null); `layout_type` (optional, string or null); `land_rights_status` (optional, string or null); `operational_status` (optional, string or null); `as_of_date` (optional, string (date) or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/wp1.environment_observations

List wp1.environment_observations

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/wp1.environment_observations

Create wp1.environment_observations

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `wp1.environment_observations`; required
  - Fields: `dataset_version_id` (required, string (uuid)); `source_record_id` (optional, string (uuid) or null); `area_id` (required, string (uuid)); `unit_id` (required, string (uuid)); `metric_code` (required, string); `category_code` (optional, string); `period_start` (required, string (date)); `period_end` (required, string (date)); `value` (optional, number or null); `value_status` (optional, string); `resolution` (required, string); `method_reference` (optional, string or null); `point` (optional, object or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/wp1.environment_observations/{id}

Update mutable wp1.environment_observations fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `dataset_version_id` (optional, string (uuid)); `source_record_id` (optional, string (uuid) or null); `area_id` (optional, string (uuid)); `unit_id` (optional, string (uuid)); `metric_code` (optional, string); `category_code` (optional, string); `period_start` (optional, string (date)); `period_end` (optional, string (date)); `value` (optional, number or null); `value_status` (optional, string); `resolution` (optional, string); `method_reference` (optional, string or null); `point` (optional, object or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/wp1.agro_zones

List wp1.agro_zones

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/wp1.agro_zones

Create wp1.agro_zones

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `wp1.agro_zones`; required
  - Fields: `dataset_version_id` (required, string (uuid)); `source_record_id` (optional, string (uuid) or null); `code` (required, string); `name` (required, string); `geom` (optional, object or null); `rainfall_band` (optional, string or null); `temperature_band` (optional, string or null); `notes` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/wp1.agro_zones/{id}

Update mutable wp1.agro_zones fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `dataset_version_id` (optional, string (uuid)); `source_record_id` (optional, string (uuid) or null); `code` (optional, string); `name` (optional, string); `geom` (optional, object or null); `rainfall_band` (optional, string or null); `temperature_band` (optional, string or null); `notes` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/wp1.crop_suitability

List wp1.crop_suitability

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/wp1.crop_suitability

Create wp1.crop_suitability

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `wp1.crop_suitability`; required
  - Fields: `dataset_version_id` (required, string (uuid)); `source_record_id` (optional, string (uuid) or null); `crop_id` (required, string (uuid)); `season_id` (required, string (uuid)); `zone_id` (optional, string (uuid) or null); `shade_tolerance_pct` (optional, number or null); `minimum_dli` (optional, number or null); `growth_days` (optional, integer or null); `sowing_window` (optional, string or null); `harvest_window` (optional, string or null); `irrigation_requirement` (optional, string or null); `method_reference` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/wp1.crop_suitability/{id}

Update mutable wp1.crop_suitability fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `dataset_version_id` (optional, string (uuid)); `source_record_id` (optional, string (uuid) or null); `crop_id` (optional, string (uuid)); `season_id` (optional, string (uuid)); `zone_id` (optional, string (uuid) or null); `shade_tolerance_pct` (optional, number or null); `minimum_dli` (optional, number or null); `growth_days` (optional, integer or null); `sowing_window` (optional, string or null); `harvest_window` (optional, string or null); `irrigation_requirement` (optional, string or null); `method_reference` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/wp1.irrigation_statistics

List wp1.irrigation_statistics

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/wp1.irrigation_statistics

Create wp1.irrigation_statistics

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `wp1.irrigation_statistics`; required
  - Fields: `dataset_version_id` (required, string (uuid)); `source_record_id` (optional, string (uuid) or null); `area_id` (required, string (uuid)); `unit_id` (required, string (uuid)); `period_label` (required, string); `water_source` (required, string); `irrigation_method` (required, string); `value` (optional, number or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/wp1.irrigation_statistics/{id}

Update mutable wp1.irrigation_statistics fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `dataset_version_id` (optional, string (uuid)); `source_record_id` (optional, string (uuid) or null); `area_id` (optional, string (uuid)); `unit_id` (optional, string (uuid)); `period_label` (optional, string); `water_source` (optional, string); `irrigation_method` (optional, string); `value` (optional, number or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/wp1.land_parcels

List wp1.land_parcels

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/wp1.land_parcels

Create wp1.land_parcels

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `wp1.land_parcels`; required
  - Fields: `dataset_version_id` (required, string (uuid)); `source_record_id` (optional, string (uuid) or null); `area_id` (required, string (uuid)); `source_parcel_key` (required, string); `geom` (required, object); `area_ha` (optional, number or null); `land_use` (optional, string or null); `slope_degrees` (optional, number or null); `soil_type` (optional, string or null); `rights_status` (optional, string or null); `constraints` (optional, object)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/wp1.land_parcels/{id}

Update mutable wp1.land_parcels fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `dataset_version_id` (optional, string (uuid)); `source_record_id` (optional, string (uuid) or null); `area_id` (optional, string (uuid)); `source_parcel_key` (optional, string); `geom` (optional, object); `area_ha` (optional, number or null); `land_use` (optional, string or null); `slope_degrees` (optional, number or null); `soil_type` (optional, string or null); `rights_status` (optional, string or null); `constraints` (optional, object)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/content.resources

List content.resources

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/content.resources

Create content.resources

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `content.resources`; required
  - Fields: `code` (required, string); `resource_type` (required, string); `theme` (required, string)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/content.resources/{id}

Update mutable content.resources fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `code` (optional, string); `resource_type` (optional, string); `theme` (optional, string)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/content.resource_versions

List content.resource_versions

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/content.resource_versions

Create content.resource_versions

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `content.resource_versions`; required
  - Fields: `dataset_version_id` (required, string (uuid)); `source_record_id` (optional, string (uuid) or null); `resource_id` (required, string (uuid)); `locale_id` (required, string (uuid)); `file_id` (optional, string (uuid) or null); `title` (required, string); `body` (optional, string or null); `external_uri` (optional, string or null); `published_date` (optional, string (date) or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/content.resource_versions/{id}

Update mutable content.resource_versions fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `dataset_version_id` (optional, string (uuid)); `source_record_id` (optional, string (uuid) or null); `resource_id` (optional, string (uuid)); `locale_id` (optional, string (uuid)); `file_id` (optional, string (uuid) or null); `title` (optional, string); `body` (optional, string or null); `external_uri` (optional, string or null); `published_date` (optional, string (date) or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/content.resource_areas

List content.resource_areas

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/content.resource_areas

Create content.resource_areas

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `content.resource_areas`; required
  - Fields: `resource_id` (required, string (uuid)); `area_id` (required, string (uuid))

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/content.resource_areas/{id}

Update mutable content.resource_areas fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `resource_id` (optional, string (uuid)); `area_id` (optional, string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/content.policies

List content.policies

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/content.policies

Create content.policies

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `content.policies`; required
  - Fields: `code` (required, string); `name` (required, string); `kind` (required, string; allowed: policy, scheme); `issuer_id` (optional, string (uuid) or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/content.policies/{id}

Update mutable content.policies fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `code` (optional, string); `name` (optional, string); `kind` (optional, string; allowed: policy, scheme); `issuer_id` (optional, string (uuid) or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/content.policy_versions

List content.policy_versions

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/content.policy_versions

Create content.policy_versions

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `content.policy_versions`; required
  - Fields: `dataset_version_id` (required, string (uuid)); `source_record_id` (optional, string (uuid) or null); `policy_id` (required, string (uuid)); `file_id` (optional, string (uuid) or null); `effective_from` (optional, string (date) or null); `effective_to` (optional, string (date) or null); `status` (required, string); `eligibility` (optional, object); `benefits` (optional, object); `summary` (optional, string or null); `review_due` (optional, string (date) or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/content.policy_versions/{id}

Update mutable content.policy_versions fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `dataset_version_id` (optional, string (uuid)); `source_record_id` (optional, string (uuid) or null); `policy_id` (optional, string (uuid)); `file_id` (optional, string (uuid) or null); `effective_from` (optional, string (date) or null); `effective_to` (optional, string (date) or null); `status` (optional, string); `eligibility` (optional, object); `benefits` (optional, object); `summary` (optional, string or null); `review_due` (optional, string (date) or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/content.policy_areas

List content.policy_areas

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/content.policy_areas

Create content.policy_areas

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `content.policy_areas`; required
  - Fields: `policy_version_id` (required, string (uuid)); `area_id` (required, string (uuid)); `zone_geom` (optional, object or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/content.policy_areas/{id}

Update mutable content.policy_areas fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `policy_version_id` (optional, string (uuid)); `area_id` (optional, string (uuid)); `zone_geom` (optional, object or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/plan.methods

List plan.methods

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/plan.methods

Create plan.methods

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `plan.methods`; required
  - Fields: `code` (required, string); `name` (required, string); `function_code` (required, string; allowed: suitability, grid, model, market, scheme, retrofit, shading, finance, monitoring)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/plan.methods/{id}

Update mutable plan.methods fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `code` (optional, string); `name` (optional, string); `function_code` (optional, string; allowed: suitability, grid, model, market, scheme, retrofit, shading, finance, monitoring)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/plan.method_versions

List plan.method_versions

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/plan.method_versions

Create plan.method_versions

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `plan.method_versions`; required
  - Fields: `method_id` (required, string (uuid)); `version_label` (required, string); `configuration` (required, object); `code_digest` (required, string); `limitations` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/plan.method_versions/{id}

Update mutable plan.method_versions fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `method_id` (optional, string (uuid)); `version_label` (optional, string); `configuration` (optional, object); `code_digest` (optional, string); `limitations` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/plan.criteria

List plan.criteria

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/plan.criteria

Create plan.criteria

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `plan.criteria`; required
  - Fields: `method_version_id` (required, string (uuid)); `unit_id` (optional, string (uuid) or null); `code` (required, string); `weight` (optional, number or null); `normalisation` (required, object); `exclusion_rule` (optional, object or null); `missing_action` (required, string; allowed: withhold, flag, approved_renormalisation)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/plan.criteria/{id}

Update mutable plan.criteria fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `method_version_id` (optional, string (uuid)); `unit_id` (optional, string (uuid) or null); `code` (optional, string); `weight` (optional, number or null); `normalisation` (optional, object); `exclusion_rule` (optional, object or null); `missing_action` (optional, string; allowed: withhold, flag, approved_renormalisation)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/mon.periods

List mon.periods

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.periods

Create mon.periods

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.periods`; required
  - Fields: `season_id` (optional, string (uuid) or null); `code` (required, string); `kind` (required, string; allowed: quarterly, seasonal, annual, monthly); `start_date` (required, string (date)); `end_date` (required, string (date)); `calendar_basis` (required, string)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.periods/{id}

Update mutable mon.periods fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `season_id` (optional, string (uuid) or null); `code` (optional, string); `kind` (optional, string; allowed: quarterly, seasonal, annual, monthly); `start_date` (optional, string (date)); `end_date` (optional, string (date)); `calendar_basis` (optional, string)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/mon.indicators

List mon.indicators

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.indicators

Create mon.indicators

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.indicators`; required
  - Fields: `code` (required, string); `name` (required, string); `domain` (required, string; allowed: energy, agriculture, income, land, nature, inclusion, progress); `aggregation` (required, string; allowed: sum, weighted_ratio, latest, distinct_count, non_additive)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.indicators/{id}

Update mutable mon.indicators fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `code` (optional, string); `name` (optional, string); `domain` (optional, string; allowed: energy, agriculture, income, land, nature, inclusion, progress); `aggregation` (optional, string; allowed: sum, weighted_ratio, latest, distinct_count, non_additive)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/mon.indicator_versions

List mon.indicator_versions

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.indicator_versions

Create mon.indicator_versions

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.indicator_versions`; required
  - Fields: `indicator_id` (required, string (uuid)); `unit_id` (optional, string (uuid) or null); `method_version_id` (optional, string (uuid) or null); `version` (required, integer); `value_type` (required, string; allowed: number, text, boolean, date, choice, json); `validation` (required, object); `frequency` (required, string); `is_sensitive` (optional, boolean)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.indicator_versions/{id}

Update mutable mon.indicator_versions fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `indicator_id` (optional, string (uuid)); `unit_id` (optional, string (uuid) or null); `method_version_id` (optional, string (uuid) or null); `version` (optional, integer); `value_type` (optional, string; allowed: number, text, boolean, date, choice, json); `validation` (optional, object); `frequency` (optional, string); `is_sensitive` (optional, boolean)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/mon.form_versions

List mon.form_versions

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.form_versions

Create mon.form_versions

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.form_versions`; required
  - Fields: `code` (required, string); `version` (required, integer); `name` (required, string)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.form_versions/{id}

Update mutable mon.form_versions fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `code` (optional, string); `version` (optional, integer); `name` (optional, string)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/mon.form_fields

List mon.form_fields

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.form_fields

Create mon.form_fields

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.form_fields`; required
  - Fields: `form_version_id` (required, string (uuid)); `indicator_version_id` (required, string (uuid)); `section_code` (required, string); `field_code` (required, string); `sort_order` (required, integer); `required` (optional, boolean); `repeat_group` (optional, string or null); `visibility_rule` (optional, object or null); `label_key` (required, string)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.form_fields/{id}

Update mutable mon.form_fields fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `form_version_id` (optional, string (uuid)); `indicator_version_id` (optional, string (uuid)); `section_code` (optional, string); `field_code` (optional, string); `sort_order` (optional, integer); `required` (optional, boolean); `repeat_group` (optional, string or null); `visibility_rule` (optional, object or null); `label_key` (optional, string)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/mon.beneficiaries

List mon.beneficiaries

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.beneficiaries

Create mon.beneficiaries

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.beneficiaries`; required
  - Fields: `organisation_id` (required, string (uuid)); `pseudonym` (required, string); `gender` (optional, string or null); `birth_year` (optional, integer or null); `household_code` (optional, string or null); `consent_reference` (optional, string or null); `retired_at` (optional, string (date-time) or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.beneficiaries/{id}

Update mutable mon.beneficiaries fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `organisation_id` (optional, string (uuid)); `pseudonym` (optional, string); `gender` (optional, string or null); `birth_year` (optional, integer or null); `household_code` (optional, string or null); `consent_reference` (optional, string or null); `retired_at` (optional, string (date-time) or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

### Resources: profile

#### GET /manage/resources/project.partners

List project.partners

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/project.partners

Create project.partners

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `project.partners`; required
  - Fields: `project_version_id` (required, string (uuid)); `organisation_id` (required, string (uuid)); `partner_role` (required, string)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/project.partners/{id}

Update mutable project.partners fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `project_version_id` (optional, string (uuid)); `organisation_id` (optional, string (uuid)); `partner_role` (optional, string)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/project.partners/{id}

Delete draft/scoped project.partners record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/project.land_uses

List project.land_uses

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/project.land_uses

Create project.land_uses

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `project.land_uses`; required
  - Fields: `project_version_id` (required, string (uuid)); `use_code` (required, string); `area_ha` (required, number); `overlap_group` (required, string); `notes` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/project.land_uses/{id}

Update mutable project.land_uses fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `project_version_id` (optional, string (uuid)); `use_code` (optional, string); `area_ha` (optional, number); `overlap_group` (optional, string); `notes` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/project.land_uses/{id}

Delete draft/scoped project.land_uses record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/project.designs

List project.designs

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/project.designs

Create project.designs

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `project.designs`; required
  - Fields: `project_version_id` (required, string (uuid)); `array_code` (required, string); `module_technology` (optional, string or null); `module_power_wp` (optional, number or null); `module_count` (optional, integer or null); `module_width_m` (optional, number or null); `module_length_m` (optional, number or null); `transparency_pct` (optional, number or null); `mounting_type` (optional, string or null); `clearance_m` (optional, number or null); `row_pitch_m` (optional, number or null); `column_spacing_m` (optional, number or null); `tilt_degrees` (optional, number or null); `azimuth_degrees` (optional, number or null); `tracking_type` (optional, string or null); `tracking_manufacturer` (optional, string or null); `piling_type` (optional, string or null); `piling_material` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/project.designs/{id}

Update mutable project.designs fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `project_version_id` (optional, string (uuid)); `array_code` (optional, string); `module_technology` (optional, string or null); `module_power_wp` (optional, number or null); `module_count` (optional, integer or null); `module_width_m` (optional, number or null); `module_length_m` (optional, number or null); `transparency_pct` (optional, number or null); `mounting_type` (optional, string or null); `clearance_m` (optional, number or null); `row_pitch_m` (optional, number or null); `column_spacing_m` (optional, number or null); `tilt_degrees` (optional, number or null); `azimuth_degrees` (optional, number or null); `tracking_type` (optional, string or null); `tracking_manufacturer` (optional, string or null); `piling_type` (optional, string or null); `piling_material` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/project.designs/{id}

Delete draft/scoped project.designs record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/project.grid_connections

List project.grid_connections

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/project.grid_connections

Create project.grid_connections

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `project.grid_connections`; required
  - Fields: `project_version_id` (required, string (uuid)); `feeder_id` (optional, string (uuid) or null); `substation_id` (optional, string (uuid) or null); `discom_id` (required, string (uuid)); `connection_code` (required, string); `voltage_kv` (optional, number or null); `export_limit_mw` (optional, number or null); `metering_policy` (optional, string or null); `tariff_inr_kwh` (optional, number or null); `tariff_category` (optional, string or null); `valid_from` (optional, string (date) or null); `valid_to` (optional, string (date) or null); `substation_distance_km` (optional, number or null); `distance_method` (optional, string or null); `approval_file_id` (optional, string (uuid) or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/project.grid_connections/{id}

Update mutable project.grid_connections fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `project_version_id` (optional, string (uuid)); `feeder_id` (optional, string (uuid) or null); `substation_id` (optional, string (uuid) or null); `discom_id` (optional, string (uuid)); `connection_code` (optional, string); `voltage_kv` (optional, number or null); `export_limit_mw` (optional, number or null); `metering_policy` (optional, string or null); `tariff_inr_kwh` (optional, number or null); `tariff_category` (optional, string or null); `valid_from` (optional, string (date) or null); `valid_to` (optional, string (date) or null); `substation_distance_km` (optional, number or null); `distance_method` (optional, string or null); `approval_file_id` (optional, string (uuid) or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/project.grid_connections/{id}

Delete draft/scoped project.grid_connections record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/project.crop_plans

List project.crop_plans

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/project.crop_plans

Create project.crop_plans

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `project.crop_plans`; required
  - Fields: `project_version_id` (required, string (uuid)); `crop_id` (required, string (uuid)); `season_id` (required, string (uuid)); `plot_code` (optional, string); `agricultural_year` (required, string); `area_ha` (optional, number or null); `sowing_date` (optional, string (date) or null); `harvest_date` (optional, string (date) or null); `water_source` (optional, string or null); `irrigation_method` (optional, string or null); `selection_rationale` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/project.crop_plans/{id}

Update mutable project.crop_plans fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `project_version_id` (optional, string (uuid)); `crop_id` (optional, string (uuid)); `season_id` (optional, string (uuid)); `plot_code` (optional, string); `agricultural_year` (optional, string); `area_ha` (optional, number or null); `sowing_date` (optional, string (date) or null); `harvest_date` (optional, string (date) or null); `water_source` (optional, string or null); `irrigation_method` (optional, string or null); `selection_rationale` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/project.crop_plans/{id}

Delete draft/scoped project.crop_plans record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/project.profile_notes

List project.profile_notes

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/project.profile_notes

Create project.profile_notes

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `project.profile_notes`; required
  - Fields: `project_version_id` (required, string (uuid)); `field_code` (required, string); `section_code` (required, string); `narrative` (required, string); `visibility` (optional, string; allowed: public, restricted)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/project.profile_notes/{id}

Update mutable project.profile_notes fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `project_version_id` (optional, string (uuid)); `field_code` (optional, string); `section_code` (optional, string); `narrative` (optional, string); `visibility` (optional, string; allowed: public, restricted)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/project.profile_notes/{id}

Delete draft/scoped project.profile_notes record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/project.documents

List project.documents

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/project.documents

Create project.documents

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `project.documents`; required
  - Fields: `project_version_id` (required, string (uuid)); `file_id` (required, string (uuid)); `category` (required, string); `caption` (optional, string or null); `public_allowed` (optional, boolean)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/project.documents/{id}

Update mutable project.documents fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `project_version_id` (optional, string (uuid)); `file_id` (optional, string (uuid)); `category` (optional, string); `caption` (optional, string or null); `public_allowed` (optional, boolean)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/project.documents/{id}

Delete draft/scoped project.documents record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

### Resources: project

#### GET /manage/resources/mon.obligations

List mon.obligations

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.obligations

Create mon.obligations

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.obligations`; required
  - Fields: `project_id` (required, string (uuid)); `period_id` (required, string (uuid)); `form_version_id` (required, string (uuid)); `assigned_to` (required, string (uuid)); `reporting_stream` (required, string); `due_at` (required, string (date-time)); `waived_at` (optional, string (date-time) or null); `waiver_reason` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.obligations/{id}

Update mutable mon.obligations fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `project_id` (optional, string (uuid)); `period_id` (optional, string (uuid)); `form_version_id` (optional, string (uuid)); `assigned_to` (optional, string (uuid)); `reporting_stream` (optional, string); `due_at` (optional, string (date-time)); `waived_at` (optional, string (date-time) or null); `waiver_reason` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/mon.obligations/{id}

Delete draft/scoped mon.obligations record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/mon.baselines

List mon.baselines

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.baselines

Create mon.baselines

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.baselines`; required
  - Fields: `project_id` (required, string (uuid)); `crop_id` (required, string (uuid)); `period_id` (required, string (uuid)); `source_file_id` (optional, string (uuid) or null); `dataset_version_id` (optional, string (uuid) or null); `method_version_id` (required, string (uuid)); `plot_code` (required, string); `baseline_type` (required, string; allowed: control_plot, regional, historical); `yield_t_ha` (optional, number or null); `area_ha` (optional, number or null); `source_reference` (required, string); `comparability_notes` (required, string)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.baselines/{id}

Update mutable mon.baselines fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `project_id` (optional, string (uuid)); `crop_id` (optional, string (uuid)); `period_id` (optional, string (uuid)); `source_file_id` (optional, string (uuid) or null); `dataset_version_id` (optional, string (uuid) or null); `method_version_id` (optional, string (uuid)); `plot_code` (optional, string); `baseline_type` (optional, string; allowed: control_plot, regional, historical); `yield_t_ha` (optional, number or null); `area_ha` (optional, number or null); `source_reference` (optional, string); `comparability_notes` (optional, string)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/mon.baselines/{id}

Delete draft/scoped mon.baselines record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/mon.project_beneficiaries

List mon.project_beneficiaries

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.project_beneficiaries

Create mon.project_beneficiaries

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.project_beneficiaries`; required
  - Fields: `project_id` (required, string (uuid)); `beneficiary_id` (required, string (uuid)); `role` (required, string); `start_date` (required, string (date)); `end_date` (optional, string (date) or null); `land_area_ha` (optional, number or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.project_beneficiaries/{id}

Update mutable mon.project_beneficiaries fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `project_id` (optional, string (uuid)); `beneficiary_id` (optional, string (uuid)); `role` (optional, string); `start_date` (optional, string (date)); `end_date` (optional, string (date) or null); `land_area_ha` (optional, number or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/mon.project_beneficiaries/{id}

Delete draft/scoped mon.project_beneficiaries record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

### Resources: submission

#### GET /manage/resources/mon.energy_records

List mon.energy_records

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.energy_records

Create mon.energy_records

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.energy_records`; required
  - Fields: `submission_version_id` (required, string (uuid)); `segment_code` (required, string); `start_at` (required, string (date-time)); `end_at` (required, string (date-time)); `generation_mwh` (required, number); `export_mwh` (optional, number or null); `onsite_mwh` (optional, number or null); `capacity_dc_mwp` (required, number); `capacity_ac_mw` (optional, number or null); `operational_hours` (optional, number or null); `reference_hours` (required, number); `meter_reference` (required, string)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.energy_records/{id}

Update mutable mon.energy_records fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `submission_version_id` (optional, string (uuid)); `segment_code` (optional, string); `start_at` (optional, string (date-time)); `end_at` (optional, string (date-time)); `generation_mwh` (optional, number); `export_mwh` (optional, number or null); `onsite_mwh` (optional, number or null); `capacity_dc_mwp` (optional, number); `capacity_ac_mw` (optional, number or null); `operational_hours` (optional, number or null); `reference_hours` (optional, number); `meter_reference` (optional, string)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/mon.energy_records/{id}

Delete draft/scoped mon.energy_records record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/mon.harvest_records

List mon.harvest_records

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.harvest_records

Create mon.harvest_records

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.harvest_records`; required
  - Fields: `submission_version_id` (required, string (uuid)); `crop_id` (required, string (uuid)); `season_id` (required, string (uuid)); `baseline_id` (optional, string (uuid) or null); `plot_code` (required, string); `harvest_date` (optional, string (date) or null); `cultivated_area_ha` (required, number); `production_t` (required, number); `cultivation_cost_inr` (optional, number or null); `crop_failure_note` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.harvest_records/{id}

Update mutable mon.harvest_records fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `submission_version_id` (optional, string (uuid)); `crop_id` (optional, string (uuid)); `season_id` (optional, string (uuid)); `baseline_id` (optional, string (uuid) or null); `plot_code` (optional, string); `harvest_date` (optional, string (date) or null); `cultivated_area_ha` (optional, number); `production_t` (optional, number); `cultivation_cost_inr` (optional, number or null); `crop_failure_note` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/mon.harvest_records/{id}

Delete draft/scoped mon.harvest_records record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/mon.participation_records

List mon.participation_records

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.participation_records

Create mon.participation_records

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.participation_records`; required
  - Fields: `submission_version_id` (required, string (uuid)); `beneficiary_id` (required, string (uuid)); `role` (required, string); `gender_at_period` (optional, string or null); `age_at_period` (optional, integer or null); `is_youth` (optional, boolean or null); `participation_days` (optional, number or null); `job_phase` (optional, string; allowed: construction, operation, agriculture, other or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.participation_records/{id}

Update mutable mon.participation_records fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `submission_version_id` (optional, string (uuid)); `beneficiary_id` (optional, string (uuid)); `role` (optional, string); `gender_at_period` (optional, string or null); `age_at_period` (optional, integer or null); `is_youth` (optional, boolean or null); `participation_days` (optional, number or null); `job_phase` (optional, string; allowed: construction, operation, agriculture, other or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/mon.participation_records/{id}

Delete draft/scoped mon.participation_records record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/mon.inclusion_totals

List mon.inclusion_totals

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.inclusion_totals

Create mon.inclusion_totals

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.inclusion_totals`; required
  - Fields: `submission_version_id` (required, string (uuid)); `population_code` (required, string); `women` (required, integer); `men` (required, integer); `other_gender` (required, integer); `gender_unknown` (required, integer); `youth` (optional, integer or null); `households` (optional, integer or null); `count_basis` (required, string)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.inclusion_totals/{id}

Update mutable mon.inclusion_totals fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `submission_version_id` (optional, string (uuid)); `population_code` (optional, string); `women` (optional, integer); `men` (optional, integer); `other_gender` (optional, integer); `gender_unknown` (optional, integer); `youth` (optional, integer or null); `households` (optional, integer or null); `count_basis` (optional, string)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/mon.inclusion_totals/{id}

Delete draft/scoped mon.inclusion_totals record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/mon.income_records

List mon.income_records

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.income_records

Create mon.income_records

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.income_records`; required
  - Fields: `submission_version_id` (required, string (uuid)); `scope_kind` (required, string; allowed: project, fpo, household); `scope_key` (required, string); `component` (required, string); `amount_inr` (required, number); `accounting_basis` (required, string; allowed: gross_receipt, expense, net_income, transfer); `source_reference` (required, string)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.income_records/{id}

Update mutable mon.income_records fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `submission_version_id` (optional, string (uuid)); `scope_kind` (optional, string; allowed: project, fpo, household); `scope_key` (optional, string); `component` (optional, string); `amount_inr` (optional, number); `accounting_basis` (optional, string; allowed: gross_receipt, expense, net_income, transfer); `source_reference` (optional, string)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/mon.income_records/{id}

Delete draft/scoped mon.income_records record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/mon.land_records

List mon.land_records

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.land_records

Create mon.land_records

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.land_records`; required
  - Fields: `submission_version_id` (required, string (uuid)); `plot_code` (required, string); `site_area_ha` (required, number); `solar_area_ha` (optional, number or null); `cultivated_area_ha` (optional, number or null); `notes` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.land_records/{id}

Update mutable mon.land_records fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `submission_version_id` (optional, string (uuid)); `plot_code` (optional, string); `site_area_ha` (optional, number); `solar_area_ha` (optional, number or null); `cultivated_area_ha` (optional, number or null); `notes` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/mon.land_records/{id}

Delete draft/scoped mon.land_records record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/mon.practice_records

List mon.practice_records

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.practice_records

Create mon.practice_records

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.practice_records`; required
  - Fields: `submission_version_id` (required, string (uuid)); `practice_id` (required, string (uuid)); `plot_code` (optional, string); `adoption_status` (required, string; allowed: adopted, not_adopted, unknown, not_applicable); `measured_value` (optional, number or null); `unit_id` (optional, string (uuid) or null); `notes` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.practice_records/{id}

Update mutable mon.practice_records fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `submission_version_id` (optional, string (uuid)); `practice_id` (optional, string (uuid)); `plot_code` (optional, string); `adoption_status` (optional, string; allowed: adopted, not_adopted, unknown, not_applicable); `measured_value` (optional, number or null); `unit_id` (optional, string (uuid) or null); `notes` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/mon.practice_records/{id}

Delete draft/scoped mon.practice_records record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/mon.scheme_linkages

List mon.scheme_linkages

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.scheme_linkages

Create mon.scheme_linkages

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.scheme_linkages`; required
  - Fields: `submission_version_id` (required, string (uuid)); `policy_version_id` (required, string (uuid)); `reference_number` (required, string); `status` (required, string); `benefit_inr` (optional, number or null); `beneficiaries_count` (optional, integer or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.scheme_linkages/{id}

Update mutable mon.scheme_linkages fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `submission_version_id` (optional, string (uuid)); `policy_version_id` (optional, string (uuid)); `reference_number` (optional, string); `status` (optional, string); `benefit_inr` (optional, number or null); `beneficiaries_count` (optional, integer or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/mon.scheme_linkages/{id}

Delete draft/scoped mon.scheme_linkages record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/mon.progress_records

List mon.progress_records

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.progress_records

Create mon.progress_records

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.progress_records`; required
  - Fields: `submission_version_id` (required, string (uuid)); `milestone_code` (required, string); `planned_date` (optional, string (date) or null); `actual_date` (optional, string (date) or null); `completion_pct` (optional, number or null); `status` (required, string); `note` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.progress_records/{id}

Update mutable mon.progress_records fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `submission_version_id` (optional, string (uuid)); `milestone_code` (optional, string); `planned_date` (optional, string (date) or null); `actual_date` (optional, string (date) or null); `completion_pct` (optional, number or null); `status` (optional, string); `note` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/mon.progress_records/{id}

Delete draft/scoped mon.progress_records record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources/mon.evidence

List mon.evidence

**Authentication:** JWT access token.

**Parameters:**
- `query.limit` (optional; integer)
- `query.offset` (optional; integer)
- `query.parentId` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /manage/resources/mon.evidence

Create mon.evidence

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; schema: `mon.evidence`; required
  - Fields: `submission_version_id` (required, string (uuid)); `file_id` (required, string (uuid)); `indicator_version_id` (optional, string (uuid) or null); `record_path` (required, string); `category` (required, string); `caption` (optional, string or null)

**Documented responses:**
- `200`: Success
- `201`: Created
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /manage/resources/mon.evidence/{id}

Update mutable mon.evidence fields

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Request body:**
- Content-Type: `application/json`; object; required
  - Fields: `submission_version_id` (optional, string (uuid)); `file_id` (optional, string (uuid)); `indicator_version_id` (optional, string (uuid) or null); `record_path` (optional, string); `category` (optional, string); `caption` (optional, string or null)

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /manage/resources/mon.evidence/{id}

Delete draft/scoped mon.evidence record

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string (uuid))

**Documented responses:**
- `200`: Success
- `400`: Invalid fields
- `401`: Authentication required
- `403`: Outside role/project scope
- `409`: Immutable, referenced or duplicate record
- `422`: Validation or database constraint
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

### public

#### GET /health

GET /health

**Authentication:** Public.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /ready

GET /ready

**Authentication:** Public.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/home

GET /wp1/home

**Authentication:** Public.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/areas

GET /wp1/areas

**Authentication:** Public.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/areas/{id}/boundary

GET /wp1/areas/{id}/boundary

**Authentication:** Public.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/search

GET /wp1/search

**Authentication:** Public.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/features

GET /wp1/features

**Authentication:** Public.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/nearby

GET /wp1/nearby

**Authentication:** Public.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/layers

GET /wp1/layers

**Authentication:** Public.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/layers/{id}/features

GET /wp1/layers/{id}/features

**Authentication:** Public.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/demo-project

GET /wp1/demo-project

**Authentication:** Public.

**Documented responses:**
- `200`: Illustrative draft record with illustrative_only=true and publicly_released=false
- `404`: The record is not seeded or the server is not running in development mode
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/projects

GET /wp1/projects

**Authentication:** Public.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/projects/{id}

GET /wp1/projects/{id}

**Authentication:** Public.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/districts/{id}

GET /wp1/districts/{id}

**Authentication:** Public.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/districts/{id}/{domain}

GET /wp1/districts/{id}/{domain}

**Authentication:** Public.

**Parameters:**
- `path.id` (required; string)
- `path.domain` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /wp1/compare

POST /wp1/compare

**Authentication:** Public.

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/datasets

GET /wp1/datasets

**Authentication:** Public.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/datasets/{id}

GET /wp1/datasets/{id}

**Authentication:** Public.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/resources

GET /wp1/resources

**Authentication:** Public.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/policies

GET /wp1/policies

**Authentication:** Public.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/files/{id}

GET /wp1/files/{id}

**Authentication:** Public.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp1/exports/{id}/{resource}

GET /wp1/exports/{id}/{resource}

**Authentication:** Public.

**Parameters:**
- `path.id` (required; string)
- `path.resource` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /reference/{kind}

GET /reference/{kind}

**Authentication:** Public.

**Parameters:**
- `path.kind` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /wp2/estimate-energy

POST /wp2/estimate-energy

**Authentication:** Public.

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp2/engines

GET /wp2/engines

**Authentication:** Public.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /wp2/assessments

POST /wp2/assessments

**Authentication:** Public.

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

### planning

#### GET /wp2/assessments/{id}

GET /wp2/assessments/{id}

**Authentication:** Planning token.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /wp2/assessments/{id}/scenarios

POST /wp2/assessments/{id}/scenarios

**Authentication:** Planning token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /wp2/assessments/{id}/runs

POST /wp2/assessments/{id}/runs

**Authentication:** Planning token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp2/assessments/{id}/runs

GET /wp2/assessments/{id}/runs

**Authentication:** Planning token.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp2/assessments/{id}/report

GET /wp2/assessments/{id}/report

**Authentication:** Planning token.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

### user

#### GET /auth/me

GET /auth/me

**Authentication:** JWT access token.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /internal/projects

GET /internal/projects

**Authentication:** JWT access token.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /internal/projects

POST /internal/projects

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /internal/projects/{id}

GET /internal/projects/{id}

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /internal/profiles/{id}

GET /internal/profiles/{id}

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PATCH /internal/profiles/{id}

PATCH /internal/profiles/{id}

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /internal/profiles/{id}/notes

POST /internal/profiles/{id}/notes

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /internal/profiles/{id}/transition

POST /internal/profiles/{id}/transition

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /internal/profiles/{id}/revise

POST /internal/profiles/{id}/revise

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /files

POST /files

**Authentication:** JWT access token.

**Request body:**
Raw file bytes, Content-Type matching supported MIME and X-File-Name header; max 5 MiB.
- Content-Type: `application/octet-stream`; string (binary); required

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /files/{id}

GET /files/{id}

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp3/projects/{id}/obligations

GET /wp3/projects/{id}/obligations

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp3/projects/{id}/dashboard

GET /wp3/projects/{id}/dashboard

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp3/obligations/{id}/form

GET /wp3/obligations/{id}/form

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /wp3/submissions

POST /wp3/submissions

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp3/submissions/{id}

GET /wp3/submissions/{id}

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### PUT /wp3/submissions/{id}/values

PUT /wp3/submissions/{id}/values

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /wp3/submissions/{id}/validate

POST /wp3/submissions/{id}/validate

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /wp3/submissions/{id}/transition

POST /wp3/submissions/{id}/transition

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /wp3/submissions/{id}/correct

POST /wp3/submissions/{id}/correct

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /wp3/submissions/{id}/release

POST /wp3/submissions/{id}/release

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp3/submissions/{id}/history

GET /wp3/submissions/{id}/history

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /wp3/submissions/{id}/records/{kind}

GET /wp3/submissions/{id}/records/{kind}

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)
- `path.kind` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /wp3/submissions/{id}/records/{kind}

POST /wp3/submissions/{id}/records/{kind}

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)
- `path.kind` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### DELETE /wp3/submissions/{id}/records/{kind}/{recordId}

DELETE /wp3/submissions/{id}/records/{kind}/{recordId}

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)
- `path.kind` (required; string)
- `path.recordId` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /queries

GET /queries

**Authentication:** JWT access token.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /queries

POST /queries

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /notifications

GET /notifications

**Authentication:** JWT access token.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /notifications/{id}/read

POST /notifications/{id}/read

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

### admin

#### POST /files/{id}/review

POST /files/{id}/review

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /admin/users

GET /admin/users

**Authentication:** JWT access token.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /admin/users

POST /admin/users

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /admin/users/{id}/deactivate

POST /admin/users/{id}/deactivate

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /admin/projects/{id}/memberships

POST /admin/projects/{id}/memberships

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /admin/audit

GET /admin/audit

**Authentication:** JWT access token.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /admin/reminders

POST /admin/reminders

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /admin/datasets/{id}/transition

POST /admin/datasets/{id}/transition

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /admin/definitions/{kind}/{id}

POST /admin/definitions/{kind}/{id}

**Authentication:** JWT access token.

**Parameters:**
- `path.kind` (required; string)
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /admin/imports

POST /admin/imports

**Authentication:** JWT access token.

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /admin/imports/{id}/rows

GET /admin/imports/{id}/rows

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /admin/issues/{id}/resolve

POST /admin/issues/{id}/resolve

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### GET /manage/resources

GET /manage/resources

**Authentication:** JWT access token.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

#### POST /queries/{id}/answer

POST /queries/{id}/answer

**Authentication:** JWT access token.

**Parameters:**
- `path.id` (required; string)

**Request body:**
- Content-Type: `application/json`; object
  - Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.
  - See [workflow request examples](./WORKFLOWS.md); the OpenAPI spec does not enumerate this body?s exact fields.

**Documented responses:**
- `200`: Success; see docs/WORKFLOWS.md for response details
- `400`: Invalid input
- `403`: Permission denied
- `409`: Invalid workflow state
- `422`: Validation failed
- Response body shape: not specified for this operation in the current OpenAPI document; see the linked workflow guide/API conventions.

## Shared response conventions

A typical JSON error response is:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "requestId": "<request-id>"
  }
}
```

Successful JSON responses commonly use `{ "data": ... }`; list endpoints may include a `meta` object. GeoJSON endpoints can return a `FeatureCollection`; file and export endpoints may return bytes/CSV rather than JSON. Use each endpoint?s workflow documentation for its specific success payload.
