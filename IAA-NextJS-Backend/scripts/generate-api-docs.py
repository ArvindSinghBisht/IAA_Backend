from pathlib import Path
import json
resources=json.loads(Path('src/generated/resources.json').read_text())
api={'openapi':'3.1.0','info':{'title':'IAA portal backend','version':'0.3.0','description':'WP1 GIS, WP2 versioned planning and WP3 governed monitoring. See START_HERE.md for setup and method limitations.'},'servers':[{'url':'http://localhost:3000/api/v1'}],'components':{'securitySchemes':{'bearerAuth':{'type':'http','scheme':'bearer','bearerFormat':'JWT'},'planningToken':{'type':'apiKey','in':'header','name':'X-Planning-Token'}},'schemas':{}},'paths':{}}
reserved={'id','created_at','approved_at','approved_by'}
states={'data.dataset_versions','mon.form_versions','plan.method_versions'}
for table,d in resources.items():
 props={};req=[]
 for n,c in d['columns'].items():
  if n in reserved or table in states and n in {'status','is_current','public_allowed','planning_allowed','export_allowed'}:continue
  t=c['type'];s={'type':'string'}
  if t=='uuid':s={'type':'string','format':'uuid'}
  elif t in ['smallint','integer','bigint']:s={'type':'integer'}
  elif t.startswith('numeric'):s={'type':'number'}
  elif t=='boolean':s={'type':'boolean'}
  elif t=='date':s={'type':'string','format':'date'}
  elif t=='timestamptz':s={'type':'string','format':'date-time'}
  elif t=='jsonb':s={}
  elif t.startswith('geometry'):s={'type':'object','description':'GeoJSON Geometry in EPSG:4326; not a Feature or FeatureCollection','required':['type','coordinates'],'properties':{'type':{'type':'string','enum':['Point','LineString','MultiLineString','Polygon','MultiPolygon']},'coordinates':{'type':'array'}}}
  if 'enum' in c:s['enum']=c['enum']
  if c.get('references'):s['description']=s.get('description','')+' References '+c['references']
  if c['nullable']:s={'anyOf':[s,{'type':'null'}]}
  props[n]=s
  if c['required']:req.append(n)
 schema={'type':'object','additionalProperties':False,'properties':props,'required':req}
 api['components']['schemas'][table]=schema
 root='/manage/resources/'+table
 responses={'200':{'description':'Success'},'400':{'description':'Invalid fields'},'401':{'description':'Authentication required'},'403':{'description':'Outside role/project scope'},'409':{'description':'Immutable, referenced or duplicate record'},'422':{'description':'Validation or database constraint'}}
 parent=d['scope']!='admin'
 api['paths'][root]={'get':{'summary':'List '+table,'tags':['Resources: '+d['scope']],'security':[{'bearerAuth':[]}],'parameters':[{'name':'limit','in':'query','schema':{'type':'integer','minimum':1,'maximum':200}},{'name':'offset','in':'query','schema':{'type':'integer','minimum':0}},*([{'name':'parentId','in':'query','required':True,'schema':{'type':'string','format':'uuid'}}] if parent else [])],'responses':responses},'post':{'summary':'Create '+table,'tags':['Resources: '+d['scope']],'security':[{'bearerAuth':[]}],'requestBody':{'required':True,'content':{'application/json':{'schema':{'$ref':'#/components/schemas/'+table}}}},'responses':{**responses,'201':{'description':'Created'}}}}
 api['paths'][root+'/{id}']={'parameters':[{'name':'id','in':'path','required':True,'schema':{'type':'string','format':'uuid'}}],'patch':{'summary':'Update mutable '+table+' fields','tags':['Resources: '+d['scope']],'security':[{'bearerAuth':[]}],'requestBody':{'required':True,'content':{'application/json':{'schema':{**schema,'required':[]}}}},'responses':responses}}
 if parent:api['paths'][root+'/{id}']['delete']={'summary':'Delete draft/scoped '+table+' record','tags':['Resources: '+d['scope']],'security':[{'bearerAuth':[]}],'responses':responses}
