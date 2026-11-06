-- IAA Agrivoltaics database design v1, 28 October 2026
-- DESIGN BASELINE: PostgreSQL 15+ and PostGIS. No sample observations seeded.
-- Run against a NEW development database only. Not an incremental migration.
-- Execute as migration owner. Application roles/grants and workflow services are separate work.
-- This schema includes FK/check/index definitions, but not a complete deployed authorisation layer.
BEGIN;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE SCHEMA core;
CREATE SCHEMA iaa_auth;
CREATE SCHEMA geo;
CREATE SCHEMA data;
CREATE SCHEMA wp1;
CREATE SCHEMA content;
CREATE SCHEMA project;
CREATE SCHEMA plan;
CREATE SCHEMA mon;
CREATE SCHEMA ops;

-- IAA, partners, DISCOMs, FPOs, developers and agencies; organisation type is governed vocabulary.
CREATE TABLE core.organisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  organisation_type text NOT NULL,
  parent_id uuid REFERENCES core.organisations(id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON core.organisations (parent_id);

-- Identity provider account; no plaintext passwords or browser role switch.
CREATE TABLE iaa_auth.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_subject text NOT NULL UNIQUE,
  organisation_id uuid REFERENCES core.organisations(id),
  display_name text NOT NULL,
  email text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON iaa_auth.users (organisation_id);

-- Approved role catalogue.
CREATE TABLE iaa_auth.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);


-- Action-level permission catalogue.
CREATE TABLE iaa_auth.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);


-- Actions granted to a role.
CREATE TABLE iaa_auth.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES iaa_auth.roles(id),
  permission_id uuid NOT NULL REFERENCES iaa_auth.permissions(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(role_id,permission_id)
);

CREATE INDEX ON iaa_auth.role_permissions (role_id);
CREATE INDEX ON iaa_auth.role_permissions (permission_id);

-- Organisation-scoped or platform-scoped role assignment; not project membership.
CREATE TABLE iaa_auth.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES iaa_auth.users(id),
  role_id uuid NOT NULL REFERENCES iaa_auth.roles(id),
  organisation_id uuid REFERENCES core.organisations(id),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE NULLS NOT DISTINCT(user_id,role_id,organisation_id)
);

CREATE INDEX ON iaa_auth.user_roles (user_id);
CREATE INDEX ON iaa_auth.user_roles (role_id);
CREATE INDEX ON iaa_auth.user_roles (organisation_id);

-- Controlled units with dimension; crop-dependent bale conversion is not a universal unit factor.
CREATE TABLE core.units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  dimension text NOT NULL,
  canonical_factor numeric,
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);


-- Kharif, Rabi, Summer/Zaid and explicit annual-total category.
CREATE TABLE core.seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  is_total boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);


-- Crops AND source aggregate categories; aggregates must not be added to components.
CREATE TABLE core.crops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  category text,
  is_aggregate boolean NOT NULL DEFAULT false,
  parent_id uuid REFERENCES core.crops(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON core.crops (parent_id);

-- Configurable agrivoltaics models, system typologies and ownership models distinguished by kind.
CREATE TABLE core.models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  kind text NOT NULL CHECK(kind IN ('agrivoltaics','system_typology','land_ownership','project_ownership')),
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);


-- Agronomic, irrigation, water, soil, biodiversity and land restoration practices.
CREATE TABLE core.practices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);


-- Approved languages.
CREATE TABLE core.locales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);


-- UI and controlled vocabulary translations; translation keys stable across releases.
CREATE TABLE core.translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  locale_id uuid NOT NULL REFERENCES core.locales(id),
  translation_key text NOT NULL,
  translated_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(locale_id,translation_key)
);

CREATE INDEX ON core.translations (locale_id);

-- Stable geography identifiers; preserve historical administrative identities.
CREATE TABLE geo.areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_system text NOT NULL,
  code text NOT NULL,
  name text NOT NULL,
  level text NOT NULL CHECK(level IN ('country','state','district','subdistrict','village','city')),
  parent_id uuid REFERENCES geo.areas(id),
  valid_from date,
  valid_to date,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(code_system,code),
  CHECK(valid_to IS NULL OR valid_from IS NULL OR valid_to>=valid_from)
);

CREATE INDEX ON geo.areas (parent_id);

-- Source-specific names and approved geography matches; historical names not silently rewritten.
CREATE TABLE geo.aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id uuid NOT NULL REFERENCES geo.areas(id),
  source_namespace text NOT NULL,
  source_state text NOT NULL DEFAULT '',
  source_name text NOT NULL,
  valid_from date,
  valid_to date,
  match_method text NOT NULL,
  reviewed_by uuid REFERENCES iaa_auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE NULLS NOT DISTINCT(source_namespace,source_state,source_name,valid_from)
);

CREATE INDEX ON geo.aliases (area_id);
CREATE INDEX ON geo.aliases (reviewed_by);

-- Split/merge relationships between historical and new areas; weights require approved method.
CREATE TABLE geo.area_crosswalks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_area_id uuid NOT NULL REFERENCES geo.areas(id),
  to_area_id uuid NOT NULL REFERENCES geo.areas(id),
  relationship text NOT NULL,
  weight numeric CHECK(weight BETWEEN 0 AND 1),
  method_reference text,
  approved_by uuid REFERENCES iaa_auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(from_area_id,to_area_id,relationship)
);

CREATE INDEX ON geo.area_crosswalks (from_area_id);
CREATE INDEX ON geo.area_crosswalks (to_area_id);
CREATE INDEX ON geo.area_crosswalks (approved_by);

-- Original provider, licence, access and source location.
CREATE TABLE data.sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid REFERENCES core.organisations(id),
  name text NOT NULL,
  source_uri text,
  licence text,
  rights_notes text,
  contact_reference text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON data.sources (organisation_id);

-- Thematic catalogue independent of physical tables.
CREATE TABLE data.datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES data.sources(id),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  domain_no smallint NOT NULL CHECK(domain_no BETWEEN 1 AND 10),
  update_frequency text,
  spatial_resolution text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON data.datasets (source_id);

-- Object-store metadata for original files, GIS assets, photos, DPRs and generated reports.
CREATE TABLE data.files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_key text NOT NULL UNIQUE,
  original_name text NOT NULL,
  mime_type text NOT NULL,
  byte_size bigint NOT NULL CHECK(byte_size>=0),
  sha256 text NOT NULL,
  uploaded_by uuid REFERENCES iaa_auth.users(id),
  scan_status text NOT NULL DEFAULT 'pending' CHECK(scan_status IN ('pending','clean','rejected')),
  access_class text NOT NULL DEFAULT 'restricted' CHECK(access_class IN ('public','restricted')),
  captured_at timestamptz,
  location geometry(Point,4326),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON data.files (uploaded_by);
CREATE INDEX ON data.files USING gist (location);

-- Immutable released source snapshot; public rights and analytical approval are separate.
CREATE TABLE data.dataset_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid NOT NULL REFERENCES data.datasets(id),
  file_id uuid REFERENCES data.files(id),
  version_label text NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  reference_start date,
  reference_end date,
  source_crs text,
  source_units text,
  coverage_notes text,
  limitations text,
  status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','review','approved','rejected','retired')),
  is_demo boolean NOT NULL DEFAULT false,
  is_current boolean NOT NULL DEFAULT false,
  public_allowed boolean NOT NULL DEFAULT false,
  planning_allowed boolean NOT NULL DEFAULT false,
  export_allowed boolean NOT NULL DEFAULT false,
  approved_by uuid REFERENCES iaa_auth.users(id),
  approved_at timestamptz,
  supersedes_id uuid REFERENCES data.dataset_versions(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_id,version_label),
  CHECK(reference_end IS NULL OR reference_start IS NULL OR reference_end>=reference_start),
  CHECK(status<>'approved' OR (approved_by IS NOT NULL AND approved_at IS NOT NULL))
);

CREATE INDEX ON data.dataset_versions (dataset_id);
CREATE INDEX ON data.dataset_versions (file_id);
CREATE INDEX ON data.dataset_versions (approved_by);
CREATE INDEX ON data.dataset_versions (supersedes_id);

-- Coverage register, including missing or stale data for the two selected pilot districts.
CREATE TABLE data.coverage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid NOT NULL REFERENCES data.datasets(id),
  area_id uuid NOT NULL REFERENCES geo.areas(id),
  version_id uuid REFERENCES data.dataset_versions(id),
  coverage_status text NOT NULL CHECK(coverage_status IN ('missing','partial','available','stale','blocked')),
  required_resolution text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_id,area_id)
);

CREATE INDEX ON data.coverage (dataset_id);
CREATE INDEX ON data.coverage (area_id);
CREATE INDEX ON data.coverage (version_id);

-- Restricted partner access to named datasets; default deny.
CREATE TABLE data.dataset_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid NOT NULL REFERENCES data.datasets(id),
  organisation_id uuid NOT NULL REFERENCES core.organisations(id),
  can_read boolean NOT NULL DEFAULT false,
  can_import boolean NOT NULL DEFAULT false,
  can_export boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_id,organisation_id)
);

CREATE INDEX ON data.dataset_grants (dataset_id);
CREATE INDEX ON data.dataset_grants (organisation_id);

-- One reproducible import attempt: hash, parser version and mapping version.
CREATE TABLE data.import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  started_by uuid NOT NULL REFERENCES iaa_auth.users(id),
  status text NOT NULL DEFAULT 'queued',
  parser_version text NOT NULL,
  mapping jsonb NOT NULL,
  idempotency_key text NOT NULL UNIQUE,
  finished_at timestamptz,
  row_counts jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON data.import_jobs (version_id);
