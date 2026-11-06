"""Generate a static, reviewed API column allowlist from the canonical SQL; never introspect user-selected tables."""
from pathlib import Path
import re,json
sql=Path('db/migrations/001_baseline.sql').read_text()
admin='core.organisations core.units core.models core.crops core.seasons core.practices core.locales core.translations geo.areas geo.boundaries geo.layers geo.features data.sources data.datasets data.dataset_versions data.coverage data.collection_tasks wp1.facilities wp1.substations wp1.feeders wp1.solar_installations wp1.facility_versions wp1.substation_versions wp1.feeder_versions wp1.feeder_load_readings wp1.solar_installation_versions wp1.land_statistics wp1.crop_production wp1.environment_observations wp1.agro_zones wp1.crop_suitability wp1.irrigation_statistics wp1.land_parcels content.resources content.resource_versions content.resource_areas content.policies content.policy_versions content.policy_areas plan.methods plan.method_versions plan.criteria mon.beneficiaries mon.periods mon.indicators mon.indicator_versions mon.form_versions mon.form_fields'.split()
profile='project.partners project.land_uses project.designs project.grid_connections project.crop_plans project.profile_notes project.documents'.split()
facts='mon.energy_records mon.harvest_records mon.participation_records mon.inclusion_totals mon.income_records mon.land_records mon.practice_records mon.scheme_linkages mon.progress_records mon.evidence'.split()
project='mon.baselines mon.project_beneficiaries mon.obligations'.split()
all_tables={}
for table,body in re.findall(r'CREATE TABLE ([\w.]+) \(\n(.*?)\n\);',sql,re.S):
 if table not in admin+profile+facts+project:continue
 columns={}
 for line in body.splitlines():
  m=re.match(r'  ([a-z_]+) (uuid|text|smallint|bigint|integer|numeric(?:\(\d+,\d+\))?|boolean|date|timestamptz|jsonb|geometry\([^)]*\))(.*)',line)
  if not m:continue
  name,kind,tail=m.groups();columns[name]={'type':kind,'required':('NOT NULL' in tail or 'PRIMARY KEY' in tail) and 'DEFAULT' not in tail,'nullable':not('NOT NULL' in tail or 'PRIMARY KEY' in tail),'default':'DEFAULT' in tail}
  ref=re.search(r'REFERENCES ([\w.]+)\(id\)',tail)
  if ref:columns[name]['references']=ref[1]
  vals=re.search(r"CHECK\(\w+ IN \(([^)]+)\)\)",tail)
  if vals:columns[name]['enum']=re.findall(r"'([^']+)'",vals[1])
 scope='admin' if table in admin else 'profile' if table in profile else 'submission' if table in facts else 'project'
 all_tables[table]={'scope':scope,'columns':columns}
Path('src/generated/resources.json').write_text(json.dumps(all_tables,indent=2)+'\n')
print('Generated',len(all_tables),'resource definitions')
