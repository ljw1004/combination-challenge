import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const dir=import.meta.dirname;
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
const sha=(p:string)=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.ok(Object.keys(manifest.bundleSha256).length>0,'Bundle is not sealed');
for(const [p,h] of Object.entries(manifest.bundleSha256))assert.equal(sha(path.join(dir,p)),h,`Bundle mismatch: ${p}`);
let sources=0;
if(fs.existsSync(manifest.sourceRoot))for(const [p,h] of Object.entries(manifest.sourceSha256)){assert.equal(sha(path.join(manifest.sourceRoot,p)),h,`Original source changed: ${p}`);sources++;}
console.log(JSON.stringify({bundleFiles:Object.keys(manifest.bundleSha256).length,bundleVerified:true,originalSourceFilesVerified:sources,canonicalEngine:manifest.canonicalEngine,totals:manifest.totals},null,2));