CREATE INDEX ON data.import_jobs (started_by);

-- Every original row preserved by ordinal; repeated Excel headers preserved as arrays.
CREATE TABLE data.source_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_job_id uuid NOT NULL REFERENCES data.import_jobs(id),
  sheet_name text NOT NULL,
  row_number integer NOT NULL CHECK(row_number>0),
  source_key text,
  raw_cells jsonb NOT NULL,
  normalised_payload jsonb,
  status text NOT NULL DEFAULT 'staged' CHECK(status IN ('staged','accepted','quarantined','excluded')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(import_job_id,sheet_name,row_number)
);

CREATE INDEX ON data.source_records (import_job_id);

-- Row/field-level unresolved and resolved issues; source rows never deleted to hide discrepancies.
CREATE TABLE data.quality_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_record_id uuid NOT NULL REFERENCES data.source_records(id),
  field_name text,
  issue_code text NOT NULL,
  severity text NOT NULL CHECK(severity IN ('info','warning','error')),
  message text NOT NULL,
  resolved_by uuid REFERENCES iaa_auth.users(id),
  resolved_at timestamptz,
  resolution text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON data.quality_issues (source_record_id);
CREATE INDEX ON data.quality_issues (resolved_by);

-- 100 source collection tracker tasks in the WP1 code; workflow not fixed to those 100.
CREATE TABLE data.collection_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id uuid NOT NULL REFERENCES geo.areas(id),
  provider_id uuid REFERENCES core.organisations(id),
  owner_id uuid REFERENCES core.organisations(id),
  dataset_id uuid REFERENCES data.datasets(id),
  requested_data text NOT NULL,
  status text NOT NULL DEFAULT 'not_started' CHECK(status IN ('not_started','requested','in_progress','received','validated','blocked')),
  due_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON data.collection_tasks (area_id);
CREATE INDEX ON data.collection_tasks (provider_id);
CREATE INDEX ON data.collection_tasks (owner_id);
CREATE INDEX ON data.collection_tasks (dataset_id);

-- Versioned polygons; a geography may have several historical boundaries.
CREATE TABLE geo.boundaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id uuid NOT NULL REFERENCES geo.areas(id),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  valid_from date,
  valid_to date,
  geom geometry(MultiPolygon,4326) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE NULLS NOT DISTINCT(area_id,dataset_version_id,valid_from),
  CHECK(ST_IsValid(geom))
);

CREATE INDEX ON geo.boundaries (area_id);
CREATE INDEX ON geo.boundaries (dataset_version_id);
CREATE INDEX ON geo.boundaries USING gist (geom);

-- Version-bound layer style, legend and vector/raster source; raster bytes remain in object storage.
CREATE TABLE geo.layers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  file_id uuid REFERENCES data.files(id),
  code text NOT NULL,
  name text NOT NULL,
  layer_type text NOT NULL CHECK(layer_type IN ('vector','raster','table')),
  geometry_type text,
  style jsonb NOT NULL DEFAULT '{}'::jsonb,
  legend jsonb NOT NULL DEFAULT '{}'::jsonb,
  tile_service_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_version_id,code)
);

CREATE INDEX ON geo.layers (dataset_version_id);
CREATE INDEX ON geo.layers (file_id);

-- Generic imported GIS features for overlays; domain facts use typed tables.
CREATE TABLE geo.features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_id uuid NOT NULL REFERENCES geo.layers(id),
  source_record_id uuid REFERENCES data.source_records(id),
  source_feature_key text NOT NULL,
  geom geometry(Geometry,4326) NOT NULL,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(layer_id,source_feature_key),
  CHECK(ST_IsValid(geom))
);

CREATE INDEX ON geo.features (layer_id);
CREATE INDEX ON geo.features (source_record_id);
CREATE INDEX ON geo.features USING gist (geom);

-- Geocode candidates, accuracy and accepted coordinates; city centroids are not facility locations.
CREATE TABLE geo.geocoding_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_record_id uuid NOT NULL REFERENCES data.source_records(id),
  provider text NOT NULL,
  query_text text NOT NULL,
  candidate_point geometry(Point,4326),
  accuracy_class text NOT NULL CHECK(accuracy_class IN ('facility','parcel','street','city','district','unknown')),
  confidence numeric CHECK(confidence BETWEEN 0 AND 1),
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','rejected')),
  reviewed_by uuid REFERENCES iaa_auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON geo.geocoding_reviews (source_record_id);
CREATE INDEX ON geo.geocoding_reviews USING gist (candidate_point);
CREATE INDEX ON geo.geocoding_reviews (reviewed_by);

-- Source district-year statistical rows; retain original totals; units not inferred from filename.
CREATE TABLE wp1.land_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  source_record_id uuid REFERENCES data.source_records(id),
  area_id uuid NOT NULL REFERENCES geo.areas(id),
  unit_id uuid REFERENCES core.units(id),
  source_state text NOT NULL,
  source_district text,
  agricultural_year text NOT NULL,
  row_kind text NOT NULL CHECK(row_kind IN ('district','state_total')),
  reporting_area numeric,
  forest_area numeric,
  non_agricultural_area numeric,
  barren_area numeric,
  non_cultivable_total numeric,
  pasture_area numeric,
  tree_crop_area numeric,
  culturable_waste_area numeric,
  other_uncultivated_total numeric,
  other_fallow_area numeric,
  current_fallow_area numeric,
  fallow_total numeric,
  net_sown_area numeric,
  gross_cropped_area numeric,
  multi_sown_area numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_version_id,area_id,agricultural_year,row_kind)
);

CREATE INDEX ON wp1.land_statistics (dataset_version_id);
CREATE INDEX ON wp1.land_statistics (source_record_id);
CREATE INDEX ON wp1.land_statistics (area_id);
CREATE INDEX ON wp1.land_statistics (unit_id);

-- Long-format production; no district yield may be inferred from this national series.
CREATE TABLE wp1.crop_production (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  source_record_id uuid REFERENCES data.source_records(id),
  area_id uuid NOT NULL REFERENCES geo.areas(id),
  crop_id uuid NOT NULL REFERENCES core.crops(id),
  season_id uuid NOT NULL REFERENCES core.seasons(id),
  unit_id uuid NOT NULL REFERENCES core.units(id),
  agricultural_year text NOT NULL,
  production numeric CHECK(production>=0),
  source_value text NOT NULL,
  value_status text NOT NULL CHECK(value_status IN ('numeric','included_in_rabi','included_in_kharif','not_reported','non_numeric')),
  source_page integer,
  source_crop_number integer,
  unit_context jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_version_id,area_id,crop_id,season_id,agricultural_year),
  CHECK((value_status='numeric' AND production IS NOT NULL) OR (value_status<>'numeric' AND production IS NULL))
);

CREATE INDEX ON wp1.crop_production (dataset_version_id);
CREATE INDEX ON wp1.crop_production (source_record_id);
CREATE INDEX ON wp1.crop_production (area_id);
CREATE INDEX ON wp1.crop_production (crop_id);
CREATE INDEX ON wp1.crop_production (season_id);
CREATE INDEX ON wp1.crop_production (unit_id);

-- Stable identity of mandis, cold stores, dairies, FPO hubs, fodder units and processors.
CREATE TABLE wp1.facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  facility_type text NOT NULL,
  name text NOT NULL,
  operator_id uuid REFERENCES core.organisations(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON wp1.facilities (operator_id);

-- Facility observations including unknown coordinates and source area strings.
CREATE TABLE wp1.facility_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  source_record_id uuid REFERENCES data.source_records(id),
  facility_id uuid NOT NULL REFERENCES wp1.facilities(id),
  area_id uuid REFERENCES geo.areas(id),
  geocode_review_id uuid REFERENCES geo.geocoding_reviews(id),
  capacity_unit_id uuid REFERENCES core.units(id),
  source_state text,
  source_district text,
  city text,
  address text,
  point geometry(Point,4326),
  location_accuracy text NOT NULL DEFAULT 'unknown',
  established_year integer,
  source_area_text text,
  area_ha numeric CHECK(area_ha>=0),
  capacity_value numeric CHECK(capacity_value>=0),
  operational_status text,
  as_of_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_version_id,facility_id)
);

CREATE INDEX ON wp1.facility_versions (dataset_version_id);
CREATE INDEX ON wp1.facility_versions (source_record_id);
CREATE INDEX ON wp1.facility_versions (facility_id);
CREATE INDEX ON wp1.facility_versions (area_id);
CREATE INDEX ON wp1.facility_versions (geocode_review_id);
CREATE INDEX ON wp1.facility_versions (capacity_unit_id);
CREATE INDEX ON wp1.facility_versions USING gist (point);

-- Government cold-chain programme projects, NOT AgriPV projects; may map to multiple facilities.
CREATE TABLE wp1.cold_chain_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  source_record_id uuid REFERENCES data.source_records(id),
  source_serial text NOT NULL,
  project_name text NOT NULL,
  phase text,
  agency_id uuid REFERENCES core.organisations(id),
  sector text,
  area_id uuid REFERENCES geo.areas(id),
  source_state text NOT NULL,
  source_district text,
  approval_date date,
  project_cost_inr numeric(20,2) CHECK(project_cost_inr>=0),
  approved_grant_inr numeric(20,2) CHECK(approved_grant_inr>=0),
  released_grant_inr numeric(20,2) CHECK(released_grant_inr>=0),
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_version_id,source_serial)
);

