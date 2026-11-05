import {publicPlanningLimit} from '@/lib/rate-limit';
import {extended} from '@/services/extended-router';
import {z} from 'zod';
import * as catalogue from '@/services/catalogue';
import * as planning from '@/services/planning';
import * as profiles from '@/services/project-editor';
import * as facts from '@/services/monitoring-records';
import {handle,response,body,pageQuery,uuid,ApiError} from '@/lib/http';
import {query} from '@/lib/db';
import {authenticate,projectAccess} from '@/lib/auth';
import * as publicData from '@/services/public-data';
import {estimateEnergy} from '@/services/calculations';
import {createDraft,saveValue,transition} from '@/services/monitoring';
export const runtime='nodejs';
export const dynamic='force-dynamic';
type Context={params:Promise<{path:string[]}>};
export async function GET(req:Request,context:Context){return handle(async()=>{const {path}=await context.params,route=path.join('/'),params=Object.fromEntries(new URL(req.url).searchParams);const extra=await extended(req,path);if(extra)return extra;
 if(route==='health')return response({status:'ok',service:'iaa-api',version:'0.2.0'});
 if(route==='ready'){await query('SELECT 1');return response({status:'ready'})}
 if(route==='wp1/areas')return response(await publicData.areas(params));
 if(route==='wp1/projects')return response(await publicData.projects(params));
 if(route==='wp1/demo-project'){if(process.env.NODE_ENV!=='development')throw new ApiError(404,'NOT_FOUND','API route not found');return response(await publicData.demoProject())}
 if(path[0]==='wp1'&&path[1]==='projects'&&path.length===3)return response(await publicData.projectPublic(path[2]));
 if(route==='wp1/features'||route==='wp1/search')return response(await publicData.features(params));
 if(route==='wp1/nearby')return response(await publicData.nearby(params));
 if(route==='wp1/datasets')return response(await publicData.datasets());
 if(path[0]==='wp1'&&['resources','policies'].includes(path[1])&&path.length===2)return response(await catalogue.catalogue(path[1],params));
 if(path[0]==='wp1'&&path[1]==='districts'&&path.length===3)return response(await catalogue.district(path[2],params));
 if(path[0]==='wp1'&&path[1]==='datasets'&&path.length===3)return response(await catalogue.datasetDetail(path[2]));
 if(path[0]==='reference'&&path.length===2)return response(await catalogue.masters(path[1]));
 if(path[0]==='wp2'&&path[1]==='assessments'&&path.length===3)return response({data:await planning.getAssessment(path[2],req.headers.get('x-planning-token'))});
 if(path[0]==='wp2'&&path[1]==='assessments'&&path[3]==='runs'&&path.length===4)return response({data:await planning.getRuns(path[2],req.headers.get('x-planning-token'))});
 if(path[0]==='internal'&&path[1]==='profiles'&&path.length===3)return response({data:await profiles.getProfile(await authenticate(req),path[2])});
 if(path[0]==='wp3'&&path[1]==='projects'&&path[3]==='obligations'&&path.length===4)return response({data:await facts.obligations(await authenticate(req),path[2])});
 if(path[0]==='wp3'&&path[1]==='obligations'&&path[3]==='form'&&path.length===4)return response({data:await facts.form(await authenticate(req),path[2])});
 if(path[0]==='wp3'&&path[1]==='submissions'&&path[3]==='records'&&path.length===5)return response({data:await facts.records(await authenticate(req),path[2],path[4])});
 if(route==='auth/me'){const a=await authenticate(req);return response({data:a})}
 if(path[0]==='internal'&&path[1]==='projects'&&path.length===3){const id=uuid.parse(path[2]),a=await authenticate(req);await projectAccess(a,id,'read');return response({data:(await query(`SELECT id,revision,name,status,review_status,area_id,capacity_dc_mwp,capacity_ac_mw,site_area_ha,cultivated_area_ha,ST_AsGeoJSON(point)::jsonb AS geometry FROM project.versions WHERE project_id=$1 ORDER BY revision DESC`,[id])).rows})}
 if(path[0]==='wp3'&&path[1]==='submissions'&&path.length===3){const id=uuid.parse(path[2]),a=await authenticate(req),v=(await query('SELECT id,project_id,status,revision,submitted_at,approved_at FROM mon.submission_versions WHERE id=$1',[id])).rows[0];if(!v)throw new ApiError(404,'NOT_FOUND','Revision not found');await projectAccess(a,v.project_id,'read');return response({data:{...v,values:(await query('SELECT indicator_version_id,repeat_key,value_number,value_text,value_boolean,missing_reason FROM mon.indicator_values WHERE submission_version_id=$1',[id])).rows}})}
 throw new ApiError(404,'NOT_FOUND','API route not found')})}
export async function POST(req:Request,context:Context){return handle(async()=>{const {path}=await context.params,route=path.join('/');await publicPlanningLimit(req);const extra=await extended(req,path);if(extra)return extra;if(route==='wp2/estimate-energy')return response({data:estimateEnergy(await body(req))});if(route==='wp2/assessments')return response({data:await planning.createAssessment(await body(req))},201);
if(path[0]==='wp2'&&path[1]==='assessments'&&path.length===4){if(path[3]==='scenarios')return response({data:await planning.saveScenario(path[2],req.headers.get('x-planning-token'),await body(req))},201);if(path[3]==='runs')return response({data:await planning.runScenario(path[2],req.headers.get('x-planning-token'),await body(req))},201);}
const a=await authenticate(req);
if(route==='internal/projects')return response({data:await profiles.createProject(a,await body(req))},201);
if(path[0]==='internal'&&path[1]==='profiles'&&path[3]==='notes'&&path.length===4)return response({data:await profiles.saveNote(a,path[2],await body(req))});
if(path[0]==='wp3'&&path[1]==='submissions'&&path[3]==='records'&&path.length===5)return response({data:await facts.addRecord(a,path[2],path[4],await body(req))},201);
if(route==='wp3/submissions')return response({data:await createDraft(a,await body(req))},201);if(path[0]==='wp3'&&path[1]==='submissions'&&path[3]==='transition'&&path.length===4)return response({data:await transition(a,path[2],await body(req))});throw new ApiError(404,'NOT_FOUND','API route not found')})}
export async function PUT(req:Request,context:Context){return handle(async()=>{const {path}=await context.params;const extra=await extended(req,path);if(extra)return extra;const a=await authenticate(req);if(path[0]==='wp3'&&path[1]==='submissions'&&path[3]==='values'&&path.length===4)return response({data:await saveValue(a,path[2],await body(req))});throw new ApiError(404,'NOT_FOUND','API route not found')})}
export async function DELETE(req:Request,context:Context){return handle(async()=>{const {path}=await context.params;const extra=await extended(req,path);if(extra)return extra;if(path[0]==='wp3'&&path[1]==='submissions'&&path[3]==='records'&&path.length===6)return response({data:await facts.deleteRecord(await authenticate(req),path[2],path[4],path[5])});throw new ApiError(404,'NOT_FOUND','API route not found')})}

export async function PATCH(req:Request,context:Context){return handle(async()=>{const {path}=await context.params;const extra=await extended(req,path);if(extra)return extra;throw new ApiError(404,'NOT_FOUND','API route not found')})}
