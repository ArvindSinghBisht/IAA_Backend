BEGIN;
-- Staging is intentionally private. Raw spreadsheet records are NOT auto-published.
CREATE SCHEMA ingest;
CREATE TABLE ingest.batches(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),file_sha256 text NOT NULL UNIQUE,source_name text NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE ingest.rows(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),batch_id uuid NOT NULL REFERENCES ingest.batches(id),source_collection text NOT NULL,source_row integer NOT NULL,payload jsonb NOT NULL,review_status text NOT NULL DEFAULT 'pending' CHECK(review_status IN ('pending','accepted','rejected')),UNIQUE(batch_id,source_collection,source_row));
REVOKE ALL ON SCHEMA ingest FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA ingest FROM PUBLIC;
INSERT INTO iaa_auth.roles(code,name) VALUES ('system_admin','System administrator'),('data_steward','Data steward'),('project_user','Project contributor'),('reviewer','Reviewer'),('management','Authorised management') ON CONFLICT(code) DO NOTHING;
CREATE INDEX facility_geography_idx ON wp1.facility_versions USING gist((point::geography));
CREATE INDEX feeder_geography_idx ON wp1.feeder_versions USING gist((point::geography));
CREATE INDEX substation_geography_idx ON wp1.substation_versions USING gist((point::geography));
-- Only approved, current, non-demo, public-permitted source versions are eligible.
CREATE VIEW wp1.api_features AS
SELECT 'facility'::text AS kind,f.id,f.name,f.facility_type AS subtype,v.area_id,v.point,dv.id AS dataset_version_id,dv.export_allowed,dv.reference_start,dv.reference_end,jsonb_build_object('capacity_value',v.capacity_value,'capacity_unit_id',v.capacity_unit_id,'location_accuracy',v.location_accuracy) AS attributes
FROM wp1.facilities f JOIN wp1.facility_versions v ON v.facility_id=f.id JOIN data.dataset_versions dv ON dv.id=v.dataset_version_id JOIN data.datasets d ON d.id=dv.dataset_id
WHERE d.is_active AND dv.status='approved' AND dv.is_current AND dv.public_allowed AND NOT dv.is_demo
UNION ALL
SELECT 'substation',f.id,f.name,'electric_substation',v.area_id,v.point,dv.id,dv.export_allowed,dv.reference_start,dv.reference_end,jsonb_build_object('capacity_mva',v.capacity_mva,'high_voltage_kv',v.high_voltage_kv,'low_voltage_kv',v.low_voltage_kv,'loading_pct',v.loading_pct)
FROM wp1.substations f JOIN wp1.substation_versions v ON v.substation_id=f.id JOIN data.dataset_versions dv ON dv.id=v.dataset_version_id JOIN data.datasets d ON d.id=dv.dataset_id
WHERE d.is_active AND dv.status='approved' AND dv.is_current AND dv.public_allowed AND NOT dv.is_demo
UNION ALL
SELECT 'feeder',f.id,f.name,'agricultural_electricity_feeder',v.area_id,v.point,dv.id,dv.export_allowed,dv.reference_start,dv.reference_end,jsonb_build_object('voltage_kv',v.voltage_kv,'sanctioned_mw',v.sanctioned_mw,'peak_load_mw',v.peak_load_mw,'approved_hosting_mw',v.approved_hosting_mw,'saidi_minutes',v.saidi_minutes,'saifi_count',v.saifi_count)
FROM wp1.feeders f JOIN wp1.feeder_versions v ON v.feeder_id=f.id JOIN data.dataset_versions dv ON dv.id=v.dataset_version_id JOIN data.datasets d ON d.id=dv.dataset_id
WHERE d.is_active AND dv.status='approved' AND dv.is_current AND dv.public_allowed AND NOT dv.is_demo;
COMMIT;