CREATE INDEX ON wp1.cold_chain_projects (dataset_version_id);
CREATE INDEX ON wp1.cold_chain_projects (source_record_id);
CREATE INDEX ON wp1.cold_chain_projects (agency_id);
CREATE INDEX ON wp1.cold_chain_projects (area_id);

-- Verified programme-project to physical-facility mapping; do not assume one project is one facility.
CREATE TABLE wp1.cold_chain_facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cold_chain_project_id uuid NOT NULL REFERENCES wp1.cold_chain_projects(id),
  facility_id uuid NOT NULL REFERENCES wp1.facilities(id),
  verification_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(cold_chain_project_id,facility_id)
);

CREATE INDEX ON wp1.cold_chain_facilities (cold_chain_project_id);
CREATE INDEX ON wp1.cold_chain_facilities (facility_id);

-- Stable grid asset identity.
CREATE TABLE wp1.substations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  discom_id uuid REFERENCES core.organisations(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON wp1.substations (discom_id);

-- Time-bound substation location, voltage and loading observations.
CREATE TABLE wp1.substation_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  source_record_id uuid REFERENCES data.source_records(id),
  substation_id uuid NOT NULL REFERENCES wp1.substations(id),
  area_id uuid NOT NULL REFERENCES geo.areas(id),
  point geometry(Point,4326),
  high_voltage_kv numeric,
  low_voltage_kv numeric,
  capacity_mva numeric CHECK(capacity_mva>=0),
  loading_pct numeric CHECK(loading_pct>=0),
  observed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_version_id,substation_id)
);

CREATE INDEX ON wp1.substation_versions (dataset_version_id);
CREATE INDEX ON wp1.substation_versions (source_record_id);
CREATE INDEX ON wp1.substation_versions (substation_id);
CREATE INDEX ON wp1.substation_versions (area_id);
CREATE INDEX ON wp1.substation_versions USING gist (point);

-- Stable feeder identity; partner IDs are DISCOM scoped.
CREATE TABLE wp1.feeders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discom_id uuid NOT NULL REFERENCES core.organisations(id),
  source_code text NOT NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(discom_id,source_code)
);

CREATE INDEX ON wp1.feeders (discom_id);

-- Feeder topology, capacity and reliability with period and method.
CREATE TABLE wp1.feeder_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  source_record_id uuid REFERENCES data.source_records(id),
  feeder_id uuid NOT NULL REFERENCES wp1.feeders(id),
  substation_id uuid REFERENCES wp1.substations(id),
  area_id uuid NOT NULL REFERENCES geo.areas(id),
  point geometry(Point,4326),
  line_geom geometry(MultiLineString,4326),
  voltage_kv numeric CHECK(voltage_kv>0),
  sanctioned_mw numeric CHECK(sanctioned_mw>=0),
  peak_load_mw numeric CHECK(peak_load_mw>=0),
  approved_hosting_mw numeric CHECK(approved_hosting_mw>=0),
  saidi_minutes numeric CHECK(saidi_minutes>=0),
  saifi_count numeric CHECK(saifi_count>=0),
  reference_start date,
  reference_end date,
  outage_threshold_minutes numeric,
  method_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_version_id,feeder_id)
);

CREATE INDEX ON wp1.feeder_versions (dataset_version_id);
CREATE INDEX ON wp1.feeder_versions (source_record_id);
CREATE INDEX ON wp1.feeder_versions (feeder_id);
CREATE INDEX ON wp1.feeder_versions (substation_id);
CREATE INDEX ON wp1.feeder_versions (area_id);
CREATE INDEX ON wp1.feeder_versions USING gist (point);
CREATE INDEX ON wp1.feeder_versions USING gist (line_geom);

-- Timestamped load curves required for grid assessment.
CREATE TABLE wp1.feeder_load_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  source_record_id uuid REFERENCES data.source_records(id),
  feeder_id uuid NOT NULL REFERENCES wp1.feeders(id),
  observed_at timestamptz NOT NULL,
  load_mw numeric NOT NULL,
  quality_flag text NOT NULL,
  interval_minutes integer CHECK(interval_minutes>0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_version_id,feeder_id,observed_at)
);

CREATE INDEX ON wp1.feeder_load_readings (dataset_version_id);
CREATE INDEX ON wp1.feeder_load_readings (source_record_id);
CREATE INDEX ON wp1.feeder_load_readings (feeder_id);

-- Stable existing solar plants, parks and RE clusters for retrofit screening.
CREATE TABLE wp1.solar_installations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  installation_type text NOT NULL,
  owner_id uuid REFERENCES core.organisations(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON wp1.solar_installations (owner_id);

-- Observed solar layout and retrofit inputs.
CREATE TABLE wp1.solar_installation_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  source_record_id uuid REFERENCES data.source_records(id),
  installation_id uuid NOT NULL REFERENCES wp1.solar_installations(id),
  area_id uuid NOT NULL REFERENCES geo.areas(id),
  point geometry(Point,4326),
  footprint geometry(MultiPolygon,4326),
  capacity_dc_mwp numeric CHECK(capacity_dc_mwp>=0),
  capacity_ac_mw numeric CHECK(capacity_ac_mw>=0),
  clearance_m numeric CHECK(clearance_m>=0),
  row_pitch_m numeric CHECK(row_pitch_m>0),
  layout_type text,
  land_rights_status text,
  operational_status text,
  as_of_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_version_id,installation_id)
);

CREATE INDEX ON wp1.solar_installation_versions (dataset_version_id);
CREATE INDEX ON wp1.solar_installation_versions (source_record_id);
CREATE INDEX ON wp1.solar_installation_versions (installation_id);
CREATE INDEX ON wp1.solar_installation_versions (area_id);
CREATE INDEX ON wp1.solar_installation_versions USING gist (point);
CREATE INDEX ON wp1.solar_installation_versions USING gist (footprint);

-- Solar resource, rainfall, temperature, livestock and fodder district statistics with explicit grain.
CREATE TABLE wp1.environment_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  source_record_id uuid REFERENCES data.source_records(id),
  area_id uuid NOT NULL REFERENCES geo.areas(id),
  unit_id uuid NOT NULL REFERENCES core.units(id),
  metric_code text NOT NULL,
  category_code text NOT NULL DEFAULT '',
  period_start date NOT NULL,
  period_end date NOT NULL,
  value numeric,
  value_status text NOT NULL DEFAULT 'reported',
  resolution text NOT NULL,
  method_reference text,
  point geometry(Point,4326),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_version_id,area_id,metric_code,category_code,period_start,period_end),
  CHECK(period_end>=period_start)
);

CREATE INDEX ON wp1.environment_observations (dataset_version_id);
CREATE INDEX ON wp1.environment_observations (source_record_id);
CREATE INDEX ON wp1.environment_observations (area_id);
CREATE INDEX ON wp1.environment_observations (unit_id);
CREATE INDEX ON wp1.environment_observations USING gist (point);

-- Agro-climatic zone polygons and descriptive bands.
CREATE TABLE wp1.agro_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  source_record_id uuid REFERENCES data.source_records(id),
  code text NOT NULL,
  name text NOT NULL,
  geom geometry(MultiPolygon,4326),
  rainfall_band text,
  temperature_band text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_version_id,code)
);

CREATE INDEX ON wp1.agro_zones (dataset_version_id);
CREATE INDEX ON wp1.agro_zones (source_record_id);
CREATE INDEX ON wp1.agro_zones USING gist (geom);

-- Crop/season/zone shade tolerance and calendars; source-backed rules, not sample thresholds.
CREATE TABLE wp1.crop_suitability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  source_record_id uuid REFERENCES data.source_records(id),
  crop_id uuid NOT NULL REFERENCES core.crops(id),
  season_id uuid NOT NULL REFERENCES core.seasons(id),
  zone_id uuid REFERENCES wp1.agro_zones(id),
  shade_tolerance_pct numeric CHECK(shade_tolerance_pct BETWEEN 0 AND 100),
  minimum_dli numeric CHECK(minimum_dli>=0),
  growth_days integer CHECK(growth_days>0),
  sowing_window text,
  harvest_window text,
  irrigation_requirement text,
  method_reference text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON wp1.crop_suitability (dataset_version_id);
CREATE INDEX ON wp1.crop_suitability (source_record_id);
CREATE INDEX ON wp1.crop_suitability (crop_id);
CREATE INDEX ON wp1.crop_suitability (season_id);
CREATE INDEX ON wp1.crop_suitability (zone_id);

-- Actual irrigation method/source data when supplied; not populated from the misnamed length workbook.
CREATE TABLE wp1.irrigation_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  source_record_id uuid REFERENCES data.source_records(id),
  area_id uuid NOT NULL REFERENCES geo.areas(id),
  unit_id uuid NOT NULL REFERENCES core.units(id),
  period_label text NOT NULL,
  water_source text NOT NULL,
  irrigation_method text NOT NULL,
  value numeric CHECK(value>=0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_version_id,area_id,period_label,water_source,irrigation_method)
);

CREATE INDEX ON wp1.irrigation_statistics (dataset_version_id);
CREATE INDEX ON wp1.irrigation_statistics (source_record_id);
CREATE INDEX ON wp1.irrigation_statistics (area_id);
CREATE INDEX ON wp1.irrigation_statistics (unit_id);

