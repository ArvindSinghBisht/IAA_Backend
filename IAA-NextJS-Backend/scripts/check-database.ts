import 'dotenv/config';
import pg from 'pg';
import {pgConfig} from '../src/lib/pg-config';
const mode=process.argv.includes('--migration')?'MIGRATION_DATABASE_URL':'DATABASE_URL';
const url=process.env[mode];if(!url)throw new Error(`Set ${mode} in your private .env`);
const c=new pg.Client(pgConfig(url));
try{await c.connect();
 const version=(await c.query('SHOW server_version')).rows[0];
 const schemas=(await c.query("SELECT schema_name FROM information_schema.schemata WHERE schema_name=ANY($1::text[]) ORDER BY 1",[['core','iaa_auth','geo','data','wp1','content','project','plan','mon','ops','ingest']])).rows;
 const extension=(await c.query("SELECT name,installed_version FROM pg_available_extensions WHERE name='postgis'")).rows;
 console.log(JSON.stringify({connected:true,mode,version,schemas,extension},null,2));
}catch(e){console.error(JSON.stringify({connected:false,mode,errorCode:(e as {code?:string}).code||'CONNECTION_FAILED',message:'Check Neon endpoint status, credentials, DNS and network access. Connection URI/password are not logged.'}));process.exitCode=1}
finally{await c.end().catch(()=>{})}
