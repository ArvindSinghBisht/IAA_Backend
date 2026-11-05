import {createRemoteJWKSet,jwtVerify} from 'jose';
import type { PoolClient } from 'pg';
import {query} from './db';
import {ApiError} from './http';
export type Actor={id:string;organisationId:string|null;roles:{code:string;organisation_id:string|null}[]};
let keys:ReturnType<typeof createRemoteJWKSet>|undefined;
export async function authenticate(req:Request):Promise<Actor>{
 const {OIDC_JWKS_URL,OIDC_ISSUER,OIDC_AUDIENCE}=process.env;
 if(!OIDC_JWKS_URL||!OIDC_ISSUER||!OIDC_AUDIENCE)throw new ApiError(503,'AUTH_NOT_CONFIGURED','Configure the identity provider before using protected APIs');
 const authorization=req.headers.get('authorization');if(!authorization?.startsWith('Bearer '))throw new ApiError(401,'UNAUTHENTICATED','A Bearer access token is required');
 let subject:string;try{keys??=createRemoteJWKSet(new URL(OIDC_JWKS_URL));const {payload}=await jwtVerify(authorization.slice(7),keys,{issuer:OIDC_ISSUER,audience:OIDC_AUDIENCE,algorithms:['RS256','ES256'],requiredClaims:['sub','exp','iat']});subject=payload.sub!}catch{throw new ApiError(401,'INVALID_TOKEN','Invalid or expired access token')}
 const user=(await query('SELECT id,organisation_id FROM iaa_auth.users WHERE identity_subject=$1 AND is_active=true',[subject])).rows[0];if(!user)throw new ApiError(403,'USER_NOT_PROVISIONED','Ask the administrator to provision this identity');
 const roles=(await query('SELECT r.code,ur.organisation_id FROM iaa_auth.user_roles ur JOIN iaa_auth.roles r ON r.id=ur.role_id WHERE ur.user_id=$1 AND (ur.expires_at IS NULL OR ur.expires_at>now())',[user.id])).rows;
 return{id:user.id,organisationId:user.organisation_id,roles};
}
export function isGlobal(actor:Actor){return actor.roles.some(r=>r.code==='system_admin'&&r.organisation_id===null)}
export async function projectAccess(actor:Actor,id:string,mode:'read'|'edit'|'review',client?:PoolClient){
 const execute=client?client.query.bind(client):query;
 const project=(await execute('SELECT owner_organisation_id FROM project.projects WHERE id=$1 AND archived_at IS NULL',[id])).rows[0];if(!project)throw new ApiError(404,'NOT_FOUND','Project not found');
 if(isGlobal(actor))return;
 const allowedRoles=mode==='review'?['reviewer']:mode==='edit'?['project_user','data_steward']:['project_user','reviewer','data_steward','management'];
 const allowed=actor.roles.some(r=>allowedRoles.includes(r.code)&&r.organisation_id===project.owner_organisation_id);
 const member=mode==='review'?false:(await execute('SELECT 1 FROM project.memberships m JOIN iaa_auth.roles r ON r.id=m.role_id WHERE m.project_id=$1 AND m.user_id=$2 AND (m.valid_until IS NULL OR m.valid_until>now()) AND r.code=ANY($3::text[])',[id,actor.id,allowedRoles])).rowCount!>0;
 if(!allowed&&!member)throw new ApiError(403,'FORBIDDEN','No permission for this project');
}
