import pg, { type PoolClient } from 'pg';
import {pgConfig} from './pg-config';
const globalDb = globalThis as unknown as { iaaPool?: pg.Pool };
export function pool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  return globalDb.iaaPool ??= new pg.Pool({...pgConfig(process.env.DATABASE_URL),max:Number(process.env.DB_POOL_MAX||5),connectionTimeoutMillis:5000,idleTimeoutMillis:30000,statement_timeout:15000});
}
export async function query(text:string,values:unknown[]=[]){return pool().query(text,values)}
export async function transaction<T>(fn:(client:PoolClient)=>Promise<T>):Promise<T>{const c=await pool().connect();try{await c.query('BEGIN');const out=await fn(c);await c.query('COMMIT');return out}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}}