-- Parcel boundaries and physical constraints required for site-level screening.
CREATE TABLE wp1.land_parcels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  source_record_id uuid REFERENCES data.source_records(id),
  area_id uuid NOT NULL REFERENCES geo.areas(id),
  source_parcel_key text NOT NULL,
  geom geometry(MultiPolygon,4326) NOT NULL,
  area_ha numeric CHECK(area_ha>0),
  land_use text,
  slope_degrees numeric CHECK(slope_degrees BETWEEN 0 AND 90),
  soil_type text,
  rights_status text,
  constraints jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_version_id,source_parcel_key),
  CHECK(ST_IsValid(geom))
);

CREATE INDEX ON wp1.land_parcels (dataset_version_id);
CREATE INDEX ON wp1.land_parcels (source_record_id);
CREATE INDEX ON wp1.land_parcels (area_id);
CREATE INDEX ON wp1.land_parcels USING gist (geom);

-- Stable publication/handbook/case study/advisory identity.
CREATE TABLE content.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  resource_type text NOT NULL,
  theme text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);


-- Translated, versioned reviewed knowledge content.
CREATE TABLE content.resource_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  source_record_id uuid REFERENCES data.source_records(id),
  resource_id uuid NOT NULL REFERENCES content.resources(id),
  locale_id uuid NOT NULL REFERENCES core.locales(id),
  file_id uuid REFERENCES data.files(id),
  title text NOT NULL,
  body text,
  external_uri text,
  published_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_version_id,resource_id,locale_id)
);

CREATE INDEX ON content.resource_versions (dataset_version_id);
CREATE INDEX ON content.resource_versions (source_record_id);
CREATE INDEX ON content.resource_versions (resource_id);
CREATE INDEX ON content.resource_versions (locale_id);
CREATE INDEX ON content.resource_versions (file_id);

-- Regional resource linkage.
CREATE TABLE content.resource_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES content.resources(id),
  area_id uuid NOT NULL REFERENCES geo.areas(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(resource_id,area_id)
);

CREATE INDEX ON content.resource_areas (resource_id);
CREATE INDEX ON content.resource_areas (area_id);

-- Stable policy/scheme identity.
CREATE TABLE content.policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  kind text NOT NULL CHECK(kind IN ('policy','scheme')),
  issuer_id uuid REFERENCES core.organisations(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON content.policies (issuer_id);

-- Effective policy text and structured eligibility; never imply automatic entitlement.
CREATE TABLE content.policy_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  source_record_id uuid REFERENCES data.source_records(id),
  policy_id uuid NOT NULL REFERENCES content.policies(id),
  file_id uuid REFERENCES data.files(id),
  effective_from date,
  effective_to date,
  status text NOT NULL,
  eligibility jsonb NOT NULL DEFAULT '{}'::jsonb,
  benefits jsonb NOT NULL DEFAULT '{}'::jsonb,
  summary text,
  review_due date,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dataset_version_id,policy_id),
  CHECK(effective_to IS NULL OR effective_from IS NULL OR effective_to>=effective_from)
);

CREATE INDEX ON content.policy_versions (dataset_version_id);
CREATE INDEX ON content.policy_versions (source_record_id);
CREATE INDEX ON content.policy_versions (policy_id);
CREATE INDEX ON content.policy_versions (file_id);

-- Geographic applicability and convergence overlays.
CREATE TABLE content.policy_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_version_id uuid NOT NULL REFERENCES content.policy_versions(id),
  area_id uuid NOT NULL REFERENCES geo.areas(id),
  zone_geom geometry(MultiPolygon,4326),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(policy_version_id,area_id)
);

CREATE INDEX ON content.policy_areas (policy_version_id);
CREATE INDEX ON content.policy_areas (area_id);
CREATE INDEX ON content.policy_areas USING gist (zone_geom);

-- Implementer questions with restricted author identity and region; publication is separately curated.
CREATE TABLE content.queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asked_by uuid NOT NULL REFERENCES iaa_auth.users(id),
  area_id uuid REFERENCES geo.areas(id),
  question text NOT NULL,
  bottleneck_category text,
  status text NOT NULL DEFAULT 'open',
  assigned_to uuid REFERENCES iaa_auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON content.queries (asked_by);
CREATE INDEX ON content.queries (area_id);
CREATE INDEX ON content.queries (assigned_to);

-- Reviewer answers; published learning is linked to a reviewed resource.
CREATE TABLE content.query_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id uuid NOT NULL REFERENCES content.queries(id),
  author_id uuid NOT NULL REFERENCES iaa_auth.users(id),
  resource_id uuid REFERENCES content.resources(id),
  answer text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON content.query_responses (query_id);
CREATE INDEX ON content.query_responses (author_id);
CREATE INDEX ON content.query_responses (resource_id);

-- One permanent AgriPV project ID across WP1, WP2 and WP3.
CREATE TABLE project.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  owner_organisation_id uuid NOT NULL REFERENCES core.organisations(id),
  created_by uuid NOT NULL REFERENCES iaa_auth.users(id),
  is_demo boolean NOT NULL DEFAULT false,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON project.projects (owner_organisation_id);
CREATE INDEX ON project.projects (created_by);

-- Immutable approved project profile; changing capacity cannot rewrite historic monitoring.
CREATE TABLE project.versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES project.projects(id),
  area_id uuid NOT NULL REFERENCES geo.areas(id),
  model_id uuid REFERENCES core.models(id),
  typology_id uuid REFERENCES core.models(id),
  ownership_model_id uuid REFERENCES core.models(id),
  land_ownership_model_id uuid REFERENCES core.models(id),
  revision integer NOT NULL CHECK(revision>0),
  name text NOT NULL,
  status text NOT NULL CHECK(status IN ('planned','pilot','construction','operational','inactive','closed')),
  point geometry(Point,4326),
  footprint geometry(MultiPolygon,4326),
  commissioned_on date,
  capacity_dc_mwp numeric CHECK(capacity_dc_mwp>=0),
  capacity_ac_mw numeric CHECK(capacity_ac_mw>=0),
  storage_mwh numeric CHECK(storage_mwh>=0),
  site_area_ha numeric CHECK(site_area_ha>0),
  cultivated_area_ha numeric CHECK(cultivated_area_ha>=0),
  agripv_footprint_ha numeric CHECK(agripv_footprint_ha>=0),
  objective text,
  summary text,
  effective_from date NOT NULL,
  effective_to date,
  review_status text NOT NULL DEFAULT 'draft' CHECK(review_status IN ('draft','submitted','returned','approved','rejected')),
  approved_by uuid REFERENCES iaa_auth.users(id),
  approved_at timestamptz,
  supersedes_id uuid REFERENCES project.versions(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id,revision),
  UNIQUE(id,project_id),
  CHECK(cultivated_area_ha IS NULL OR site_area_ha IS NULL OR cultivated_area_ha<=site_area_ha),
  CHECK(agripv_footprint_ha IS NULL OR site_area_ha IS NULL OR agripv_footprint_ha<=site_area_ha),
  CHECK(effective_to IS NULL OR effective_to>=effective_from),
  CHECK(review_status<>'approved' OR (approved_by IS NOT NULL AND approved_at IS NOT NULL))
);

CREATE INDEX ON project.versions (project_id);
CREATE INDEX ON project.versions (area_id);
CREATE INDEX ON project.versions (model_id);
CREATE INDEX ON project.versions (typology_id);
CREATE INDEX ON project.versions (ownership_model_id);
CREATE INDEX ON project.versions (land_ownership_model_id);
CREATE INDEX ON project.versions USING gist (point);
CREATE INDEX ON project.versions USING gist (footprint);
CREATE INDEX ON project.versions (approved_by);
CREATE INDEX ON project.versions (supersedes_id);

-- Project-level user assignment independent of organisation-wide roles.
CREATE TABLE project.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES project.projects(id),
  user_id uuid NOT NULL REFERENCES iaa_auth.users(id),
  role_id uuid NOT NULL REFERENCES iaa_auth.roles(id),
  valid_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id,user_id,role_id)
);

CREATE INDEX ON project.memberships (project_id);
CREATE INDEX ON project.memberships (user_id);
CREATE INDEX ON project.memberships (role_id);

-- Multiple EPCs, research partners, developers and O&M partners per version.
CREATE TABLE project.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_version_id uuid NOT NULL REFERENCES project.versions(id),
  organisation_id uuid NOT NULL REFERENCES core.organisations(id),
  partner_role text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_version_id,organisation_id,partner_role)
);

CREATE INDEX ON project.partners (project_version_id);
CREATE INDEX ON project.partners (organisation_id);

-- Restricted land-owner and DISCOM contact data; excluded from public profiles.
CREATE TABLE project.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES project.projects(id),
  contact_role text NOT NULL,
  name_ciphertext bytea,
  contact_ciphertext bytea,
  key_reference text,
  consent_reference text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON project.contacts (project_id);

-- Area breakdowns retain overlap groups: solar footprint overlaps cultivated area.
CREATE TABLE project.land_uses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_version_id uuid NOT NULL REFERENCES project.versions(id),
  use_code text NOT NULL,
  area_ha numeric NOT NULL CHECK(area_ha>=0),
  overlap_group text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_version_id,use_code,overlap_group)
);

CREATE INDEX ON project.land_uses (project_version_id);

