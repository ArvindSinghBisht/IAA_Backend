import {cp,mkdir,access} from 'node:fs/promises';
import path from 'node:path';
const output=path.resolve('.next/standalone');
await access(path.join(output,'server.js'));
for(const [source,destination] of [['public','public'],['.next/static','.next/static'],['data','data']]){await access(source);await cp(source,path.join(output,destination),{recursive:true});}
await mkdir(path.join(output,'docs'),{recursive:true});
await cp('docs/openapi.json',path.join(output,'docs/openapi.json'));
console.log('Standalone runtime prepared with portal assets, reference packs and API documentation.');
