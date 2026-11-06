BEGIN;
CREATE VIEW wp1.api_map_features AS
SELECT * FROM wp1.api_features
UNION ALL
SELECT 'project'::text,r.project_id,r.name,r.status,r.area_id,r.point,NULL::uuid,false,NULL::date,NULL::date,
 jsonb_build_object('project_version_id',r.project_version_id,'capacity_dc_mwp',r.capacity_dc_mwp)
FROM project.public_registry r JOIN project.projects p ON p.id=r.project_id WHERE p.archived_at IS NULL;
CREATE INDEX ON mon.submission_versions(submission_id,status);
COMMIT;
