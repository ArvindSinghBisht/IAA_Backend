import {pgConfig} from '../src/lib/pg-config';
import 'dotenv/config';
import pg from 'pg';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
if(!process.env.MIGRATION_DATABASE_URL)throw new Error('Set MIGRATION_DATABASE_URL to the migration owner connection');
if(new URL(process.env.MIGRATION_DATABASE_URL!).hostname.includes('-pooler.'))throw new Error('Migrations need the direct Neon connection, not the pooled endpoint. Use MIGRATION_DATABASE_URL from Neon Connect with pooling off.');
const c=new pg.Client(pgConfig(process.env.MIGRATION_DATABASE_URL!));await c.connect();try{
 await c.query("SELECT pg_advisory_lock(hashtext('iaa-backend-migrations'))");
 await c.query('CREATE TABLE IF NOT EXISTS public.iaa_backend_migrations(name text PRIMARY KEY,sha256 text NOT NULL,applied_at timestamptz NOT NULL DEFAULT now())');
 for(const name of (await readdir('db/migrations')).filter(n=>n.endsWith('.sql')).sort()){
 const raw=await readFile('db/migrations/'+name,'utf8'),hash=createHash('sha256').update(raw).digest('hex'),old=(await c.query('SELECT sha256 FROM public.iaa_backend_migrations WHERE name=$1',[name])).rows[0];
 if(old){if(old.sha256!==hash)throw new Error('Applied migration checksum changed: '+name);continue}
 const sql=raw.replace(/^BEGIN;\s*$/gm,'').replace(/^COMMIT;\s*$/gm,'');await c.query('BEGIN');try{await c.query(sql);await c.query('INSERT INTO public.iaa_backend_migrations(name,sha256) VALUES($1,$2)',[name,hash]);await c.query('COMMIT');console.log('Applied',name)}catch(e){await c.query('ROLLBACK');throw e}
 }
}finally{await c.end()}
