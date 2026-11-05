import{test}from'node:test';import assert from'node:assert/strict';import type{PoolClient}from'pg';
import{projectAccess,type Actor}from'../src/lib/auth';
const a=(code:string,org:string|null):Actor=>({id:'user-1',organisationId:org,roles:[{code,organisation_id:org}]});
const db={query:async(text:string)=>({rows:text.includes('owner_organisation_id')?[{owner_organisation_id:'org-A'}]:[],rowCount:0})} as unknown as PoolClient;
test('Cross-organisation reviewer cannot read or review a project',async()=>{await assert.rejects(()=>projectAccess(a('reviewer','org-B'),'project-1','review',db));await assert.rejects(()=>projectAccess(a('project_user','org-B'),'project-1','read',db))});
test('Contributor cannot approve even in the same organisation',async()=>assert.rejects(()=>projectAccess(a('project_user','org-A'),'project-1','review',db)));
test('Scoped reviewer and global administrator are allowed in their intended scope',async()=>{await projectAccess(a('reviewer','org-A'),'project-1','review',db);await projectAccess(a('system_admin',null),'project-1','review',db)});