-- Typed structural fields from WP1; separate units for DC, AC, modules and clearance.
CREATE TABLE project.designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_version_id uuid NOT NULL REFERENCES project.versions(id),
  array_code text NOT NULL,
  module_technology text,
  module_power_wp numeric CHECK(module_power_wp>0),
  module_count integer CHECK(module_count>0),
  module_width_m numeric CHECK(module_width_m>0),
  module_length_m numeric CHECK(module_length_m>0),
  transparency_pct numeric CHECK(transparency_pct BETWEEN 0 AND 100),
  mounting_type text,
  clearance_m numeric CHECK(clearance_m>=0),
  row_pitch_m numeric CHECK(row_pitch_m>0),
  column_spacing_m numeric CHECK(column_spacing_m>0),
  tilt_degrees numeric CHECK(tilt_degrees BETWEEN 0 AND 90),
  azimuth_degrees numeric CHECK(azimuth_degrees>=0 AND azimuth_degrees<360),
  tracking_type text,
  tracking_manufacturer text,
  piling_type text,
  piling_material text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_version_id,array_code)
);

CREATE INDEX ON project.designs (project_version_id);

-- Actual approved connection, distinct from nearest substation distance.
CREATE TABLE project.grid_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_version_id uuid NOT NULL REFERENCES project.versions(id),
  feeder_id uuid REFERENCES wp1.feeders(id),
  substation_id uuid REFERENCES wp1.substations(id),
  discom_id uuid NOT NULL REFERENCES core.organisations(id),
  connection_code text NOT NULL,
  voltage_kv numeric CHECK(voltage_kv>0),
  export_limit_mw numeric CHECK(export_limit_mw>=0),
  metering_policy text,
  tariff_inr_kwh numeric CHECK(tariff_inr_kwh>=0),
  tariff_category text,
  valid_from date,
  valid_to date,
  substation_distance_km numeric CHECK(substation_distance_km>=0),
  distance_method text,
  approval_file_id uuid REFERENCES data.files(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_version_id,connection_code)
);

CREATE INDEX ON project.grid_connections (project_version_id);
CREATE INDEX ON project.grid_connections (feeder_id);
CREATE INDEX ON project.grid_connections (substation_id);
CREATE INDEX ON project.grid_connections (discom_id);
CREATE INDEX ON project.grid_connections (approval_file_id);

-- Multiple crops and seasons rather than a single crop text on project.
CREATE TABLE project.crop_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_version_id uuid NOT NULL REFERENCES project.versions(id),
  crop_id uuid NOT NULL REFERENCES core.crops(id),
  season_id uuid NOT NULL REFERENCES core.seasons(id),
  plot_code text NOT NULL DEFAULT 'site',
  agricultural_year text NOT NULL,
  area_ha numeric CHECK(area_ha>=0),
  sowing_date date,
  harvest_date date,
  water_source text,
  irrigation_method text,
  selection_rationale text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_version_id,crop_id,season_id,plot_code,agricultural_year)
);

CREATE INDEX ON project.crop_plans (project_version_id);
CREATE INDEX ON project.crop_plans (crop_id);
CREATE INDEX ON project.crop_plans (season_id);

-- Governed narrative fields from the 74-field template; measurable facts live in typed tables.
CREATE TABLE project.profile_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_version_id uuid NOT NULL REFERENCES project.versions(id),
  field_code text NOT NULL,
  section_code text NOT NULL,
  narrative text NOT NULL,
  visibility text NOT NULL DEFAULT 'restricted' CHECK(visibility IN ('public','restricted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_version_id,field_code)
);

CREATE INDEX ON project.profile_notes (project_version_id);

-- DPRs, lease evidence, photos and design drawings tied to the correct profile revision.
CREATE TABLE project.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_version_id uuid NOT NULL REFERENCES project.versions(id),
  file_id uuid NOT NULL REFERENCES data.files(id),
  category text NOT NULL,
  caption text,
  public_allowed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_version_id,file_id,category)
);

CREATE INDEX ON project.documents (project_version_id);
CREATE INDEX ON project.documents (file_id);

-- Explicit public release of an approved project version and a field whitelist.
CREATE TABLE project.publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_version_id uuid NOT NULL REFERENCES project.versions(id),
  approved_by uuid NOT NULL REFERENCES iaa_auth.users(id),
  approved_at timestamptz NOT NULL,
  public_fields jsonb NOT NULL,
  released_at timestamptz NOT NULL,
  revoked_at timestamptz,
  release_reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON project.publications (project_version_id);
CREATE INDEX ON project.publications (approved_by);

-- Stable named analytical method, including shading and financial worksheet if approved.
CREATE TABLE plan.methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  function_code text NOT NULL CHECK(function_code IN ('suitability','grid','model','market','scheme','retrofit','shading','finance','monitoring')),
  created_at timestamptz NOT NULL DEFAULT now()
);


-- Versioned approved algorithm and code artifact hash; no invented production formulas.
CREATE TABLE plan.method_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  method_id uuid NOT NULL REFERENCES plan.methods(id),
  version_label text NOT NULL,
  configuration jsonb NOT NULL,
  code_digest text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','approved','retired')),
  approved_by uuid REFERENCES iaa_auth.users(id),
  approved_at timestamptz,
  limitations text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(method_id,version_label),
  CHECK(status<>'approved' OR (approved_by IS NOT NULL AND approved_at IS NOT NULL))
);

CREATE INDEX ON plan.method_versions (method_id);
CREATE INDEX ON plan.method_versions (approved_by);

-- Approved normalisation, weights, exclusion rules and missing-data treatment.
CREATE TABLE plan.criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  method_version_id uuid NOT NULL REFERENCES plan.method_versions(id),
  unit_id uuid REFERENCES core.units(id),
  code text NOT NULL,
  weight numeric CHECK(weight BETWEEN 0 AND 1),
  normalisation jsonb NOT NULL,
  exclusion_rule jsonb,
  missing_action text NOT NULL CHECK(missing_action IN ('withhold','flag','approved_renormalisation')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(method_version_id,code)
);

CREATE INDEX ON plan.criteria (method_version_id);
CREATE INDEX ON plan.criteria (unit_id);

-- Open-access planning case; login optional, anonymous access token stored as hash.
CREATE TABLE plan.assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES iaa_auth.users(id),
  area_id uuid NOT NULL REFERENCES geo.areas(id),
  project_id uuid REFERENCES project.projects(id),
  solar_installation_id uuid REFERENCES wp1.solar_installations(id),
  name text NOT NULL,
  point geometry(Point,4326),
  site_geom geometry(MultiPolygon,4326),
  access_token_hash text,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON plan.assessments (created_by);
CREATE INDEX ON plan.assessments (area_id);
CREATE INDEX ON plan.assessments (project_id);
CREATE INDEX ON plan.assessments (solar_installation_id);
CREATE INDEX ON plan.assessments USING gist (point);
CREATE INDEX ON plan.assessments USING gist (site_geom);

-- Editable scenario; a run freezes the scenario revision.
CREATE TABLE plan.scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES plan.assessments(id),
  name text NOT NULL,
  revision integer NOT NULL DEFAULT 1 CHECK(revision>0),
  parameters jsonb NOT NULL,
  input_hash text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(assessment_id,name)
);

CREATE INDEX ON plan.scenarios (assessment_id);

-- Immutable execution snapshot; replay uses pinned versions and exact input payload.
CREATE TABLE plan.runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid NOT NULL REFERENCES plan.scenarios(id),
  scenario_revision integer NOT NULL,
  input_snapshot jsonb NOT NULL,
  input_hash text NOT NULL,
  engine_version text NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','running','completed','partial','failed')),
  is_demo boolean NOT NULL DEFAULT false,
  started_at timestamptz,
  finished_at timestamptz,
  failure_detail text,
  idempotency_key text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON plan.runs (scenario_id);

-- Every dataset version and boundary version consumed by a run.
CREATE TABLE plan.run_datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES plan.runs(id),
  dataset_version_id uuid NOT NULL REFERENCES data.dataset_versions(id),
  usage_role text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(run_id,dataset_version_id,usage_role)
);

CREATE INDEX ON plan.run_datasets (run_id);
CREATE INDEX ON plan.run_datasets (dataset_version_id);

-- Method versions pinned separately for all six planning functions.
CREATE TABLE plan.run_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES plan.runs(id),
  method_version_id uuid NOT NULL REFERENCES plan.method_versions(id),
  function_code text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(run_id,function_code)
);

CREATE INDEX ON plan.run_methods (run_id);
CREATE INDEX ON plan.run_methods (method_version_id);

-- Six domain outputs with explicit unavailable/indicative status; structured result payloads validated per method.
CREATE TABLE plan.results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES plan.runs(id),
  method_version_id uuid NOT NULL REFERENCES plan.method_versions(id),
  function_code text NOT NULL,
  status text NOT NULL CHECK(status IN ('computed','indicative','cannot_assess','failed')),
  score numeric,
  classification text,
  result jsonb NOT NULL,
  explanation text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(run_id,function_code)
);

CREATE INDEX ON plan.results (run_id);
CREATE INDEX ON plan.results (method_version_id);

-- Explainable MCDA contributions; source row and raw value retained.
CREATE TABLE plan.criterion_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES plan.runs(id),
  criterion_id uuid NOT NULL REFERENCES plan.criteria(id),
  source_record_id uuid REFERENCES data.source_records(id),
  raw_value numeric,
  normalised_value numeric,
  weight_used numeric,
  contribution numeric,
  status text NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(run_id,criterion_id)
);

CREATE INDEX ON plan.criterion_results (run_id);
CREATE INDEX ON plan.criterion_results (criterion_id);
CREATE INDEX ON plan.criterion_results (source_record_id);

-- Missing, outdated, restricted or coarse evidence; not silently zero-filled.
CREATE TABLE plan.gaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES plan.runs(id),
  dataset_id uuid REFERENCES data.datasets(id),
  function_code text NOT NULL,
  severity text NOT NULL,
  reason text NOT NULL,
  required_action text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON plan.gaps (run_id);
