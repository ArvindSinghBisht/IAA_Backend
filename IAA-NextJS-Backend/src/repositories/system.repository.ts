import { execute } from "@/infrastructure/database/connection";
export const ping = () => execute("SELECT 1 AS ready");
export const projectVersions = (id: string) =>
  execute(
    `SELECT id,revision,name,status,review_status,area_id,capacity_dc_mwp,capacity_ac_mw,site_area_ha,cultivated_area_ha,ST_AsGeoJSON(point)::jsonb AS geometry FROM project.versions WHERE project_id=$1 ORDER BY revision DESC`,
    [id],
  );
export const revision = (id: string) =>
  execute(
    "SELECT id,project_id,status,revision,submitted_at,approved_at FROM mon.submission_versions WHERE id=$1",
    [id],
  );
export const values = (id: string) =>
  execute(
    "SELECT indicator_version_id,repeat_key,value_number,value_text,value_boolean,value_date,value_json,missing_reason FROM mon.indicator_values WHERE submission_version_id=$1 ORDER BY indicator_version_id,repeat_key",
    [id],
  );
