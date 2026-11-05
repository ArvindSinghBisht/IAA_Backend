import 'dotenv/config';
import pg from 'pg';
import {pgConfig} from '../src/lib/pg-config';

if(process.env.ALLOW_DEMO_SEED!=='true')throw new Error('Set ALLOW_DEMO_SEED=true for an isolated development database only');
if(!process.env.MIGRATION_DATABASE_URL)throw new Error('MIGRATION_DATABASE_URL required');

const c=new pg.Client(pgConfig(process.env.MIGRATION_DATABASE_URL));
await c.connect();
try {
  await c.query('BEGIN');
  const org=(await c.query("INSERT INTO core.organisations(code,name,organisation_type) VALUES('IAA-DEMO','IAA development organisation','development') ON CONFLICT(code) DO UPDATE SET name=excluded.name RETURNING id")).rows[0];
  for(const [subject,email,name,role] of [['iaa-demo-admin','admin@example.invalid','Demo administrator','system_admin'],['iaa-demo-reviewer','reviewer@example.invalid','Demo reviewer','system_admin'],['iaa-demo-contributor','contributor@example.invalid','Demo contributor','project_user']]) {
    const u=(await c.query('INSERT INTO iaa_auth.users(identity_subject,email,display_name,organisation_id) VALUES($1,$2,$3,$4) ON CONFLICT(identity_subject) DO UPDATE SET display_name=excluded.display_name RETURNING id',[subject,email,name,org.id])).rows[0];
    await c.query('INSERT INTO iaa_auth.user_roles(user_id,role_id,organisation_id) SELECT $1,id,$2 FROM iaa_auth.roles WHERE code=$3 ON CONFLICT DO NOTHING',[u.id,role==='system_admin'?null:org.id,role]);
  }

  const state=(await c.query("INSERT INTO geo.areas(code_system,code,name,level) VALUES('DEMO','ST','Rajasthan','state') ON CONFLICT(code_system,code) DO UPDATE SET name=excluded.name RETURNING id")).rows[0];
  const district=(await c.query("INSERT INTO geo.areas(code_system,code,name,level,parent_id) VALUES('DEMO','DIST','Jodhpur', 'district',$1) ON CONFLICT(code_system,code) DO UPDATE SET name=excluded.name,parent_id=excluded.parent_id RETURNING id",[state.id])).rows[0];
  for(const [table,code,name,extra] of [['core.units','MW','Megawatt',"dimension"],['core.crops','WHEAT','Wheat',null],['core.crops','BAJRA','Pearl millet (example)',null],['core.seasons','RABI','Rabi',null],['core.seasons','KHARIF','Kharif (example)',null],['core.locales','en','English',null]]) {
    await c.query(`INSERT INTO ${table}(code,name${extra?',dimension':''}) VALUES($1,$2${extra?",'power'":''}) ON CONFLICT(code) DO UPDATE SET name=excluded.name`,[code,name]);
  }

  const contributor=(await c.query("SELECT id FROM iaa_auth.users WHERE identity_subject='iaa-demo-contributor'")).rows[0];
  await c.query("INSERT INTO project.projects(code,owner_organisation_id,created_by,is_demo) VALUES('WP1-DEMO-001',$1,$2,true) ON CONFLICT(code) DO NOTHING",[org.id,contributor.id]);
  const project=(await c.query("SELECT id,owner_organisation_id,is_demo FROM project.projects WHERE code='WP1-DEMO-001'")).rows[0];
  if(!project || project.is_demo!==true || project.owner_organisation_id!==org.id)throw new Error('WP1-DEMO-001 already exists outside the isolated demo organisation');

  const existingVersion=(await c.query('SELECT id FROM project.versions WHERE project_id=$1 ORDER BY revision DESC LIMIT 1',[project.id])).rows[0];
  let version=existingVersion;
  if(!version) {
    version=(await c.query(`INSERT INTO project.versions(project_id,area_id,revision,name,status,point,capacity_dc_mwp,site_area_ha,cultivated_area_ha,agripv_footprint_ha,summary,effective_from)
      VALUES($1,$2,1,'Illustrative sample — Jodhpur AgriPV site','planned',ST_SetSRID(ST_MakePoint(73.08,26.3),4326),0.6,2.4,1.8,1.5,
      'Illustrative development-only record. Capacity, areas, crop and map point are dummy examples and are not site-verified. No observations, evidence, approval or public release.',
      '2025-01-01') RETURNING id`,[project.id,district.id])).rows[0];
  }

  const crop=(await c.query("SELECT id FROM core.crops WHERE code='BAJRA'")).rows[0];
  const season=(await c.query("SELECT id FROM core.seasons WHERE code='KHARIF'")).rows[0];
  await c.query(`INSERT INTO project.crop_plans(project_version_id,crop_id,season_id,agricultural_year,area_ha,selection_rationale)
    VALUES($1,$2,$3,'2025-demo',1.8,'Illustrative only; no crop observations or site assessment.')
    ON CONFLICT(project_version_id,crop_id,season_id,plot_code,agricultural_year) DO NOTHING`,[version.id,crop.id,season.id]);
  await c.query(`INSERT INTO project.designs(project_version_id,array_code,mounting_type)
    VALUES($1,'DEMO-ARRAY','Elevated (example)')
    ON CONFLICT(project_version_id,array_code) DO NOTHING`,[version.id]);

  await c.query('COMMIT');
  console.log('Development references and WP1 illustrative draft created; it is not publicly released.');
} catch(e) {
  await c.query('ROLLBACK');
  throw e;
} finally {
  await c.end();
}
