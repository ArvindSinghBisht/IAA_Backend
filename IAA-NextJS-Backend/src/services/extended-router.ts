import {myProjects} from './project-editor';
import * as inquiries from './queries';
import {authenticate} from '@/lib/auth';
import {body,response} from '@/lib/http';
import {resources,resourceList,resourceWrite} from './resources';
import {admin} from '@/lib/governance';
import * as project from './project-workflow';
import * as governance from './admin-workflow';
import * as files from './files';
import * as imports from './imports';
import * as monitor from './monitoring';
import * as gis from './gis';
import * as users from './administration';
import * as reporting from './reporting';
import {implementations,implementationDigest} from './planning-engines';
export async function extended(req:Request,path:string[]):Promise<Response|undefined>{const method=req.method,route=path.join('/'),params=Object.fromEntries(new URL(req.url).searchParams);
 if(method==='GET'){
 if(path[0]==='wp1'&&path[1]==='files'&&path.length===3)return files.publicDownload(path[2]);
 if(route==='wp1/home')return response(await gis.home());
 if(route==='wp1/search')return response(await gis.search(params));
 if(route==='wp1/layers')return response(await gis.layers());
 if(path[0]==='wp1'&&path[1]==='layers'&&path[3]==='features'&&path.length===4)return response(await gis.layerFeatures(path[2],params));
 if(path[0]==='wp1'&&path[1]==='districts'&&path.length===4)return response(await gis.districtDomain(path[2],path[3],params));
 if(path[0]==='wp1'&&path[1]==='areas'&&path[3]==='boundary'&&path.length===4)return response(await gis.boundary(path[2]));
 if(path[0]==='wp1'&&path[1]==='projects'&&path.length===3)return response(await gis.publicProfile(path[2]));
 if(path[0]==='wp1'&&path[1]==='exports'&&path.length===4)return gis.exportDataset(path[2],path[3],params);
 if(route==='wp2/engines')return response({data:implementations.map(implementation=>({implementation,codeDigest:implementationDigest(implementation)}))});
 if(path[0]==='wp2'&&path[1]==='assessments'&&path[3]==='report'&&path.length===4)return response(await reporting.planningReport(path[2],req.headers.get('x-planning-token')));
 }
 if(method==='POST'&&route==='wp1/compare')return response(await gis.compare(await body(req)));
 if(path[0]==='manage'&&path[1]==='resources'&&path.length>=3&&path.length<=4){const a=await authenticate(req),key=path[2];if(method==='GET'&&path.length===3)return response(await resourceList(a,key,params));if(method==='POST'&&path.length===3)return response({data:await resourceWrite(a,key,await body(req))},201);if(method==='PATCH'&&path.length===4)return response({data:await resourceWrite(a,key,await body(req),path[3])});if(method==='DELETE'&&path.length===4)return response({data:await resourceWrite(a,key,{},path[3],true)});}
 if(route==='internal/projects'&&method==='GET')return response(await myProjects(await authenticate(req)));
 if(path[0]==='admin'&&path[1]==='projects'&&path[3]==='memberships'&&path.length===4&&method==='POST')return response({data:await users.membership(await authenticate(req),path[2],await body(req))});
 if(route==='queries'){const a=await authenticate(req);if(method==='GET')return response(await inquiries.listQueries(a));if(method==='POST')return response({data:await inquiries.ask(a,await body(req))},201);}
 if(path[0]==='queries'&&path[2]==='answer'&&path.length===3&&method==='POST')return response({data:await inquiries.answer(await authenticate(req),path[1],await body(req))});
 if(route==='manage/resources'&&method==='GET'){const a=await authenticate(req);admin(a);return response({data:resources});}
 if(path[0]==='internal'&&path[1]==='profiles'&&path.length>=3&&path.length<=4){const a=await authenticate(req);if(method==='PATCH'&&path.length===3)return response({data:await project.updateProfile(a,path[2],await body(req))});if(method==='POST'&&path[3]==='transition')return response({data:await project.profileTransition(a,path[2],await body(req))});if(method==='POST'&&path[3]==='revise')return response({data:await project.reviseProfile(a,path[2],await body(req))},201);}
 if(path[0]==='files'){const a=await authenticate(req);if(method==='POST'&&path.length===1)return response({data:await files.upload(a,req)},201);if(method==='GET'&&path.length===2)return files.download(a,path[1]);if(method==='POST'&&path.length===3&&path[2]==='review')return response({data:await files.reviewFile(a,path[1],await body(req))});}
 if(path[0]==='admin'){const a=await authenticate(req);if(method==='GET'&&route==='admin/users')return response(await users.users(a));if(method==='POST'&&route==='admin/users')return response({data:await users.provision(a,await body(req))},201);if(method==='POST'&&path[1]==='users'&&path[3]==='deactivate'&&path.length===4)return response({data:await users.deactivate(a,path[2])});if(method==='GET'&&route==='admin/audit')return response(await governance.auditLog(a));if(method==='POST'&&route==='admin/reminders')return response({data:await users.reminders(a)});if(method==='POST'&&path[1]==='datasets'&&path[3]==='transition'&&path.length===4)return response({data:await governance.datasetTransition(a,path[2],await body(req))});if(method==='POST'&&path[1]==='definitions'&&path.length===4)return response({data:await governance.approveDefinition(a,path[2],path[3],await body(req))});if(method==='POST'&&route==='admin/imports')return response({data:await imports.runImport(a,await body(req))},201);if(method==='GET'&&path[1]==='imports'&&path[3]==='rows'&&path.length===4)return response(await imports.importRows(a,path[2],params));if(method==='POST'&&path[1]==='issues'&&path[3]==='resolve'&&path.length===4)return response({data:await imports.resolveIssue(a,path[2],await body(req))});}
 if(path[0]==='wp3'&&path[1]==='submissions'&&path.length===4){const a=await authenticate(req);if(method==='POST'&&path[3]==='validate')return response({data:await monitor.validateRevision(a,path[2])});if(method==='POST'&&path[3]==='correct')return response({data:await monitor.correction(a,path[2],await body(req))},201);if(method==='POST'&&path[3]==='release')return response({data:await reporting.release(a,path[2],await body(req))});if(method==='GET'&&path[3]==='history')return response(await reporting.history(a,path[2]));}
 if(method==='GET'&&path[0]==='wp3'&&path[1]==='projects'&&path[3]==='dashboard'&&path.length===4)return response(await reporting.monitoringDashboard(await authenticate(req),path[2]));
 if(method==='GET'&&route==='notifications')return response(await users.notifications(await authenticate(req)));
 if(method==='POST'&&path[0]==='notifications'&&path[2]==='read'&&path.length===3)return response({data:await users.acknowledge(await authenticate(req),path[1])});
 return undefined;
}