CREATE INDEX ON plan.gaps (dataset_id);

-- Facility distance/travel-time per run, not a permanent facility property.
CREATE TABLE plan.market_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES plan.runs(id),
  facility_version_id uuid NOT NULL REFERENCES wp1.facility_versions(id),
  distance_method text NOT NULL CHECK(distance_method IN ('straight_line','road_network')),
  distance_km numeric NOT NULL CHECK(distance_km>=0),
  travel_minutes numeric CHECK(travel_minutes>=0),
  routing_source_version text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(run_id,facility_version_id,distance_method),
  CHECK(distance_method<>'straight_line' OR travel_minutes IS NULL)
);

CREATE INDEX ON plan.market_results (run_id);
CREATE INDEX ON plan.market_results (facility_version_id);

-- Ranked model recommendations with crop and evidence explanation.
CREATE TABLE plan.model_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES plan.runs(id),
  model_id uuid NOT NULL REFERENCES core.models(id),
  crop_id uuid REFERENCES core.crops(id),
  rank integer CHECK(rank>0),
  fit_status text NOT NULL,
  explanation text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE NULLS NOT DISTINCT(run_id,model_id,crop_id)
);

CREATE INDEX ON plan.model_results (run_id);
CREATE INDEX ON plan.model_results (model_id);
CREATE INDEX ON plan.model_results (crop_id);

-- Potential scheme match uses exact effective policy version; final eligibility not promised.
CREATE TABLE plan.scheme_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES plan.runs(id),
  policy_version_id uuid NOT NULL REFERENCES content.policy_versions(id),
  match_status text NOT NULL,
  unverified_conditions jsonb NOT NULL,
  explanation text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(run_id,policy_version_id)
);

CREATE INDEX ON plan.scheme_results (run_id);
CREATE INDEX ON plan.scheme_results (policy_version_id);

-- One row per physical/land-rights/grid/agricultural retrofit check.
CREATE TABLE plan.retrofit_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES plan.runs(id),
  check_code text NOT NULL,
  status text NOT NULL CHECK(status IN ('pass','fail','unknown','field_verification')),
  input_value jsonb,
  explanation text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(run_id,check_code)
);

CREATE INDEX ON plan.retrofit_checks (run_id);

-- Versioned optional shading analysis reused by WP1 and WP2; configuration and output are immutable.
CREATE TABLE plan.shading_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES plan.runs(id),
  method_version_id uuid NOT NULL REFERENCES plan.method_versions(id),
  array_parameters jsonb NOT NULL,
  time_basis text NOT NULL,
  resource_dataset_version_id uuid REFERENCES data.dataset_versions(id),
  output jsonb NOT NULL,
  limitations text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON plan.shading_runs (run_id);
CREATE INDEX ON plan.shading_runs (method_version_id);
CREATE INDEX ON plan.shading_runs (resource_dataset_version_id);

-- Export freezes one coherent run, its template, locale and checksum.
CREATE TABLE plan.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES plan.runs(id),
  file_id uuid NOT NULL REFERENCES data.files(id),
  locale_id uuid NOT NULL REFERENCES core.locales(id),
  template_version text NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  access_class text NOT NULL DEFAULT 'restricted' CHECK(access_class IN ('public','restricted')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON plan.reports (run_id);
CREATE INDEX ON plan.reports (file_id);
CREATE INDEX ON plan.reports (locale_id);

-- Explicit reviewed conversion to a registered project; a scenario is never itself a project.
CREATE TABLE plan.project_handoffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES plan.assessments(id),
  run_id uuid NOT NULL REFERENCES plan.runs(id),
  project_id uuid NOT NULL REFERENCES project.projects(id),
  approved_by uuid NOT NULL REFERENCES iaa_auth.users(id),
  approved_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(assessment_id,project_id)
);

CREATE INDEX ON plan.project_handoffs (assessment_id);
CREATE INDEX ON plan.project_handoffs (run_id);
CREATE INDEX ON plan.project_handoffs (project_id);
CREATE INDEX ON plan.project_handoffs (approved_by);

-- Explicit date ranges and period grain; quarterly and seasonal totals must not be summed together.
CREATE TABLE mon.periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid REFERENCES core.seasons(id),
  code text NOT NULL UNIQUE,
  kind text NOT NULL CHECK(kind IN ('quarterly','seasonal','annual','monthly')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  calendar_basis text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK(end_date>=start_date)
);

CREATE INDEX ON mon.periods (season_id);

-- Stable indicator codes, domains and aggregation semantics.
CREATE TABLE mon.indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  domain text NOT NULL CHECK(domain IN ('energy','agriculture','income','land','nature','inclusion','progress')),
  aggregation text NOT NULL CHECK(aggregation IN ('sum','weighted_ratio','latest','distinct_count','non_additive')),
  created_at timestamptz NOT NULL DEFAULT now()
);


-- Immutable unit, validation and calculation definition.
CREATE TABLE mon.indicator_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_id uuid NOT NULL REFERENCES mon.indicators(id),
  unit_id uuid REFERENCES core.units(id),
  method_version_id uuid REFERENCES plan.method_versions(id),
  version integer NOT NULL,
  value_type text NOT NULL CHECK(value_type IN ('number','text','boolean','date','choice','json')),
  validation jsonb NOT NULL,
  frequency text NOT NULL,
  is_sensitive boolean NOT NULL DEFAULT false,
  approved_by uuid REFERENCES iaa_auth.users(id),
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(indicator_id,version)
);

CREATE INDEX ON mon.indicator_versions (indicator_id);
CREATE INDEX ON mon.indicator_versions (unit_id);
CREATE INDEX ON mon.indicator_versions (method_version_id);
CREATE INDEX ON mon.indicator_versions (approved_by);

-- Configurable seven-section monitoring form, frozen per reporting obligation.
CREATE TABLE mon.form_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  version integer NOT NULL,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','approved','retired')),
  approved_by uuid REFERENCES iaa_auth.users(id),
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(code,version)
);

CREATE INDEX ON mon.form_versions (approved_by);

-- Indicator mapping with conditions and repeat-group definition; no app rebuild for new indicators.
CREATE TABLE mon.form_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_version_id uuid NOT NULL REFERENCES mon.form_versions(id),
  indicator_version_id uuid NOT NULL REFERENCES mon.indicator_versions(id),
  section_code text NOT NULL,
  field_code text NOT NULL,
  sort_order integer NOT NULL,
  required boolean NOT NULL DEFAULT false,
  repeat_group text,
  visibility_rule jsonb,
  label_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(form_version_id,field_code)
);

CREATE INDEX ON mon.form_fields (form_version_id);
CREATE INDEX ON mon.form_fields (indicator_version_id);

-- Expected project-period-form return including due date and assignment.
CREATE TABLE mon.obligations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES project.projects(id),
  period_id uuid NOT NULL REFERENCES mon.periods(id),
  form_version_id uuid NOT NULL REFERENCES mon.form_versions(id),
  assigned_to uuid NOT NULL REFERENCES iaa_auth.users(id),
  reporting_stream text NOT NULL,
  due_at timestamptz NOT NULL,
  waived_at timestamptz,
  waiver_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id,period_id,reporting_stream),
  UNIQUE(id,project_id)
);

CREATE INDEX ON mon.obligations (project_id);
CREATE INDEX ON mon.obligations (period_id);
CREATE INDEX ON mon.obligations (form_version_id);
CREATE INDEX ON mon.obligations (assigned_to);

-- Logical return identity; one per obligation, with many immutable submitted revisions.
CREATE TABLE mon.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obligation_id uuid NOT NULL REFERENCES mon.obligations(id),
  project_id uuid NOT NULL REFERENCES project.projects(id),
  created_by uuid NOT NULL REFERENCES iaa_auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(obligation_id),
  UNIQUE(id,project_id),
  FOREIGN KEY(obligation_id,project_id) REFERENCES mon.obligations(id,project_id)
);

CREATE INDEX ON mon.submissions (obligation_id);
CREATE INDEX ON mon.submissions (project_id);
CREATE INDEX ON mon.submissions (created_by);

-- Correction history and pinned project capacity/area. Submit seals payload; correction creates next version.
CREATE TABLE mon.submission_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES mon.submissions(id),
  project_id uuid NOT NULL REFERENCES project.projects(id),
  project_version_id uuid NOT NULL REFERENCES project.versions(id),
  submitted_by uuid REFERENCES iaa_auth.users(id),
  revision integer NOT NULL CHECK(revision>0),
  status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','submitted','returned','approved','rejected','superseded')),
  submitted_at timestamptz,
  payload_hash text,
  validation_status text NOT NULL DEFAULT 'pending' CHECK(validation_status IN ('pending','passed','failed')),
  approved_by uuid REFERENCES iaa_auth.users(id),
  approved_at timestamptz,
  supersedes_id uuid REFERENCES mon.submission_versions(id),
  declaration text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(submission_id,revision),
  UNIQUE(id,project_id),
  FOREIGN KEY(submission_id,project_id) REFERENCES mon.submissions(id,project_id),
  FOREIGN KEY(project_version_id,project_id) REFERENCES project.versions(id,project_id),
  CHECK(status NOT IN ('submitted','returned','approved','rejected','superseded') OR (submitted_at IS NOT NULL AND submitted_by IS NOT NULL AND payload_hash IS NOT NULL)),
  CHECK(status<>'approved' OR (validation_status='passed' AND approved_by IS NOT NULL AND approved_at IS NOT NULL))
);

