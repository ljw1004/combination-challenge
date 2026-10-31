import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
for(const [p,h] of Object.entries(JSON.parse(readFileSync(new URL('runtime-manifest.json',import.meta.url)))))if(createHash('sha256').update(readFileSync(new URL(p,import.meta.url))).digest('hex')!==h)throw Error('Frozen runtime changed: '+p);
export const M=await import('./frozen-runtime/engine/model.ts');
export const L=await import('./frozen-runtime/schema/lifecycle.ts');