# Explicit application workflows; their payload examples and semantics are in docs/WORKFLOWS.md.
endpoints=[
('GET','/health','public'),('GET','/ready','public'),('GET','/wp1/home','public'),('GET','/wp1/areas','public'),('GET','/wp1/areas/{id}/boundary','public'),('GET','/wp1/search','public'),('GET','/wp1/features','public'),('GET','/wp1/nearby','public'),('GET','/wp1/layers','public'),('GET','/wp1/layers/{id}/features','public'),('GET','/wp1/projects','public'),('GET','/wp1/projects/{id}','public'),('GET','/wp1/districts/{id}','public'),('GET','/wp1/districts/{id}/{domain}','public'),('POST','/wp1/compare','public'),('GET','/wp1/datasets','public'),('GET','/wp1/datasets/{id}','public'),('GET','/wp1/resources','public'),('GET','/wp1/policies','public'),('GET','/wp1/files/{id}','public'),('GET','/wp1/exports/{id}/{resource}','public'),('GET','/reference/{kind}','public'),
('POST','/wp2/estimate-energy','public'),('GET','/wp2/engines','public'),('POST','/wp2/assessments','public'),('GET','/wp2/assessments/{id}','planning'),('POST','/wp2/assessments/{id}/scenarios','planning'),('POST','/wp2/assessments/{id}/runs','planning'),('GET','/wp2/assessments/{id}/runs','planning'),('GET','/wp2/assessments/{id}/report','planning'),
('GET','/auth/me','user'),('GET','/internal/projects','user'),('POST','/internal/projects','user'),('GET','/internal/projects/{id}','user'),('GET','/internal/profiles/{id}','user'),('PATCH','/internal/profiles/{id}','user'),('POST','/internal/profiles/{id}/notes','user'),('POST','/internal/profiles/{id}/transition','user'),('POST','/internal/profiles/{id}/revise','user'),
('POST','/files','user'),('GET','/files/{id}','user'),('POST','/files/{id}/review','admin'),('GET','/admin/users','admin'),('POST','/admin/users','admin'),('POST','/admin/users/{id}/deactivate','admin'),('POST','/admin/projects/{id}/memberships','admin'),('GET','/admin/audit','admin'),('POST','/admin/reminders','admin'),('POST','/admin/datasets/{id}/transition','admin'),('POST','/admin/definitions/{kind}/{id}','admin'),('POST','/admin/imports','admin'),('GET','/admin/imports/{id}/rows','admin'),('POST','/admin/issues/{id}/resolve','admin'),('GET','/manage/resources','admin'),
('GET','/wp3/projects/{id}/obligations','user'),('GET','/wp3/projects/{id}/dashboard','user'),('GET','/wp3/obligations/{id}/form','user'),('POST','/wp3/submissions','user'),('GET','/wp3/submissions/{id}','user'),('PUT','/wp3/submissions/{id}/values','user'),('POST','/wp3/submissions/{id}/validate','user'),('POST','/wp3/submissions/{id}/transition','user'),('POST','/wp3/submissions/{id}/correct','user'),('POST','/wp3/submissions/{id}/release','user'),('GET','/wp3/submissions/{id}/history','user'),('GET','/wp3/submissions/{id}/records/{kind}','user'),('POST','/wp3/submissions/{id}/records/{kind}','user'),('DELETE','/wp3/submissions/{id}/records/{kind}/{recordId}','user'),
('GET','/queries','user'),('POST','/queries','user'),('POST','/queries/{id}/answer','admin'),('GET','/notifications','user'),('POST','/notifications/{id}/read','user')]
import re
manifest=json.loads(Path('src/generated/route-manifest.json').read_text())
endpoints=[(r['method'],'/'+re.sub(r'\[([^]]+)\]',r'{\1}',r['path']), 'public' if r['access']=='public' else 'planning' if r['access']=='planning' else 'user') for r in manifest]
for method,path,scope in endpoints:
 params=[{'name':x,'in':'path','required':True,'schema':{'type':'string'}} for x in re.findall(r'\{(\w+)\}',path)]
 op={'summary':method+' '+path,'tags':[scope],'security':[] if scope=='public' else [{'planningToken':[]}] if scope=='planning' else [{'bearerAuth':[]}],'parameters':params,'responses':{'200':{'description':'Success; see docs/WORKFLOWS.md for response details'},'400':{'description':'Invalid input'},'403':{'description':'Permission denied'},'409':{'description':'Invalid workflow state'},'422':{'description':'Validation failed'}}}
 if method in ['POST','PUT','PATCH']:op['requestBody']={'content':{'application/json':{'schema':{'type':'object','description':'Validated by service-specific Zod schema. Concrete examples in docs/WORKFLOWS.md.'}}}}
 if path=='/files' and method=='POST':op['requestBody']={'required':True,'content':{'application/octet-stream':{'schema':{'type':'string','format':'binary'}}},'description':'Raw file bytes, Content-Type matching supported MIME and X-File-Name header; max 5 MiB.'}
 api['paths'].setdefault(path,{})[method.lower()]=op
Path('docs/openapi.json').write_text(json.dumps(api,indent=2)+'\n')
lines=['# Resource API index','','All endpoints start `/api/v1`. Use `/manage/resources/<resource>` for GET/POST and `/manage/resources/<resource>/<record-id>` for PATCH. DELETE is enabled only on scoped resources. Reference/configuration rows are retired or superseded rather than deleted.','','| Resource | Scope | List parentId |','| --- | --- | --- |']
for table,d in resources.items():lines.append(f"| `{table}` | {d['scope']} | "+({'admin':'Not required','profile':'Project version UUID','submission':'Submission revision UUID','project':'Project UUID'}[d['scope']])+' |')
lines+=['','The checked-in OpenAPI file contains exact writable columns and required fields for each resource. SQL constraints enforce units/ranges/references. State and approval fields are controlled by workflow endpoints.','',f'{len(resources)} allowlisted resources; {len(endpoints)} explicit workflow/public routes. This is not arbitrary SQL/table access.']
Path('docs/RESOURCE_APIS.md').write_text('\n'.join(lines)+'\n')
collection={'info':{'name':'IAA backend 0.3','schema':'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'},'variable':[{'key':'baseUrl','value':'http://localhost:3000/api/v1'},{'key':'accessToken','value':''},{'key':'planningToken','value':''}],'item':[]}
for method,path,scope in endpoints:
 headers=[] if scope=='public' else [{'key':'X-Planning-Token','value':'{{planningToken}}'}] if scope=='planning' else [{'key':'Authorization','value':'Bearer {{accessToken}}'}]
 collection['item'].append({'name':method+' '+path,'request':{'method':method,'header':headers,'url':'{{baseUrl}}'+re.sub(r'\{(\w+)\}',r':\1',path)}})
Path('docs/IAA.postman_collection.json').write_text(json.dumps(collection,indent=2)+'\n')
print(f'Generated OpenAPI and Postman index: {len(resources)} resources, {len(endpoints)} workflow routes')