CREATE INDEX ON mon.submission_versions (submission_id);
CREATE INDEX ON mon.submission_versions (project_id);
CREATE INDEX ON mon.submission_versions (project_version_id);
CREATE INDEX ON mon.submission_versions (submitted_by);
CREATE INDEX ON mon.submission_versions (approved_by);
CREATE INDEX ON mon.submission_versions (supersedes_id);

-- Configurable extra responses; typed analytical facts below are authoritative for their indicator codes.
CREATE TABLE mon.indicator_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_version_id uuid NOT NULL REFERENCES mon.submission_versions(id),
  indicator_version_id uuid NOT NULL REFERENCES mon.indicator_versions(id),
  repeat_key text NOT NULL DEFAULT 'site',
  value_number numeric,
  value_text text,
  value_boolean boolean,
  value_date date,
  value_json jsonb,
  missing_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(submission_version_id,indicator_version_id,repeat_key),
  CHECK(num_nonnulls(value_number,value_text,value_boolean,value_date,value_json)=1 OR (num_nonnulls(value_number,value_text,value_boolean,value_date,value_json)=0 AND missing_reason IS NOT NULL))
);

CREATE INDEX ON mon.indicator_values (submission_version_id);
CREATE INDEX ON mon.indicator_values (indicator_version_id);

-- Generation segments permit capacity changes within a reporting period; denominator defined by approved CUF method.
CREATE TABLE mon.energy_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_version_id uuid NOT NULL REFERENCES mon.submission_versions(id),
  segment_code text NOT NULL,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  generation_mwh numeric NOT NULL CHECK(generation_mwh>=0),
  export_mwh numeric CHECK(export_mwh>=0),
  onsite_mwh numeric CHECK(onsite_mwh>=0),
  capacity_dc_mwp numeric NOT NULL CHECK(capacity_dc_mwp>0),
  capacity_ac_mw numeric CHECK(capacity_ac_mw>0),
  operational_hours numeric CHECK(operational_hours>=0),
  reference_hours numeric NOT NULL CHECK(reference_hours>0),
  meter_reference text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(submission_version_id,segment_code),
  CHECK(end_at>start_at),
  CHECK(operational_hours IS NULL OR operational_hours<=reference_hours)
);

CREATE INDEX ON mon.energy_records (submission_version_id);

-- Matched crop-season plot baseline/control with source; national production totals are not baselines.
CREATE TABLE mon.baselines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES project.projects(id),
  crop_id uuid NOT NULL REFERENCES core.crops(id),
  period_id uuid NOT NULL REFERENCES mon.periods(id),
  source_file_id uuid REFERENCES data.files(id),
  dataset_version_id uuid REFERENCES data.dataset_versions(id),
  method_version_id uuid NOT NULL REFERENCES plan.method_versions(id),
  plot_code text NOT NULL,
  baseline_type text NOT NULL CHECK(baseline_type IN ('control_plot','regional','historical')),
  yield_t_ha numeric CHECK(yield_t_ha>=0),
  area_ha numeric CHECK(area_ha>0),
  source_reference text NOT NULL,
  comparability_notes text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON mon.baselines (project_id);
CREATE INDEX ON mon.baselines (crop_id);
CREATE INDEX ON mon.baselines (period_id);
CREATE INDEX ON mon.baselines (source_file_id);
CREATE INDEX ON mon.baselines (dataset_version_id);
CREATE INDEX ON mon.baselines (method_version_id);

-- Repeatable crop/plot/season actual harvest with matched comparator.
CREATE TABLE mon.harvest_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_version_id uuid NOT NULL REFERENCES mon.submission_versions(id),
  crop_id uuid NOT NULL REFERENCES core.crops(id),
  season_id uuid NOT NULL REFERENCES core.seasons(id),
  baseline_id uuid REFERENCES mon.baselines(id),
  plot_code text NOT NULL,
  harvest_date date,
  cultivated_area_ha numeric NOT NULL CHECK(cultivated_area_ha>0),
  production_t numeric NOT NULL CHECK(production_t>=0),
  water_m3 numeric CHECK(water_m3>=0),
  cultivation_cost_inr numeric(20,2) CHECK(cultivation_cost_inr>=0),
  crop_failure_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE NULLS NOT DISTINCT(submission_version_id,crop_id,season_id,plot_code,harvest_date)
);

CREATE INDEX ON mon.harvest_records (submission_version_id);
CREATE INDEX ON mon.harvest_records (crop_id);
CREATE INDEX ON mon.harvest_records (season_id);
CREATE INDEX ON mon.harvest_records (baseline_id);

-- Pseudonymous person IDs for distinct participation, separate from household count.
CREATE TABLE mon.beneficiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES core.organisations(id),
  pseudonym text NOT NULL,
  gender text,
  birth_year integer,
  household_code text,
  consent_reference text,
  retired_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(organisation_id,pseudonym)
);

CREATE INDEX ON mon.beneficiaries (organisation_id);

-- Optional encrypted PII, separated from analytics and public publication.
CREATE TABLE mon.beneficiary_private (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES mon.beneficiaries(id),
  pii_ciphertext bytea NOT NULL,
  key_reference text NOT NULL,
  retention_until date,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(beneficiary_id)
);

CREATE INDEX ON mon.beneficiary_private (beneficiary_id);

-- Many-to-many project participation with start/end and role.
CREATE TABLE mon.project_beneficiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES project.projects(id),
  beneficiary_id uuid NOT NULL REFERENCES mon.beneficiaries(id),
  role text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  land_area_ha numeric CHECK(land_area_ha>=0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id,beneficiary_id,role,start_date)
);

CREATE INDEX ON mon.project_beneficiaries (project_id);
CREATE INDEX ON mon.project_beneficiaries (beneficiary_id);

-- Person-level period participation enables distinct counts; age/youth is period-specific.
CREATE TABLE mon.participation_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_version_id uuid NOT NULL REFERENCES mon.submission_versions(id),
  beneficiary_id uuid NOT NULL REFERENCES mon.beneficiaries(id),
  role text NOT NULL,
  gender_at_period text,
  age_at_period integer CHECK(age_at_period BETWEEN 0 AND 120),
  is_youth boolean,
  participation_days numeric CHECK(participation_days>=0),
  job_phase text CHECK(job_phase IN ('construction','operation','agriculture','other')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(submission_version_id,beneficiary_id,role)
);

CREATE INDEX ON mon.participation_records (submission_version_id);
CREATE INDEX ON mon.participation_records (beneficiary_id);

-- Aggregate-only alternative when person data is unavailable; do not combine with person totals.
CREATE TABLE mon.inclusion_totals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_version_id uuid NOT NULL REFERENCES mon.submission_versions(id),
  population_code text NOT NULL,
  women integer NOT NULL CHECK(women>=0),
  men integer NOT NULL CHECK(men>=0),
  other_gender integer NOT NULL CHECK(other_gender>=0),
  gender_unknown integer NOT NULL CHECK(gender_unknown>=0),
  youth integer CHECK(youth>=0),
  households integer CHECK(households>=0),
  count_basis text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(submission_version_id,population_code),
  CHECK(youth IS NULL OR youth<=women+men+other_gender+gender_unknown)
);

CREATE INDEX ON mon.inclusion_totals (submission_version_id);

-- Income/receipts at declared project, FPO or household grain; transfer flows kept distinct.
CREATE TABLE mon.income_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_version_id uuid NOT NULL REFERENCES mon.submission_versions(id),
  scope_kind text NOT NULL CHECK(scope_kind IN ('project','fpo','household')),
  scope_key text NOT NULL,
  component text NOT NULL,
  amount_inr numeric(20,2) NOT NULL,
  accounting_basis text NOT NULL CHECK(accounting_basis IN ('gross_receipt','expense','net_income','transfer')),
  source_reference text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(submission_version_id,scope_kind,scope_key,component,accounting_basis)
);

CREATE INDEX ON mon.income_records (submission_version_id);

-- Land denominators and water inputs used in dual productivity; overlaps not blindly summed.
CREATE TABLE mon.land_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_version_id uuid NOT NULL REFERENCES mon.submission_versions(id),
  plot_code text NOT NULL,
  site_area_ha numeric NOT NULL CHECK(site_area_ha>0),
  solar_area_ha numeric CHECK(solar_area_ha>=0),
  cultivated_area_ha numeric CHECK(cultivated_area_ha>=0),
  water_used_m3 numeric CHECK(water_used_m3>=0),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(submission_version_id,plot_code),
  CHECK(solar_area_ha IS NULL OR solar_area_ha<=site_area_ha),
  CHECK(cultivated_area_ha IS NULL OR cultivated_area_ha<=site_area_ha)
);

CREATE INDEX ON mon.land_records (submission_version_id);

-- Nature-positive adoption and measured sustainability inputs.
CREATE TABLE mon.practice_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_version_id uuid NOT NULL REFERENCES mon.submission_versions(id),
  practice_id uuid NOT NULL REFERENCES core.practices(id),
  plot_code text NOT NULL DEFAULT 'site',
  adoption_status text NOT NULL CHECK(adoption_status IN ('adopted','not_adopted','unknown','not_applicable')),
  measured_value numeric,
  unit_id uuid REFERENCES core.units(id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(submission_version_id,practice_id,plot_code)
);

CREATE INDEX ON mon.practice_records (submission_version_id);
CREATE INDEX ON mon.practice_records (practice_id);
CREATE INDEX ON mon.practice_records (unit_id);

