# Resource API index

All endpoints start `/api/v1`. Use `/manage/resources/<resource>` for GET/POST and `/manage/resources/<resource>/<record-id>` for PATCH. DELETE is enabled only on scoped resources. Reference/configuration rows are retired or superseded rather than deleted.

| Resource | Scope | List parentId |
| --- | --- | --- |
| `core.organisations` | admin | Not required |
| `core.units` | admin | Not required |
| `core.seasons` | admin | Not required |
| `core.crops` | admin | Not required |
| `core.models` | admin | Not required |
| `core.practices` | admin | Not required |
| `core.locales` | admin | Not required |
| `core.translations` | admin | Not required |
| `geo.areas` | admin | Not required |
| `data.sources` | admin | Not required |
| `data.datasets` | admin | Not required |
| `data.dataset_versions` | admin | Not required |
| `data.coverage` | admin | Not required |
| `data.collection_tasks` | admin | Not required |
| `geo.boundaries` | admin | Not required |
| `geo.layers` | admin | Not required |
| `geo.features` | admin | Not required |
| `wp1.land_statistics` | admin | Not required |
| `wp1.crop_production` | admin | Not required |
| `wp1.facilities` | admin | Not required |
| `wp1.facility_versions` | admin | Not required |
| `wp1.substations` | admin | Not required |
| `wp1.substation_versions` | admin | Not required |
| `wp1.feeders` | admin | Not required |
| `wp1.feeder_versions` | admin | Not required |
| `wp1.feeder_load_readings` | admin | Not required |
| `wp1.solar_installations` | admin | Not required |
| `wp1.solar_installation_versions` | admin | Not required |
| `wp1.environment_observations` | admin | Not required |
| `wp1.agro_zones` | admin | Not required |
| `wp1.crop_suitability` | admin | Not required |
| `wp1.irrigation_statistics` | admin | Not required |
| `wp1.land_parcels` | admin | Not required |
| `content.resources` | admin | Not required |
| `content.resource_versions` | admin | Not required |
| `content.resource_areas` | admin | Not required |
| `content.policies` | admin | Not required |
| `content.policy_versions` | admin | Not required |
| `content.policy_areas` | admin | Not required |
| `project.partners` | profile | Project version UUID |
| `project.land_uses` | profile | Project version UUID |
| `project.designs` | profile | Project version UUID |
| `project.grid_connections` | profile | Project version UUID |
| `project.crop_plans` | profile | Project version UUID |
| `project.profile_notes` | profile | Project version UUID |
| `project.documents` | profile | Project version UUID |
| `plan.methods` | admin | Not required |
| `plan.method_versions` | admin | Not required |
| `plan.criteria` | admin | Not required |
| `mon.periods` | admin | Not required |
| `mon.indicators` | admin | Not required |
| `mon.indicator_versions` | admin | Not required |
| `mon.form_versions` | admin | Not required |
| `mon.form_fields` | admin | Not required |
| `mon.obligations` | project | Project UUID |
| `mon.energy_records` | submission | Submission revision UUID |
| `mon.baselines` | project | Project UUID |
| `mon.harvest_records` | submission | Submission revision UUID |
| `mon.beneficiaries` | admin | Not required |
| `mon.project_beneficiaries` | project | Project UUID |
| `mon.participation_records` | submission | Submission revision UUID |
| `mon.inclusion_totals` | submission | Submission revision UUID |
| `mon.income_records` | submission | Submission revision UUID |
| `mon.land_records` | submission | Submission revision UUID |
| `mon.practice_records` | submission | Submission revision UUID |
| `mon.scheme_linkages` | submission | Submission revision UUID |
| `mon.progress_records` | submission | Submission revision UUID |
| `mon.evidence` | submission | Submission revision UUID |

The checked-in OpenAPI file contains exact writable columns and required fields for each resource. SQL constraints enforce units/ranges/references. State and approval fields are controlled by workflow endpoints.

68 allowlisted resources; 82 explicit workflow/public routes. This is not arbitrary SQL/table access.
