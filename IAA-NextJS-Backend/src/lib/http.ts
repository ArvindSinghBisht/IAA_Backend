import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import pino from 'pino';
import {readBytes} from './request-body';
export class ApiError extends Error {constructor(public status:number,public code:string,message:string){super(message)}}
const log=pino({level:process.env.LOG_LEVEL||'info'});
export async function body(req:Request){const text=(await readBytes(req,262144)).toString('utf8');try{return JSON.parse(text)}catch{throw new ApiError(400,'INVALID_JSON','Provide valid JSON')}}
export function response(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
export async function handle(fn:()=>Promise<Response>){const requestId=randomUUID();try{const r=await fn();r.headers.set('X-Request-Id',requestId);return r}catch(e){let status=500,code='INTERNAL_ERROR',message='Request failed';if(e instanceof z.ZodError){status=400;code='VALIDATION_ERROR';message=e.issues.map(x=>`${x.path.join('.')}: ${x.message}`).join('; ')}else if(e instanceof ApiError){({status,code,message}=e)}else if(e&&typeof e==='object'&&'code' in e&&['23505','23503','23514','23502','22P02','22003'].includes(String(e.code))){status=String(e.code)==='23505'?409:422;code='DATABASE_CONSTRAINT';message='Duplicate record, invalid reference, missing field or out-of-range value';}else log.error({requestId,errorType:e instanceof Error?e.name:'unknown'},'API failure');return response({error:{code,message,requestId}},status)}}
export const uuid=z.uuid();
export const pageQuery=z.object({limit:z.coerce.number().int().min(1).max(200).default(50),offset:z.coerce.number().int().min(0).max(100000).default(0),q:z.string().max(150).default('')});
