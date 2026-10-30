import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const sorted=object=>Object.fromEntries(Object.entries(object).sort(([a],[b])=>a.localeCompare(b)));
export function currentProvenance(root){
 const manifestBytes=fs.readFileSync(path.join(root,'manifest.json')),manifest=JSON.parse(manifestBytes);
 for(const[p,h]of Object.entries(manifest))if(sha(fs.readFileSync(path.join(root,p)))!==h)throw Error('Frozen package changed: '+p);
 const runtimeBytes=fs.readFileSync(path.join(root,'runtime-manifest.json')),runtime=JSON.parse(runtimeBytes),actual={};
 for(const[p,h]of Object.entries(runtime)){actual[p]=sha(fs.readFileSync(path.join(root,p)));if(actual[p]!==h)throw Error('Frozen runtime changed: '+p);}
 const source={version:1,scenarioSha256:sha(fs.readFileSync(path.join(root,'scenario.json'))),manifestSha256:sha(manifestBytes),runtimeManifestSha256:sha(runtimeBytes),runtimeSha256:sha(JSON.stringify(sorted(actual)))};
 return {...source,packetSha256:sha(JSON.stringify(source))};
}
export function assertSessionProvenance(doc,current){
 if(!doc.provenance||doc.provenance.version!==1)throw Error('Session has no complete pinned provenance. Preserve it and start a new session; it will not be adopted or migrated.');
 for(const key of Object.keys(current))if(doc.provenance[key]!==current[key])throw Error('Source changed since this session began ('+key+'). Preserve this session and use a new name; no migration is permitted.');
 if(doc.seed?.scenarioSha256&&doc.seed.scenarioSha256!==current.scenarioSha256)throw Error('Seed scenario does not match session provenance.');
}