-- Actual programme linkage distinct from WP2 possible eligibility.
CREATE TABLE mon.scheme_linkages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_version_id uuid NOT NULL REFERENCES mon.submission_versions(id),
  policy_version_id uuid NOT NULL REFERENCES content.policy_versions(id),
  reference_number text NOT NULL,
  status text NOT NULL,
  benefit_inr numeric(20,2) CHECK(benefit_inr>=0),
  beneficiaries_count integer CHECK(beneficiaries_count>=0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(submission_version_id,policy_version_id,reference_number)
);

CREATE INDEX ON mon.scheme_linkages (submission_version_id);
CREATE INDEX ON mon.scheme_linkages (policy_version_id);

-- Implementation milestones and physical completion.
CREATE TABLE mon.progress_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_version_id uuid NOT NULL REFERENCES mon.submission_versions(id),
  milestone_code text NOT NULL,
  planned_date date,
  actual_date date,
  completion_pct numeric CHECK(completion_pct BETWEEN 0 AND 100),
  status text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(submission_version_id,milestone_code)
);

CREATE INDEX ON mon.progress_records (submission_version_id);

-- Evidence linked to return revision and indicator/record path; mandatory evidence checked on submit.
CREATE TABLE mon.evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_version_id uuid NOT NULL REFERENCES mon.submission_versions(id),
  file_id uuid NOT NULL REFERENCES data.files(id),
  indicator_version_id uuid REFERENCES mon.indicator_versions(id),
  record_path text NOT NULL,
  category text NOT NULL,
  caption text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(submission_version_id,file_id,record_path)
);

CREATE INDEX ON mon.evidence (submission_version_id);
CREATE INDEX ON mon.evidence (file_id);
CREATE INDEX ON mon.evidence (indicator_version_id);

-- Validation rule outcomes pinned to submitted payload hash.
CREATE TABLE mon.validation_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_version_id uuid NOT NULL REFERENCES mon.submission_versions(id),
  rule_code text NOT NULL,
  rule_version text NOT NULL,
  payload_hash text NOT NULL,
  severity text NOT NULL,
  passed boolean NOT NULL,
  message text NOT NULL,
  field_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON mon.validation_results (submission_version_id);

-- Append-only review actions and correction reasons; reviewer distinct from submitter unless explicitly permitted.
CREATE TABLE mon.review_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_version_id uuid NOT NULL REFERENCES mon.submission_versions(id),
  actor_id uuid NOT NULL REFERENCES iaa_auth.users(id),
  action text NOT NULL CHECK(action IN ('submit','return','resubmit','approve','reject','revoke','supersede')),
  reason text,
  field_comments jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK(action NOT IN ('return','reject','revoke') OR length(trim(reason))>0)
);

CREATE INDEX ON mon.review_events (submission_version_id);
CREATE INDEX ON mon.review_events (actor_id);

-- Approved calculation outputs retain numerator/denominator/method; weighted portfolio ratios recomputed.
CREATE TABLE mon.calculated_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_version_id uuid NOT NULL REFERENCES mon.submission_versions(id),
  indicator_version_id uuid NOT NULL REFERENCES mon.indicator_versions(id),
  method_version_id uuid NOT NULL REFERENCES plan.method_versions(id),
  result_key text NOT NULL DEFAULT 'site',
  value numeric,
  numerator numeric,
  denominator numeric,
  input_hash text NOT NULL,
  status text NOT NULL CHECK(status IN ('computed','cannot_assess')),
  explanation text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(submission_version_id,indicator_version_id,result_key)
);

CREATE INDEX ON mon.calculated_metrics (submission_version_id);
CREATE INDEX ON mon.calculated_metrics (indicator_version_id);
CREATE INDEX ON mon.calculated_metrics (method_version_id);

-- Separate approval from publication: authorised analytics or explicitly redacted public aggregate.
CREATE TABLE mon.releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_version_id uuid NOT NULL REFERENCES mon.submission_versions(id),
  approved_by uuid NOT NULL REFERENCES iaa_auth.users(id),
  audience text NOT NULL CHECK(audience IN ('authorised','public_aggregate')),
  field_whitelist jsonb NOT NULL,
  privacy_rule_version text NOT NULL,
  released_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON mon.releases (submission_version_id);
CREATE INDEX ON mon.releases (approved_by);

-- Append-only operational audit; opaque target is intentional, not a domain relationship.
CREATE TABLE ops.audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES iaa_auth.users(id),
  action text NOT NULL,
  target_table text NOT NULL,
  target_id uuid NOT NULL,
  request_id text NOT NULL,
  redacted_change jsonb NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON ops.audit_events (actor_id);

-- Reminder outbox with deduplication, retry state and delivery tracking.
CREATE TABLE ops.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES iaa_auth.users(id),
  obligation_id uuid REFERENCES mon.obligations(id),
  channel text NOT NULL CHECK(channel IN ('email','in_app')),
  template_code text NOT NULL,
  payload jsonb NOT NULL,
  scheduled_at timestamptz NOT NULL,
  sent_at timestamptz,
  status text NOT NULL DEFAULT 'pending',
  dedupe_key text NOT NULL UNIQUE,
  attempt_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON ops.notifications (recipient_id);
CREATE INDEX ON ops.notifications (obligation_id);

-- Asynchronous ingestion, GIS, planning and export job execution metadata.
CREATE TABLE ops.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  idempotency_key text NOT NULL UNIQUE,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'queued',
  attempt_count integer NOT NULL DEFAULT 0,
  locked_until timestamptz,
  finished_at timestamptz,
  error_code text,
  created_at timestamptz NOT NULL DEFAULT now()
);


-- One active dataset release; prior versions stay addressable by planning runs.
CREATE UNIQUE INDEX one_current_dataset_version ON data.dataset_versions(dataset_id) WHERE is_current;
ALTER TABLE data.dataset_versions ADD CHECK(NOT is_current OR status='approved');
-- One currently approved correction per logical return.
CREATE UNIQUE INDEX one_approved_return ON mon.submission_versions(submission_id) WHERE status='approved';
CREATE UNIQUE INDEX one_open_draft ON mon.submission_versions(submission_id) WHERE status='draft';
CREATE UNIQUE INDEX one_active_project_publication ON project.publications(project_version_id) WHERE revoked_at IS NULL;
CREATE UNIQUE INDEX one_active_monitoring_release ON mon.releases(submission_version_id,audience) WHERE revoked_at IS NULL;
CREATE INDEX facility_distance_gist ON wp1.facility_versions USING gist ((point::geography));
CREATE INDEX feeder_distance_gist ON wp1.feeder_versions USING gist ((point::geography));
CREATE INDEX substation_distance_gist ON wp1.substation_versions USING gist ((point::geography));
CREATE INDEX ON wp1.feeder_load_readings(feeder_id,observed_at);
CREATE INDEX ON ops.notifications(status,scheduled_at);
CREATE INDEX ON mon.obligations(assigned_to,due_at);
CREATE INDEX ON ops.audit_events(target_table,target_id,occurred_at);
CREATE UNIQUE INDEX users_email_ci ON iaa_auth.users(lower(email));

-- Explicit public projection: no personal contacts, evidence keys or commercial notes.
CREATE VIEW project.public_registry AS
SELECT p.id AS project_id, p.code, v.id AS project_version_id, v.name,
       v.area_id, v.model_id, v.typology_id, v.status, v.capacity_dc_mwp,
       CASE WHEN pub.public_fields ? 'point' THEN v.point ELSE NULL END AS point
FROM project.projects p JOIN project.versions v ON v.project_id=p.id
JOIN project.publications pub ON pub.project_version_id=v.id
WHERE NOT p.is_demo AND v.review_status='approved' AND pub.revoked_at IS NULL
AND pub.public_fields @> '["name","area_id","model_id","typology_id","status","capacity_dc_mwp"]'::jsonb;

-- INTERNAL ONLY: routes must additionally enforce authorised project/organisation scope.
CREATE VIEW mon.approved_return_versions AS
SELECT v.id,v.project_id,v.project_version_id,s.obligation_id,v.approved_at
FROM mon.submission_versions v JOIN mon.submissions s ON s.id=v.submission_id
WHERE v.status='approved' AND v.validation_status='passed'
AND EXISTS (SELECT 1 FROM mon.releases r WHERE r.submission_version_id=v.id
            AND r.audience='authorised' AND r.revoked_at IS NULL)
AND EXISTS (SELECT 1 FROM project.projects p WHERE p.id=v.project_id AND NOT p.is_demo);

-- No implicit table access for PUBLIC. Provision narrowly scoped API/worker roles separately.
REVOKE ALL ON ALL TABLES IN SCHEMA core FROM PUBLIC;
REVOKE ALL ON SCHEMA core FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA iaa_auth FROM PUBLIC;
REVOKE ALL ON SCHEMA iaa_auth FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA geo FROM PUBLIC;
REVOKE ALL ON SCHEMA geo FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA data FROM PUBLIC;
REVOKE ALL ON SCHEMA data FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA wp1 FROM PUBLIC;
REVOKE ALL ON SCHEMA wp1 FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA content FROM PUBLIC;
REVOKE ALL ON SCHEMA content FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA project FROM PUBLIC;
REVOKE ALL ON SCHEMA project FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA plan FROM PUBLIC;
REVOKE ALL ON SCHEMA plan FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA mon FROM PUBLIC;
REVOKE ALL ON SCHEMA mon FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA ops FROM PUBLIC;
REVOKE ALL ON SCHEMA ops FROM PUBLIC;
COMMIT;
