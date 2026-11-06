import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const port=process.env.SMOKE_PORT||'4319',base=`http://127.0.0.1:${port}`;
const child=spawn(process.execPath,['.next/standalone/server.js'],{cwd:process.cwd(),env:{...process.env,PORT:port,HOSTNAME:'127.0.0.1',DATABASE_URL:'',MIGRATION_DATABASE_URL:'',OIDC_JWKS_URL:'',OIDC_ISSUER:'',OIDC_AUDIENCE:'',CORS_ALLOWED_ORIGINS:''},stdio:['ignore','pipe','pipe']});
let output='';child.stdout.on('data',b=>{output+=b.toString();});child.stderr.on('data',b=>{output+=b.toString();});
try{
 let ready=false;for(let i=0;i<60;i++){if(child.exitCode!==null)throw new Error('Standalone server exited before listening');try{const r=await fetch(base+'/api/v1/health');if(r.status===200){ready=true;break;}}catch{}await new Promise(resolve=>setTimeout(resolve,100));}assert.ok(ready,'Standalone server did not become ready');
 const results=[];for(const [path,status] of [['/api/v1',200],['/api/v1/health',200],['/portal/index.html',200],['/api/v1/openapi',200],['/api/v1/wp1/information-layer',200],['/api/v1/wp1/information-layer/index',200],['/api/v1/ready',503],['/api/v1/wp1/projects/bad',400],['/api/v1/does-not-exist',404],['/api/v1/auth/me',503]]){const r=await fetch(base+path);assert.equal(r.status,status,path);results.push({path,status:r.status});if(path==='/api/v1/openapi')assert.equal((await r.json()).info.version,'0.3.0');}
 const energy=await fetch(base+'/api/v1/wp2/estimate-energy',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({capacityDcMwp:2,specificYieldKwhPerKwpYear:1500})});assert.equal(energy.status,200);assert.equal((await energy.json()).data.generationMwh,3000);results.push({path:'POST /api/v1/wp2/estimate-energy',status:200});
 const wrong=await fetch(base+'/api/v1/health',{method:'POST'});assert.equal(wrong.status,405);results.push({path:'POST /api/v1/health',status:405});console.log(JSON.stringify({passed:results.length,results},null,2));
}catch(error){console.error(output);throw error;}finally{child.kill('SIGTERM');}
