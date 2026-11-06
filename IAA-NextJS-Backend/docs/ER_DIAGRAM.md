# Database ER diagram

Generated from [relationship-model.json](./relationship-model.json): 116 tables and 260 foreign-key relationships.

The model calls the authentication schema `auth`; this diagram uses `iaa_auth`, as created by the database migrations. Field types are abbreviated to their first SQL type token for Mermaid compatibility. PK, FK and unique fields are marked where defined by the model.

```mermaid
erDiagram
  CORE_ORGANISATIONS {
    uuid id PK
    text code UK
    text name
    text organisation_type
    uuid parent_id FK
    boolean is_active
    timestamptz created_at
  }
  IAA_AUTH_USERS {
    uuid id PK
    text identity_subject UK
    uuid organisation_id FK
    text display_name
    text email
    boolean is_active
    timestamptz created_at
  }
  IAA_AUTH_ROLES {
    uuid id PK
    text code UK
    text name
    timestamptz created_at
  }
  IAA_AUTH_PERMISSIONS {
    uuid id PK
    text code UK
    text description
    timestamptz created_at
  }
  IAA_AUTH_ROLE_PERMISSIONS {
    uuid id PK
    uuid role_id FK
    uuid permission_id FK
    timestamptz created_at
  }
  IAA_AUTH_USER_ROLES {
    uuid id PK
    uuid user_id FK
    uuid role_id FK
    uuid organisation_id FK
    timestamptz expires_at
    timestamptz created_at
  }
  CORE_UNITS {
    uuid id PK
    text code UK
    text name
    text dimension
    numeric canonical_factor
    jsonb context
    timestamptz created_at
  }
  CORE_SEASONS {
    uuid id PK
    text code UK
    text name
    boolean is_total
    timestamptz created_at
  }
  CORE_CROPS {
    uuid id PK
    text code UK
    text name
    text category
    boolean is_aggregate
    uuid parent_id FK
    timestamptz created_at
  }
  CORE_MODELS {
    uuid id PK
    text code UK
    text name
    text kind
    text description
    timestamptz created_at
  }
  CORE_PRACTICES {
    uuid id PK
    text code UK
    text name
    text category
    timestamptz created_at
  }
  CORE_LOCALES {
    uuid id PK
    text code UK
    text name
    boolean is_enabled
    timestamptz created_at
  }
  CORE_TRANSLATIONS {
    uuid id PK
    uuid locale_id FK
    text translation_key
    text translated_text
    timestamptz created_at
  }
  GEO_AREAS {
    uuid id PK
    text code_system
    text code
    text name
    text level
    uuid parent_id FK
    date valid_from
    date valid_to
    timestamptz created_at
  }
  GEO_ALIASES {
    uuid id PK
    uuid area_id FK
    text source_namespace
    text source_state
    text source_name
    date valid_from
    date valid_to
    text match_method
    uuid reviewed_by FK
    timestamptz created_at
  }
  GEO_AREA_CROSSWALKS {
    uuid id PK
    uuid from_area_id FK
    uuid to_area_id FK
    text relationship
    numeric weight
    text method_reference
    uuid approved_by FK
    timestamptz created_at
  }
  DATA_SOURCES {
    uuid id PK
    uuid organisation_id FK
    text name
    text source_uri
    text licence
    text rights_notes
    text contact_reference
    timestamptz created_at
  }
  DATA_DATASETS {
    uuid id PK
    uuid source_id FK
    text code UK
    text title
    smallint domain_no
    text update_frequency
    text spatial_resolution
    boolean is_active
    timestamptz created_at
  }
  DATA_FILES {
    uuid id PK
    text object_key UK
    text original_name
    text mime_type
    bigint byte_size
    text sha256
    uuid uploaded_by FK
    text scan_status
    text access_class
    timestamptz captured_at
    geometry location
    timestamptz created_at
  }
  DATA_DATASET_VERSIONS {
    uuid id PK
    uuid dataset_id FK
    uuid file_id FK
    text version_label
    timestamptz received_at
    date reference_start
    date reference_end
    text source_crs
    text source_units
    text coverage_notes
    text limitations
    text status
    boolean is_demo
    boolean is_current
    boolean public_allowed
    boolean planning_allowed
    boolean export_allowed
    uuid approved_by FK
    timestamptz approved_at
    uuid supersedes_id FK
    timestamptz created_at
  }
  DATA_COVERAGE {
    uuid id PK
    uuid dataset_id FK
    uuid area_id FK
    uuid version_id FK
    text coverage_status
    text required_resolution
    text notes
    timestamptz created_at
  }
  DATA_DATASET_GRANTS {
    uuid id PK
    uuid dataset_id FK
    uuid organisation_id FK
    boolean can_read
    boolean can_import
    boolean can_export
    timestamptz created_at
  }
  DATA_IMPORT_JOBS {
    uuid id PK
    uuid version_id FK
    uuid started_by FK
    text status
    text parser_version
    jsonb mapping
    text idempotency_key UK
    timestamptz finished_at
    jsonb row_counts
    timestamptz created_at
  }
  DATA_SOURCE_RECORDS {
    uuid id PK
    uuid import_job_id FK
    text sheet_name
    integer row_number
    text source_key
    jsonb raw_cells
    jsonb normalised_payload
    text status
    timestamptz created_at
  }
  DATA_QUALITY_ISSUES {
    uuid id PK
    uuid source_record_id FK
    text field_name
    text issue_code
    text severity
    text message
    uuid resolved_by FK
    timestamptz resolved_at
    text resolution
    timestamptz created_at
  }
  DATA_COLLECTION_TASKS {
    uuid id PK
    uuid area_id FK
    uuid provider_id FK
    uuid owner_id FK
    uuid dataset_id FK
    text requested_data
    text status
    date due_date
    text notes
    timestamptz created_at
  }
  GEO_BOUNDARIES {
    uuid id PK
    uuid area_id FK
    uuid dataset_version_id FK
    date valid_from
    date valid_to
    geometry geom
    timestamptz created_at
  }
  GEO_LAYERS {
    uuid id PK
    uuid dataset_version_id FK
    uuid file_id FK
    text code
    text name
    text layer_type
    text geometry_type
    jsonb style
    jsonb legend
    text tile_service_reference
    timestamptz created_at
  }
  GEO_FEATURES {
    uuid id PK
    uuid layer_id FK
    uuid source_record_id FK
    text source_feature_key
    geometry geom
    jsonb attributes
    timestamptz created_at
  }
  GEO_GEOCODING_REVIEWS {
    uuid id PK
    uuid source_record_id FK
    text provider
    text query_text
    geometry candidate_point
    text accuracy_class
    numeric confidence
    text status
    uuid reviewed_by FK
    timestamptz reviewed_at
    timestamptz created_at
  }
  WP1_LAND_STATISTICS {
    uuid id PK
    uuid dataset_version_id FK
    uuid source_record_id FK
    uuid area_id FK
    uuid unit_id FK
    text source_state
    text source_district
    text agricultural_year
    text row_kind
    numeric reporting_area
    numeric forest_area
    numeric non_agricultural_area
    numeric barren_area
    numeric non_cultivable_total
    numeric pasture_area
    numeric tree_crop_area
    numeric culturable_waste_area
    numeric other_uncultivated_total
    numeric other_fallow_area
    numeric current_fallow_area
    numeric fallow_total
    numeric net_sown_area
    numeric gross_cropped_area
    numeric multi_sown_area
    timestamptz created_at
  }
  WP1_CROP_PRODUCTION {
    uuid id PK
    uuid dataset_version_id FK
    uuid source_record_id FK
    uuid area_id FK
    uuid crop_id FK
    uuid season_id FK
    uuid unit_id FK
    text agricultural_year
    numeric production
    text source_value
    text value_status
    integer source_page
    integer source_crop_number
    jsonb unit_context
    text notes
    timestamptz created_at
  }
  WP1_FACILITIES {
    uuid id PK
    text code UK
    text facility_type
    text name
    uuid operator_id FK
    timestamptz created_at
  }
  WP1_FACILITY_VERSIONS {
    uuid id PK
    uuid dataset_version_id FK
    uuid source_record_id FK
    uuid facility_id FK
    uuid area_id FK
    uuid geocode_review_id FK
    uuid capacity_unit_id FK
    text source_state
    text source_district
    text city
    text address
    geometry point
    text location_accuracy
    integer established_year
    text source_area_text
    numeric area_ha
    numeric capacity_value
    text operational_status
    date as_of_date
    timestamptz created_at
  }
  WP1_COLD_CHAIN_PROJECTS {
    uuid id PK
    uuid dataset_version_id FK
    uuid source_record_id FK
    text source_serial
    text project_name
    text phase
    uuid agency_id FK
    text sector
    uuid area_id FK
    text source_state
    text source_district
    date approval_date
    numeric202 project_cost_inr
    numeric202 approved_grant_inr
    numeric202 released_grant_inr
    text status
    timestamptz created_at
  }
  WP1_COLD_CHAIN_FACILITIES {
    uuid id PK
    uuid cold_chain_project_id FK
    uuid facility_id FK
    text verification_note
    timestamptz created_at
  }
  WP1_SUBSTATIONS {
    uuid id PK
    text code UK
    text name
    uuid discom_id FK
    timestamptz created_at
  }
  WP1_SUBSTATION_VERSIONS {
    uuid id PK
    uuid dataset_version_id FK
    uuid source_record_id FK
    uuid substation_id FK
    uuid area_id FK
    geometry point
    numeric high_voltage_kv
    numeric low_voltage_kv
    numeric capacity_mva
    numeric loading_pct
    timestamptz observed_at
    timestamptz created_at
  }
  WP1_FEEDERS {
    uuid id PK
    uuid discom_id FK
    text source_code
    text name
    timestamptz created_at
  }
  WP1_FEEDER_VERSIONS {
    uuid id PK
    uuid dataset_version_id FK
    uuid source_record_id FK
    uuid feeder_id FK
    uuid substation_id FK
    uuid area_id FK
    geometry point
    geometry line_geom
    numeric voltage_kv
    numeric sanctioned_mw
    numeric peak_load_mw
    numeric approved_hosting_mw
    numeric saidi_minutes
    numeric saifi_count
    date reference_start
    date reference_end
    numeric outage_threshold_minutes
    text method_reference
    timestamptz created_at
  }
  WP1_FEEDER_LOAD_READINGS {
    uuid id PK
    uuid dataset_version_id FK
    uuid source_record_id FK
    uuid feeder_id FK
    timestamptz observed_at
    numeric load_mw
    text quality_flag
    integer interval_minutes
    timestamptz created_at
  }
  WP1_SOLAR_INSTALLATIONS {
    uuid id PK
    text code UK
    text name
    text installation_type
    uuid owner_id FK
    timestamptz created_at
  }
  WP1_SOLAR_INSTALLATION_VERSIONS {
    uuid id PK
    uuid dataset_version_id FK
    uuid source_record_id FK
    uuid installation_id FK
    uuid area_id FK
    geometry point
    geometry footprint
    numeric capacity_dc_mwp
    numeric capacity_ac_mw
    numeric clearance_m
    numeric row_pitch_m
    text layout_type
    text land_rights_status
    text operational_status
    date as_of_date
    timestamptz created_at
  }
  WP1_ENVIRONMENT_OBSERVATIONS {
    uuid id PK
    uuid dataset_version_id FK
    uuid source_record_id FK
    uuid area_id FK
    uuid unit_id FK
    text metric_code
    text category_code
    date period_start
    date period_end
    numeric value
    text value_status
    text resolution
    text method_reference
    geometry point
    timestamptz created_at
  }
  WP1_AGRO_ZONES {
    uuid id PK
    uuid dataset_version_id FK
    uuid source_record_id FK
    text code
    text name
    geometry geom
    text rainfall_band
    text temperature_band
    text notes
    timestamptz created_at
  }
  WP1_CROP_SUITABILITY {
    uuid id PK
    uuid dataset_version_id FK
    uuid source_record_id FK
    uuid crop_id FK
    uuid season_id FK
    uuid zone_id FK
    numeric shade_tolerance_pct
    numeric minimum_dli
    integer growth_days
    text sowing_window
    text harvest_window
    text irrigation_requirement
    text method_reference
    timestamptz created_at
  }
  WP1_IRRIGATION_STATISTICS {
    uuid id PK
    uuid dataset_version_id FK
    uuid source_record_id FK
    uuid area_id FK
    uuid unit_id FK
    text period_label
    text water_source
    text irrigation_method
    numeric value
    timestamptz created_at
  }
  WP1_LAND_PARCELS {
    uuid id PK
    uuid dataset_version_id FK
    uuid source_record_id FK
    uuid area_id FK
    text source_parcel_key
    geometry geom
    numeric area_ha
    text land_use
    numeric slope_degrees
    text soil_type
    text rights_status
    jsonb constraints
    timestamptz created_at
  }
  CONTENT_RESOURCES {
    uuid id PK
    text code UK
    text resource_type
    text theme
    timestamptz created_at
  }
  CONTENT_RESOURCE_VERSIONS {
    uuid id PK
    uuid dataset_version_id FK
    uuid source_record_id FK
    uuid resource_id FK
    uuid locale_id FK
    uuid file_id FK
    text title
    text body
    text external_uri
    date published_date
    timestamptz created_at
  }
  CONTENT_RESOURCE_AREAS {
    uuid id PK
    uuid resource_id FK
    uuid area_id FK
    timestamptz created_at
  }
  CONTENT_POLICIES {
    uuid id PK
    text code UK
    text name
    text kind
    uuid issuer_id FK
    timestamptz created_at
  }
  CONTENT_POLICY_VERSIONS {
    uuid id PK
    uuid dataset_version_id FK
    uuid source_record_id FK
    uuid policy_id FK
    uuid file_id FK
    date effective_from
    date effective_to
    text status
    jsonb eligibility
    jsonb benefits
    text summary
    date review_due
    timestamptz created_at
  }
  CONTENT_POLICY_AREAS {
    uuid id PK
    uuid policy_version_id FK
    uuid area_id FK
    geometry zone_geom
    timestamptz created_at
  }
  CONTENT_QUERIES {
    uuid id PK
    uuid asked_by FK
    uuid area_id FK
    text question
    text bottleneck_category
    text status
    uuid assigned_to FK
    timestamptz created_at
  }
  CONTENT_QUERY_RESPONSES {
    uuid id PK
    uuid query_id FK
    uuid author_id FK
    uuid resource_id FK
    text answer
    timestamptz created_at
  }
  PROJECT_PROJECTS {
    uuid id PK
    text code UK
    uuid owner_organisation_id FK
    uuid created_by FK
    boolean is_demo
    timestamptz archived_at
    timestamptz created_at
  }
  PROJECT_VERSIONS {
    uuid id PK
    uuid project_id FK
    uuid area_id FK
    uuid model_id FK
    uuid typology_id FK
    uuid ownership_model_id FK
    uuid land_ownership_model_id FK
    integer revision
    text name
    text status
    geometry point
    geometry footprint
    date commissioned_on
    numeric capacity_dc_mwp
    numeric capacity_ac_mw
    numeric storage_mwh
    numeric site_area_ha
    numeric cultivated_area_ha
    numeric agripv_footprint_ha
    text objective
    text summary
    date effective_from
    date effective_to
    text review_status
    uuid approved_by FK
    timestamptz approved_at
    uuid supersedes_id FK
    timestamptz created_at
  }
  PROJECT_MEMBERSHIPS {
    uuid id PK
    uuid project_id FK
    uuid user_id FK
    uuid role_id FK
    timestamptz valid_until
    timestamptz created_at
  }
  PROJECT_PARTNERS {
    uuid id PK
    uuid project_version_id FK
    uuid organisation_id FK
    text partner_role
    timestamptz created_at
  }
  PROJECT_CONTACTS {
    uuid id PK
    uuid project_id FK
    text contact_role
    bytea name_ciphertext
    bytea contact_ciphertext
    text key_reference
    text consent_reference
    timestamptz created_at
  }
  PROJECT_LAND_USES {
    uuid id PK
    uuid project_version_id FK
    text use_code
    numeric area_ha
    text overlap_group
    text notes
    timestamptz created_at
  }
  PROJECT_DESIGNS {
    uuid id PK
    uuid project_version_id FK
    text array_code
    text module_technology
    numeric module_power_wp
    integer module_count
    numeric module_width_m
    numeric module_length_m
    numeric transparency_pct
    text mounting_type
    numeric clearance_m
    numeric row_pitch_m
    numeric column_spacing_m
    numeric tilt_degrees
    numeric azimuth_degrees
    text tracking_type
    text tracking_manufacturer
    text piling_type
    text piling_material
    timestamptz created_at
  }
  PROJECT_GRID_CONNECTIONS {
    uuid id PK
    uuid project_version_id FK
    uuid feeder_id FK
    uuid substation_id FK
    uuid discom_id FK
    text connection_code
    numeric voltage_kv
    numeric export_limit_mw
    text metering_policy
    numeric tariff_inr_kwh
    text tariff_category
    date valid_from
    date valid_to
    numeric substation_distance_km
    text distance_method
    uuid approval_file_id FK
    timestamptz created_at
  }
  PROJECT_CROP_PLANS {
    uuid id PK
    uuid project_version_id FK
    uuid crop_id FK
    uuid season_id FK
    text plot_code
    text agricultural_year
    numeric area_ha
    date sowing_date
    date harvest_date
    text water_source
    text irrigation_method
    text selection_rationale
    timestamptz created_at
  }
  PROJECT_PROFILE_NOTES {
    uuid id PK
    uuid project_version_id FK
    text field_code
    text section_code
    text narrative
    text visibility
    timestamptz created_at
  }
  PROJECT_DOCUMENTS {
    uuid id PK
    uuid project_version_id FK
    uuid file_id FK
    text category
    text caption
    boolean public_allowed
    timestamptz created_at
  }
  PROJECT_PUBLICATIONS {
    uuid id PK
    uuid project_version_id FK
    uuid approved_by FK
    timestamptz approved_at
    jsonb public_fields
    timestamptz released_at
    timestamptz revoked_at
    text release_reason
    timestamptz created_at
  }
  PLAN_METHODS {
    uuid id PK
    text code UK
    text name
    text function_code
    timestamptz created_at
  }
  PLAN_METHOD_VERSIONS {
    uuid id PK
    uuid method_id FK
    text version_label
    jsonb configuration
    text code_digest
    text status
    uuid approved_by FK
    timestamptz approved_at
    text limitations
    timestamptz created_at
  }
  PLAN_CRITERIA {
    uuid id PK
    uuid method_version_id FK
    uuid unit_id FK
    text code
    numeric weight
    jsonb normalisation
    jsonb exclusion_rule
    text missing_action
    timestamptz created_at
  }
  PLAN_ASSESSMENTS {
    uuid id PK
    uuid created_by FK
    uuid area_id FK
    uuid project_id FK
    uuid solar_installation_id FK
    text name
    geometry point
    geometry site_geom
    text access_token_hash
    timestamptz expires_at
    timestamptz created_at
  }
  PLAN_SCENARIOS {
    uuid id PK
    uuid assessment_id FK
    text name
    integer revision
    jsonb parameters
    text input_hash
    timestamptz updated_at
    timestamptz created_at
  }
  PLAN_RUNS {
    uuid id PK
    uuid scenario_id FK
    integer scenario_revision
    jsonb input_snapshot
    text input_hash
    text engine_version
    text status
    boolean is_demo
    timestamptz started_at
    timestamptz finished_at
    text failure_detail
    text idempotency_key UK
    timestamptz created_at
  }
  PLAN_RUN_DATASETS {
    uuid id PK
    uuid run_id FK
    uuid dataset_version_id FK
    text usage_role
    timestamptz created_at
  }
  PLAN_RUN_METHODS {
    uuid id PK
    uuid run_id FK
    uuid method_version_id FK
    text function_code
    timestamptz created_at
  }
  PLAN_RESULTS {
    uuid id PK
    uuid run_id FK
    uuid method_version_id FK
    text function_code
    text status
    numeric score
    text classification
    jsonb result
    text explanation
    timestamptz created_at
  }
  PLAN_CRITERION_RESULTS {
    uuid id PK
    uuid run_id FK
    uuid criterion_id FK
    uuid source_record_id FK
    numeric raw_value
    numeric normalised_value
    numeric weight_used
    numeric contribution
    text status
    text reason
    timestamptz created_at
  }
  PLAN_GAPS {
    uuid id PK
    uuid run_id FK
    uuid dataset_id FK
    text function_code
    text severity
    text reason
    text required_action
    timestamptz created_at
  }
  PLAN_MARKET_RESULTS {
    uuid id PK
    uuid run_id FK
    uuid facility_version_id FK
    text distance_method
    numeric distance_km
    numeric travel_minutes
    text routing_source_version
    timestamptz created_at
  }
  PLAN_MODEL_RESULTS {
    uuid id PK
    uuid run_id FK
    uuid model_id FK
    uuid crop_id FK
    integer rank
    text fit_status
    text explanation
    timestamptz created_at
  }
  PLAN_SCHEME_RESULTS {
    uuid id PK
    uuid run_id FK
    uuid policy_version_id FK
    text match_status
    jsonb unverified_conditions
    text explanation
    timestamptz created_at
  }
  PLAN_RETROFIT_CHECKS {
    uuid id PK
    uuid run_id FK
    text check_code
    text status
    jsonb input_value
    text explanation
    timestamptz created_at
  }
  PLAN_SHADING_RUNS {
    uuid id PK
    uuid run_id FK
    uuid method_version_id FK
    jsonb array_parameters
    text time_basis
    uuid resource_dataset_version_id FK
    jsonb output
    text limitations
    timestamptz created_at
  }
  PLAN_REPORTS {
    uuid id PK
    uuid run_id FK
    uuid file_id FK
    uuid locale_id FK
    text template_version
    timestamptz generated_at
    text access_class
    timestamptz created_at
  }
  PLAN_PROJECT_HANDOFFS {
    uuid id PK
    uuid assessment_id FK
    uuid run_id FK
    uuid project_id FK
    uuid approved_by FK
    timestamptz approved_at
    timestamptz created_at
  }
  MON_PERIODS {
    uuid id PK
    uuid season_id FK
    text code UK
    text kind
    date start_date
    date end_date
    text calendar_basis
    timestamptz created_at
  }
  MON_INDICATORS {
    uuid id PK
    text code UK
    text name
    text domain
    text aggregation
    timestamptz created_at
  }
  MON_INDICATOR_VERSIONS {
    uuid id PK
    uuid indicator_id FK
    uuid unit_id FK
    uuid method_version_id FK
    integer version
    text value_type
    jsonb validation
    text frequency
    boolean is_sensitive
    uuid approved_by FK
    timestamptz approved_at
    timestamptz created_at
  }
  MON_FORM_VERSIONS {
    uuid id PK
    text code
    integer version
    text name
    text status
    uuid approved_by FK
    timestamptz approved_at
    timestamptz created_at
  }
  MON_FORM_FIELDS {
    uuid id PK
    uuid form_version_id FK
    uuid indicator_version_id FK
    text section_code
    text field_code
    integer sort_order
    boolean required
    text repeat_group
    jsonb visibility_rule
    text label_key
    timestamptz created_at
  }
  MON_OBLIGATIONS {
    uuid id PK
    uuid project_id FK
    uuid period_id FK
    uuid form_version_id FK
    uuid assigned_to FK
    text reporting_stream
    timestamptz due_at
    timestamptz waived_at
    text waiver_reason
    timestamptz created_at
  }
  MON_SUBMISSIONS {
    uuid id PK
    uuid obligation_id FK
    uuid project_id FK
    uuid created_by FK
    timestamptz created_at
  }
  MON_SUBMISSION_VERSIONS {
    uuid id PK
    uuid submission_id FK
    uuid project_id FK
    uuid project_version_id FK
    uuid submitted_by FK
    integer revision
    text status
    timestamptz submitted_at
    text payload_hash
    text validation_status
    uuid approved_by FK
    timestamptz approved_at
    uuid supersedes_id FK
    text declaration
    text note
    timestamptz created_at
  }
  MON_INDICATOR_VALUES {
    uuid id PK
    uuid submission_version_id FK
    uuid indicator_version_id FK
    text repeat_key
    numeric value_number
    text value_text
    boolean value_boolean
    date value_date
    jsonb value_json
    text missing_reason
    timestamptz created_at
  }
  MON_ENERGY_RECORDS {
    uuid id PK
    uuid submission_version_id FK
    text segment_code
    timestamptz start_at
    timestamptz end_at
    numeric generation_mwh
    numeric export_mwh
    numeric onsite_mwh
    numeric capacity_dc_mwp
    numeric capacity_ac_mw
    numeric operational_hours
    numeric reference_hours
    text meter_reference
    timestamptz created_at
  }
  MON_BASELINES {
    uuid id PK
    uuid project_id FK
    uuid crop_id FK
    uuid period_id FK
    uuid source_file_id FK
    uuid dataset_version_id FK
    uuid method_version_id FK
    text plot_code
    text baseline_type
    numeric yield_t_ha
    numeric area_ha
    text source_reference
    text comparability_notes
    timestamptz created_at
  }
  MON_HARVEST_RECORDS {
    uuid id PK
    uuid submission_version_id FK
    uuid crop_id FK
    uuid season_id FK
    uuid baseline_id FK
    text plot_code
    date harvest_date
    numeric cultivated_area_ha
    numeric production_t
    numeric water_m3
    numeric202 cultivation_cost_inr
    text crop_failure_note
    timestamptz created_at
  }
  MON_BENEFICIARIES {
    uuid id PK
    uuid organisation_id FK
    text pseudonym
    text gender
    integer birth_year
    text household_code
    text consent_reference
    timestamptz retired_at
    timestamptz created_at
  }
  MON_BENEFICIARY_PRIVATE {
    uuid id PK
    uuid beneficiary_id FK
    bytea pii_ciphertext
    text key_reference
    date retention_until
    timestamptz created_at
  }
  MON_PROJECT_BENEFICIARIES {
    uuid id PK
    uuid project_id FK
    uuid beneficiary_id FK
    text role
    date start_date
    date end_date
    numeric land_area_ha
    timestamptz created_at
  }
  MON_PARTICIPATION_RECORDS {
    uuid id PK
    uuid submission_version_id FK
    uuid beneficiary_id FK
    text role
    text gender_at_period
    integer age_at_period
    boolean is_youth
    numeric participation_days
    text job_phase
    timestamptz created_at
  }
  MON_INCLUSION_TOTALS {
    uuid id PK
    uuid submission_version_id FK
    text population_code
    integer women
    integer men
    integer other_gender
    integer gender_unknown
    integer youth
    integer households
    text count_basis
    timestamptz created_at
  }
  MON_INCOME_RECORDS {
    uuid id PK
    uuid submission_version_id FK
    text scope_kind
    text scope_key
    text component
    numeric202 amount_inr
    text accounting_basis
    text source_reference
    timestamptz created_at
  }
  MON_LAND_RECORDS {
    uuid id PK
    uuid submission_version_id FK
    text plot_code
    numeric site_area_ha
    numeric solar_area_ha
    numeric cultivated_area_ha
    numeric water_used_m3
    text notes
    timestamptz created_at
  }
  MON_PRACTICE_RECORDS {
    uuid id PK
    uuid submission_version_id FK
    uuid practice_id FK
    text plot_code
    text adoption_status
    numeric measured_value
    uuid unit_id FK
    text notes
    timestamptz created_at
  }
  MON_SCHEME_LINKAGES {
    uuid id PK
    uuid submission_version_id FK
    uuid policy_version_id FK
    text reference_number
    text status
    numeric202 benefit_inr
    integer beneficiaries_count
    timestamptz created_at
  }
  MON_PROGRESS_RECORDS {
    uuid id PK
    uuid submission_version_id FK
    text milestone_code
    date planned_date
    date actual_date
    numeric completion_pct
    text status
    text note
    timestamptz created_at
  }
  MON_EVIDENCE {
    uuid id PK
    uuid submission_version_id FK
    uuid file_id FK
    uuid indicator_version_id FK
    text record_path
    text category
    text caption
    timestamptz created_at
  }
  MON_VALIDATION_RESULTS {
    uuid id PK
    uuid submission_version_id FK
    text rule_code
    text rule_version
    text payload_hash
    text severity
    boolean passed
    text message
    text field_path
    timestamptz created_at
  }
  MON_REVIEW_EVENTS {
    uuid id PK
    uuid submission_version_id FK
    uuid actor_id FK
    text action
    text reason
    jsonb field_comments
    timestamptz created_at
  }
  MON_CALCULATED_METRICS {
    uuid id PK
    uuid submission_version_id FK
    uuid indicator_version_id FK
    uuid method_version_id FK
    text result_key
    numeric value
    numeric numerator
    numeric denominator
    text input_hash
    text status
    text explanation
    timestamptz created_at
  }
  MON_RELEASES {
    uuid id PK
    uuid submission_version_id FK
    uuid approved_by FK
    text audience
    jsonb field_whitelist
    text privacy_rule_version
    timestamptz released_at
    timestamptz revoked_at
    text reason
    timestamptz created_at
  }
  OPS_AUDIT_EVENTS {
    uuid id PK
    uuid actor_id FK
    text action
    text target_table
    uuid target_id
    text request_id
    jsonb redacted_change
    timestamptz occurred_at
    timestamptz created_at
  }
  OPS_NOTIFICATIONS {
    uuid id PK
    uuid recipient_id FK
    uuid obligation_id FK
    text channel
    text template_code
    jsonb payload
    timestamptz scheduled_at
    timestamptz sent_at
    text status
    text dedupe_key UK
    integer attempt_count
    timestamptz created_at
  }
  OPS_JOBS {
    uuid id PK
    text kind
    text idempotency_key UK
    jsonb payload
    text status
    integer attempt_count
    timestamptz locked_until
    timestamptz finished_at
    text error_code
    timestamptz created_at
  }
  CORE_ORGANISATIONS o|--o{ CORE_ORGANISATIONS : "parent_id"
  CORE_ORGANISATIONS o|--o{ IAA_AUTH_USERS : "organisation_id"
  IAA_AUTH_ROLES ||--o{ IAA_AUTH_ROLE_PERMISSIONS : "role_id"
  IAA_AUTH_PERMISSIONS ||--o{ IAA_AUTH_ROLE_PERMISSIONS : "permission_id"
  IAA_AUTH_USERS ||--o{ IAA_AUTH_USER_ROLES : "user_id"
  IAA_AUTH_ROLES ||--o{ IAA_AUTH_USER_ROLES : "role_id"
  CORE_ORGANISATIONS o|--o{ IAA_AUTH_USER_ROLES : "organisation_id"
  CORE_CROPS o|--o{ CORE_CROPS : "parent_id"
  CORE_LOCALES ||--o{ CORE_TRANSLATIONS : "locale_id"
  GEO_AREAS o|--o{ GEO_AREAS : "parent_id"
  GEO_AREAS ||--o{ GEO_ALIASES : "area_id"
  IAA_AUTH_USERS o|--o{ GEO_ALIASES : "reviewed_by"
  GEO_AREAS ||--o{ GEO_AREA_CROSSWALKS : "from_area_id"
  GEO_AREAS ||--o{ GEO_AREA_CROSSWALKS : "to_area_id"
  IAA_AUTH_USERS o|--o{ GEO_AREA_CROSSWALKS : "approved_by"
  CORE_ORGANISATIONS o|--o{ DATA_SOURCES : "organisation_id"
  DATA_SOURCES ||--o{ DATA_DATASETS : "source_id"
  IAA_AUTH_USERS o|--o{ DATA_FILES : "uploaded_by"
  DATA_DATASETS ||--o{ DATA_DATASET_VERSIONS : "dataset_id"
  DATA_FILES o|--o{ DATA_DATASET_VERSIONS : "file_id"
  IAA_AUTH_USERS o|--o{ DATA_DATASET_VERSIONS : "approved_by"
  DATA_DATASET_VERSIONS o|--o{ DATA_DATASET_VERSIONS : "supersedes_id"
  DATA_DATASETS ||--o{ DATA_COVERAGE : "dataset_id"
  GEO_AREAS ||--o{ DATA_COVERAGE : "area_id"
  DATA_DATASET_VERSIONS o|--o{ DATA_COVERAGE : "version_id"
  DATA_DATASETS ||--o{ DATA_DATASET_GRANTS : "dataset_id"
  CORE_ORGANISATIONS ||--o{ DATA_DATASET_GRANTS : "organisation_id"
  DATA_DATASET_VERSIONS ||--o{ DATA_IMPORT_JOBS : "version_id"
  IAA_AUTH_USERS ||--o{ DATA_IMPORT_JOBS : "started_by"
  DATA_IMPORT_JOBS ||--o{ DATA_SOURCE_RECORDS : "import_job_id"
  DATA_SOURCE_RECORDS ||--o{ DATA_QUALITY_ISSUES : "source_record_id"
  IAA_AUTH_USERS o|--o{ DATA_QUALITY_ISSUES : "resolved_by"
  GEO_AREAS ||--o{ DATA_COLLECTION_TASKS : "area_id"
  CORE_ORGANISATIONS o|--o{ DATA_COLLECTION_TASKS : "provider_id"
  CORE_ORGANISATIONS o|--o{ DATA_COLLECTION_TASKS : "owner_id"
  DATA_DATASETS o|--o{ DATA_COLLECTION_TASKS : "dataset_id"
  GEO_AREAS ||--o{ GEO_BOUNDARIES : "area_id"
  DATA_DATASET_VERSIONS ||--o{ GEO_BOUNDARIES : "dataset_version_id"
  DATA_DATASET_VERSIONS ||--o{ GEO_LAYERS : "dataset_version_id"
  DATA_FILES o|--o{ GEO_LAYERS : "file_id"
  GEO_LAYERS ||--o{ GEO_FEATURES : "layer_id"
  DATA_SOURCE_RECORDS o|--o{ GEO_FEATURES : "source_record_id"
  DATA_SOURCE_RECORDS ||--o{ GEO_GEOCODING_REVIEWS : "source_record_id"
  IAA_AUTH_USERS o|--o{ GEO_GEOCODING_REVIEWS : "reviewed_by"
  DATA_DATASET_VERSIONS ||--o{ WP1_LAND_STATISTICS : "dataset_version_id"
  DATA_SOURCE_RECORDS o|--o{ WP1_LAND_STATISTICS : "source_record_id"
  GEO_AREAS ||--o{ WP1_LAND_STATISTICS : "area_id"
  CORE_UNITS o|--o{ WP1_LAND_STATISTICS : "unit_id"
  DATA_DATASET_VERSIONS ||--o{ WP1_CROP_PRODUCTION : "dataset_version_id"
  DATA_SOURCE_RECORDS o|--o{ WP1_CROP_PRODUCTION : "source_record_id"
  GEO_AREAS ||--o{ WP1_CROP_PRODUCTION : "area_id"
  CORE_CROPS ||--o{ WP1_CROP_PRODUCTION : "crop_id"
  CORE_SEASONS ||--o{ WP1_CROP_PRODUCTION : "season_id"
  CORE_UNITS ||--o{ WP1_CROP_PRODUCTION : "unit_id"
  CORE_ORGANISATIONS o|--o{ WP1_FACILITIES : "operator_id"
  DATA_DATASET_VERSIONS ||--o{ WP1_FACILITY_VERSIONS : "dataset_version_id"
  DATA_SOURCE_RECORDS o|--o{ WP1_FACILITY_VERSIONS : "source_record_id"
  WP1_FACILITIES ||--o{ WP1_FACILITY_VERSIONS : "facility_id"
  GEO_AREAS o|--o{ WP1_FACILITY_VERSIONS : "area_id"
  GEO_GEOCODING_REVIEWS o|--o{ WP1_FACILITY_VERSIONS : "geocode_review_id"
  CORE_UNITS o|--o{ WP1_FACILITY_VERSIONS : "capacity_unit_id"
  DATA_DATASET_VERSIONS ||--o{ WP1_COLD_CHAIN_PROJECTS : "dataset_version_id"
  DATA_SOURCE_RECORDS o|--o{ WP1_COLD_CHAIN_PROJECTS : "source_record_id"
  CORE_ORGANISATIONS o|--o{ WP1_COLD_CHAIN_PROJECTS : "agency_id"
  GEO_AREAS o|--o{ WP1_COLD_CHAIN_PROJECTS : "area_id"
  WP1_COLD_CHAIN_PROJECTS ||--o{ WP1_COLD_CHAIN_FACILITIES : "cold_chain_project_id"
  WP1_FACILITIES ||--o{ WP1_COLD_CHAIN_FACILITIES : "facility_id"
  CORE_ORGANISATIONS o|--o{ WP1_SUBSTATIONS : "discom_id"
  DATA_DATASET_VERSIONS ||--o{ WP1_SUBSTATION_VERSIONS : "dataset_version_id"
  DATA_SOURCE_RECORDS o|--o{ WP1_SUBSTATION_VERSIONS : "source_record_id"
  WP1_SUBSTATIONS ||--o{ WP1_SUBSTATION_VERSIONS : "substation_id"
  GEO_AREAS ||--o{ WP1_SUBSTATION_VERSIONS : "area_id"
  CORE_ORGANISATIONS ||--o{ WP1_FEEDERS : "discom_id"
  DATA_DATASET_VERSIONS ||--o{ WP1_FEEDER_VERSIONS : "dataset_version_id"
  DATA_SOURCE_RECORDS o|--o{ WP1_FEEDER_VERSIONS : "source_record_id"
  WP1_FEEDERS ||--o{ WP1_FEEDER_VERSIONS : "feeder_id"
  WP1_SUBSTATIONS o|--o{ WP1_FEEDER_VERSIONS : "substation_id"
  GEO_AREAS ||--o{ WP1_FEEDER_VERSIONS : "area_id"
  DATA_DATASET_VERSIONS ||--o{ WP1_FEEDER_LOAD_READINGS : "dataset_version_id"
  DATA_SOURCE_RECORDS o|--o{ WP1_FEEDER_LOAD_READINGS : "source_record_id"
  WP1_FEEDERS ||--o{ WP1_FEEDER_LOAD_READINGS : "feeder_id"
  CORE_ORGANISATIONS o|--o{ WP1_SOLAR_INSTALLATIONS : "owner_id"
  DATA_DATASET_VERSIONS ||--o{ WP1_SOLAR_INSTALLATION_VERSIONS : "dataset_version_id"
  DATA_SOURCE_RECORDS o|--o{ WP1_SOLAR_INSTALLATION_VERSIONS : "source_record_id"
  WP1_SOLAR_INSTALLATIONS ||--o{ WP1_SOLAR_INSTALLATION_VERSIONS : "installation_id"
  GEO_AREAS ||--o{ WP1_SOLAR_INSTALLATION_VERSIONS : "area_id"
  DATA_DATASET_VERSIONS ||--o{ WP1_ENVIRONMENT_OBSERVATIONS : "dataset_version_id"
  DATA_SOURCE_RECORDS o|--o{ WP1_ENVIRONMENT_OBSERVATIONS : "source_record_id"
  GEO_AREAS ||--o{ WP1_ENVIRONMENT_OBSERVATIONS : "area_id"
  CORE_UNITS ||--o{ WP1_ENVIRONMENT_OBSERVATIONS : "unit_id"
  DATA_DATASET_VERSIONS ||--o{ WP1_AGRO_ZONES : "dataset_version_id"
  DATA_SOURCE_RECORDS o|--o{ WP1_AGRO_ZONES : "source_record_id"
  DATA_DATASET_VERSIONS ||--o{ WP1_CROP_SUITABILITY : "dataset_version_id"
  DATA_SOURCE_RECORDS o|--o{ WP1_CROP_SUITABILITY : "source_record_id"
  CORE_CROPS ||--o{ WP1_CROP_SUITABILITY : "crop_id"
  CORE_SEASONS ||--o{ WP1_CROP_SUITABILITY : "season_id"
  WP1_AGRO_ZONES o|--o{ WP1_CROP_SUITABILITY : "zone_id"
  DATA_DATASET_VERSIONS ||--o{ WP1_IRRIGATION_STATISTICS : "dataset_version_id"
  DATA_SOURCE_RECORDS o|--o{ WP1_IRRIGATION_STATISTICS : "source_record_id"
  GEO_AREAS ||--o{ WP1_IRRIGATION_STATISTICS : "area_id"
  CORE_UNITS ||--o{ WP1_IRRIGATION_STATISTICS : "unit_id"
  DATA_DATASET_VERSIONS ||--o{ WP1_LAND_PARCELS : "dataset_version_id"
  DATA_SOURCE_RECORDS o|--o{ WP1_LAND_PARCELS : "source_record_id"
  GEO_AREAS ||--o{ WP1_LAND_PARCELS : "area_id"
  DATA_DATASET_VERSIONS ||--o{ CONTENT_RESOURCE_VERSIONS : "dataset_version_id"
  DATA_SOURCE_RECORDS o|--o{ CONTENT_RESOURCE_VERSIONS : "source_record_id"
  CONTENT_RESOURCES ||--o{ CONTENT_RESOURCE_VERSIONS : "resource_id"
  CORE_LOCALES ||--o{ CONTENT_RESOURCE_VERSIONS : "locale_id"
  DATA_FILES o|--o{ CONTENT_RESOURCE_VERSIONS : "file_id"
  CONTENT_RESOURCES ||--o{ CONTENT_RESOURCE_AREAS : "resource_id"
  GEO_AREAS ||--o{ CONTENT_RESOURCE_AREAS : "area_id"
  CORE_ORGANISATIONS o|--o{ CONTENT_POLICIES : "issuer_id"
  DATA_DATASET_VERSIONS ||--o{ CONTENT_POLICY_VERSIONS : "dataset_version_id"
  DATA_SOURCE_RECORDS o|--o{ CONTENT_POLICY_VERSIONS : "source_record_id"
  CONTENT_POLICIES ||--o{ CONTENT_POLICY_VERSIONS : "policy_id"
  DATA_FILES o|--o{ CONTENT_POLICY_VERSIONS : "file_id"
  CONTENT_POLICY_VERSIONS ||--o{ CONTENT_POLICY_AREAS : "policy_version_id"
  GEO_AREAS ||--o{ CONTENT_POLICY_AREAS : "area_id"
  IAA_AUTH_USERS ||--o{ CONTENT_QUERIES : "asked_by"
  GEO_AREAS o|--o{ CONTENT_QUERIES : "area_id"
  IAA_AUTH_USERS o|--o{ CONTENT_QUERIES : "assigned_to"
  CONTENT_QUERIES ||--o{ CONTENT_QUERY_RESPONSES : "query_id"
  IAA_AUTH_USERS ||--o{ CONTENT_QUERY_RESPONSES : "author_id"
  CONTENT_RESOURCES o|--o{ CONTENT_QUERY_RESPONSES : "resource_id"
  CORE_ORGANISATIONS ||--o{ PROJECT_PROJECTS : "owner_organisation_id"
  IAA_AUTH_USERS ||--o{ PROJECT_PROJECTS : "created_by"
  PROJECT_PROJECTS ||--o{ PROJECT_VERSIONS : "project_id"
  GEO_AREAS ||--o{ PROJECT_VERSIONS : "area_id"
  CORE_MODELS o|--o{ PROJECT_VERSIONS : "model_id"
  CORE_MODELS o|--o{ PROJECT_VERSIONS : "typology_id"
  CORE_MODELS o|--o{ PROJECT_VERSIONS : "ownership_model_id"
  CORE_MODELS o|--o{ PROJECT_VERSIONS : "land_ownership_model_id"
  IAA_AUTH_USERS o|--o{ PROJECT_VERSIONS : "approved_by"
  PROJECT_VERSIONS o|--o{ PROJECT_VERSIONS : "supersedes_id"
  PROJECT_PROJECTS ||--o{ PROJECT_MEMBERSHIPS : "project_id"
  IAA_AUTH_USERS ||--o{ PROJECT_MEMBERSHIPS : "user_id"
  IAA_AUTH_ROLES ||--o{ PROJECT_MEMBERSHIPS : "role_id"
  PROJECT_VERSIONS ||--o{ PROJECT_PARTNERS : "project_version_id"
  CORE_ORGANISATIONS ||--o{ PROJECT_PARTNERS : "organisation_id"
  PROJECT_PROJECTS ||--o{ PROJECT_CONTACTS : "project_id"
  PROJECT_VERSIONS ||--o{ PROJECT_LAND_USES : "project_version_id"
  PROJECT_VERSIONS ||--o{ PROJECT_DESIGNS : "project_version_id"
  PROJECT_VERSIONS ||--o{ PROJECT_GRID_CONNECTIONS : "project_version_id"
  WP1_FEEDERS o|--o{ PROJECT_GRID_CONNECTIONS : "feeder_id"
  WP1_SUBSTATIONS o|--o{ PROJECT_GRID_CONNECTIONS : "substation_id"
  CORE_ORGANISATIONS ||--o{ PROJECT_GRID_CONNECTIONS : "discom_id"
  DATA_FILES o|--o{ PROJECT_GRID_CONNECTIONS : "approval_file_id"
  PROJECT_VERSIONS ||--o{ PROJECT_CROP_PLANS : "project_version_id"
  CORE_CROPS ||--o{ PROJECT_CROP_PLANS : "crop_id"
  CORE_SEASONS ||--o{ PROJECT_CROP_PLANS : "season_id"
  PROJECT_VERSIONS ||--o{ PROJECT_PROFILE_NOTES : "project_version_id"
  PROJECT_VERSIONS ||--o{ PROJECT_DOCUMENTS : "project_version_id"
  DATA_FILES ||--o{ PROJECT_DOCUMENTS : "file_id"
  PROJECT_VERSIONS ||--o{ PROJECT_PUBLICATIONS : "project_version_id"
  IAA_AUTH_USERS ||--o{ PROJECT_PUBLICATIONS : "approved_by"
  PLAN_METHODS ||--o{ PLAN_METHOD_VERSIONS : "method_id"
  IAA_AUTH_USERS o|--o{ PLAN_METHOD_VERSIONS : "approved_by"
  PLAN_METHOD_VERSIONS ||--o{ PLAN_CRITERIA : "method_version_id"
  CORE_UNITS o|--o{ PLAN_CRITERIA : "unit_id"
  IAA_AUTH_USERS o|--o{ PLAN_ASSESSMENTS : "created_by"
  GEO_AREAS ||--o{ PLAN_ASSESSMENTS : "area_id"
  PROJECT_PROJECTS o|--o{ PLAN_ASSESSMENTS : "project_id"
  WP1_SOLAR_INSTALLATIONS o|--o{ PLAN_ASSESSMENTS : "solar_installation_id"
  PLAN_ASSESSMENTS ||--o{ PLAN_SCENARIOS : "assessment_id"
  PLAN_SCENARIOS ||--o{ PLAN_RUNS : "scenario_id"
  PLAN_RUNS ||--o{ PLAN_RUN_DATASETS : "run_id"
  DATA_DATASET_VERSIONS ||--o{ PLAN_RUN_DATASETS : "dataset_version_id"
  PLAN_RUNS ||--o{ PLAN_RUN_METHODS : "run_id"
  PLAN_METHOD_VERSIONS ||--o{ PLAN_RUN_METHODS : "method_version_id"
  PLAN_RUNS ||--o{ PLAN_RESULTS : "run_id"
  PLAN_METHOD_VERSIONS ||--o{ PLAN_RESULTS : "method_version_id"
  PLAN_RUNS ||--o{ PLAN_CRITERION_RESULTS : "run_id"
  PLAN_CRITERIA ||--o{ PLAN_CRITERION_RESULTS : "criterion_id"
  DATA_SOURCE_RECORDS o|--o{ PLAN_CRITERION_RESULTS : "source_record_id"
  PLAN_RUNS ||--o{ PLAN_GAPS : "run_id"
  DATA_DATASETS o|--o{ PLAN_GAPS : "dataset_id"
  PLAN_RUNS ||--o{ PLAN_MARKET_RESULTS : "run_id"
  WP1_FACILITY_VERSIONS ||--o{ PLAN_MARKET_RESULTS : "facility_version_id"
  PLAN_RUNS ||--o{ PLAN_MODEL_RESULTS : "run_id"
  CORE_MODELS ||--o{ PLAN_MODEL_RESULTS : "model_id"
  CORE_CROPS o|--o{ PLAN_MODEL_RESULTS : "crop_id"
  PLAN_RUNS ||--o{ PLAN_SCHEME_RESULTS : "run_id"
  CONTENT_POLICY_VERSIONS ||--o{ PLAN_SCHEME_RESULTS : "policy_version_id"
  PLAN_RUNS ||--o{ PLAN_RETROFIT_CHECKS : "run_id"
  PLAN_RUNS ||--o{ PLAN_SHADING_RUNS : "run_id"
  PLAN_METHOD_VERSIONS ||--o{ PLAN_SHADING_RUNS : "method_version_id"
  DATA_DATASET_VERSIONS o|--o{ PLAN_SHADING_RUNS : "resource_dataset_version_id"
  PLAN_RUNS ||--o{ PLAN_REPORTS : "run_id"
  DATA_FILES ||--o{ PLAN_REPORTS : "file_id"
  CORE_LOCALES ||--o{ PLAN_REPORTS : "locale_id"
  PLAN_ASSESSMENTS ||--o{ PLAN_PROJECT_HANDOFFS : "assessment_id"
  PLAN_RUNS ||--o{ PLAN_PROJECT_HANDOFFS : "run_id"
  PROJECT_PROJECTS ||--o{ PLAN_PROJECT_HANDOFFS : "project_id"
  IAA_AUTH_USERS ||--o{ PLAN_PROJECT_HANDOFFS : "approved_by"
  CORE_SEASONS o|--o{ MON_PERIODS : "season_id"
  MON_INDICATORS ||--o{ MON_INDICATOR_VERSIONS : "indicator_id"
  CORE_UNITS o|--o{ MON_INDICATOR_VERSIONS : "unit_id"
  PLAN_METHOD_VERSIONS o|--o{ MON_INDICATOR_VERSIONS : "method_version_id"
  IAA_AUTH_USERS o|--o{ MON_INDICATOR_VERSIONS : "approved_by"
  IAA_AUTH_USERS o|--o{ MON_FORM_VERSIONS : "approved_by"
  MON_FORM_VERSIONS ||--o{ MON_FORM_FIELDS : "form_version_id"
  MON_INDICATOR_VERSIONS ||--o{ MON_FORM_FIELDS : "indicator_version_id"
  PROJECT_PROJECTS ||--o{ MON_OBLIGATIONS : "project_id"
  MON_PERIODS ||--o{ MON_OBLIGATIONS : "period_id"
  MON_FORM_VERSIONS ||--o{ MON_OBLIGATIONS : "form_version_id"
  IAA_AUTH_USERS ||--o{ MON_OBLIGATIONS : "assigned_to"
  MON_OBLIGATIONS ||--o| MON_SUBMISSIONS : "obligation_id"
  PROJECT_PROJECTS ||--o{ MON_SUBMISSIONS : "project_id"
  IAA_AUTH_USERS ||--o{ MON_SUBMISSIONS : "created_by"
  MON_OBLIGATIONS ||--o| MON_SUBMISSIONS : "obligation_id_project_id"
  MON_SUBMISSIONS ||--o{ MON_SUBMISSION_VERSIONS : "submission_id"
  PROJECT_PROJECTS ||--o{ MON_SUBMISSION_VERSIONS : "project_id"
  PROJECT_VERSIONS ||--o{ MON_SUBMISSION_VERSIONS : "project_version_id"
  IAA_AUTH_USERS o|--o{ MON_SUBMISSION_VERSIONS : "submitted_by"
  IAA_AUTH_USERS o|--o{ MON_SUBMISSION_VERSIONS : "approved_by"
  MON_SUBMISSION_VERSIONS o|--o{ MON_SUBMISSION_VERSIONS : "supersedes_id"
  MON_SUBMISSIONS ||--o{ MON_SUBMISSION_VERSIONS : "submission_id_project_id"
  PROJECT_VERSIONS ||--o{ MON_SUBMISSION_VERSIONS : "project_version_id_project_id"
  MON_SUBMISSION_VERSIONS ||--o{ MON_INDICATOR_VALUES : "submission_version_id"
  MON_INDICATOR_VERSIONS ||--o{ MON_INDICATOR_VALUES : "indicator_version_id"
  MON_SUBMISSION_VERSIONS ||--o{ MON_ENERGY_RECORDS : "submission_version_id"
  PROJECT_PROJECTS ||--o{ MON_BASELINES : "project_id"
  CORE_CROPS ||--o{ MON_BASELINES : "crop_id"
  MON_PERIODS ||--o{ MON_BASELINES : "period_id"
  DATA_FILES o|--o{ MON_BASELINES : "source_file_id"
  DATA_DATASET_VERSIONS o|--o{ MON_BASELINES : "dataset_version_id"
  PLAN_METHOD_VERSIONS ||--o{ MON_BASELINES : "method_version_id"
  MON_SUBMISSION_VERSIONS ||--o{ MON_HARVEST_RECORDS : "submission_version_id"
  CORE_CROPS ||--o{ MON_HARVEST_RECORDS : "crop_id"
  CORE_SEASONS ||--o{ MON_HARVEST_RECORDS : "season_id"
  MON_BASELINES o|--o{ MON_HARVEST_RECORDS : "baseline_id"
  CORE_ORGANISATIONS ||--o{ MON_BENEFICIARIES : "organisation_id"
  MON_BENEFICIARIES ||--o| MON_BENEFICIARY_PRIVATE : "beneficiary_id"
  PROJECT_PROJECTS ||--o{ MON_PROJECT_BENEFICIARIES : "project_id"
  MON_BENEFICIARIES ||--o{ MON_PROJECT_BENEFICIARIES : "beneficiary_id"
  MON_SUBMISSION_VERSIONS ||--o{ MON_PARTICIPATION_RECORDS : "submission_version_id"
  MON_BENEFICIARIES ||--o{ MON_PARTICIPATION_RECORDS : "beneficiary_id"
  MON_SUBMISSION_VERSIONS ||--o{ MON_INCLUSION_TOTALS : "submission_version_id"
  MON_SUBMISSION_VERSIONS ||--o{ MON_INCOME_RECORDS : "submission_version_id"
  MON_SUBMISSION_VERSIONS ||--o{ MON_LAND_RECORDS : "submission_version_id"
  MON_SUBMISSION_VERSIONS ||--o{ MON_PRACTICE_RECORDS : "submission_version_id"
  CORE_PRACTICES ||--o{ MON_PRACTICE_RECORDS : "practice_id"
  CORE_UNITS o|--o{ MON_PRACTICE_RECORDS : "unit_id"
  MON_SUBMISSION_VERSIONS ||--o{ MON_SCHEME_LINKAGES : "submission_version_id"
  CONTENT_POLICY_VERSIONS ||--o{ MON_SCHEME_LINKAGES : "policy_version_id"
  MON_SUBMISSION_VERSIONS ||--o{ MON_PROGRESS_RECORDS : "submission_version_id"
  MON_SUBMISSION_VERSIONS ||--o{ MON_EVIDENCE : "submission_version_id"
  DATA_FILES ||--o{ MON_EVIDENCE : "file_id"
  MON_INDICATOR_VERSIONS o|--o{ MON_EVIDENCE : "indicator_version_id"
  MON_SUBMISSION_VERSIONS ||--o{ MON_VALIDATION_RESULTS : "submission_version_id"
  MON_SUBMISSION_VERSIONS ||--o{ MON_REVIEW_EVENTS : "submission_version_id"
  IAA_AUTH_USERS ||--o{ MON_REVIEW_EVENTS : "actor_id"
  MON_SUBMISSION_VERSIONS ||--o{ MON_CALCULATED_METRICS : "submission_version_id"
  MON_INDICATOR_VERSIONS ||--o{ MON_CALCULATED_METRICS : "indicator_version_id"
  PLAN_METHOD_VERSIONS ||--o{ MON_CALCULATED_METRICS : "method_version_id"
  MON_SUBMISSION_VERSIONS ||--o{ MON_RELEASES : "submission_version_id"
  IAA_AUTH_USERS ||--o{ MON_RELEASES : "approved_by"
  IAA_AUTH_USERS o|--o{ OPS_AUDIT_EVENTS : "actor_id"
  IAA_AUTH_USERS ||--o{ OPS_NOTIFICATIONS : "recipient_id"
  MON_OBLIGATIONS o|--o{ OPS_NOTIFICATIONS : "obligation_id"
```

For API and table inventory details, see [BASELINE_TABLES.md](./BASELINE_TABLES.md) and [RESOURCE_APIS.md](./RESOURCE_APIS.md).
