/** Verify/materialize the complete archived Site source, separately from active root source. No network access. */
import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sha=b=>createHash('sha256').update(b).digest('hex');const blob=b=>createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
const safe=(base,rel)=>{assert(typeof rel==='string'&&!path.isAbsolute(rel)&&!rel.split('/').includes('..'),'unsafe archive path');const p=path.resolve(base,rel);assert(p.startsWith(base+path.sep));return p;};
export function verifySourceArchive({materialize,archive='current'}={}){
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'scripts/current-campaign-manifest.json'),'utf8')),info=archive==='current'?manifest.sourceArchive:archive==='predecessor'?manifest.predecessorSourceArchive:archive==='intermediate'?manifest.intermediateSourceArchive:null;assert(info,'root manifest must declare this immutable Site archive');
 const packed=fs.readFileSync(safe(root,info.indexPath));assert.equal(sha(packed),info.indexSha256);const decoded=gunzipSync(packed,{maxOutputLength:32*1024*1024});assert.equal(sha(decoded),info.decodedIndexSha256);const index=JSON.parse(decoded.toString());assert.equal(index.sourceSealSha256,info.sourceSealSha256);assert.equal(index.declaredSourceInputCount,info.declaredSourceInputCount);assert.equal(index.materializedFileCount,info.materializedFileCount);assert.equal(info.materializedFileCount,info.declaredSourceInputCount+1);assert.equal(Object.keys(index.files).length,info.materializedFileCount);
 let target;if(materialize){target=path.resolve(materialize);assert(!fs.existsSync(target),'materialization destination already exists');fs.mkdirSync(target,{recursive:false});}
 const cache=new Map();let encoded=0,raw=0;
 for(const [id,o]of Object.entries(index.objects)){
  let b;
  if(o.kind==='raw-git-object'){b=fs.readFileSync(safe(root,o.path));raw++;}
  else {assert.equal(o.kind,'preserved-base64');const parts=[];for(const p of o.parts){const part=fs.readFileSync(safe(root,p.repositoryPath));assert.equal(part.length,p.bytes);assert.equal(sha(part),p.sha256);assert.equal(blob(part),p.gitBlobSha);parts.push(part);}
   const packed=Buffer.from(Buffer.concat(parts).toString(),'base64');assert.equal(sha(packed),o.encodedSha256);assert(['gzip','none'].includes(o.compression));b=o.compression==='gzip'?gunzipSync(packed,{maxOutputLength:64*1024*1024}):packed;encoded++;
  }
  assert.equal(b.length,o.bytes);assert.equal(sha(b),o.sha256);assert.equal(blob(b),id);cache.set(id,b);
 }
 const seal=index.files[index.sourceManifestPath];assert(seal);const sourceBytes=cache.get(seal.object);assert.equal(sha(sourceBytes),index.sourceSealSha256);const source=JSON.parse(sourceBytes.toString());assert.equal(Object.keys(source.files).length,info.declaredSourceInputCount);assert.deepEqual(Object.keys(index.files).sort(),[...Object.keys(source.files),index.sourceManifestPath].sort());
 let total=0;
 for(const [rel,row]of Object.entries(index.files)){
  safe(root,rel);assert(['100644','100755'].includes(row.mode));const b=cache.get(row.object);assert(b,rel);assert.equal(b.length,row.bytes);assert.equal(sha(b),row.sha256,rel);if(rel!==index.sourceManifestPath)assert.deepEqual(source.files[rel],{sha256:row.sha256,bytes:row.bytes},rel);total+=b.length;
  if(target){const p=safe(target,rel);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,b,{mode:row.mode==='100755'?0o755:0o644});}
 }
 const report={sourceSealSha256:index.sourceSealSha256,declaredSourceInputs:info.declaredSourceInputCount,materializedFiles:info.materializedFileCount,rawObjects:raw,encodedObjects:encoded,verifiedBytes:total,materializedAt:target??null};return {report,index};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),options={};while(args.length){const key=args.shift(),value=args.shift();assert(value&&(key==='--materialize'||key==='--archive'),'usage: node scripts/verify-campaign-source-archive.mjs [--archive current|predecessor|intermediate] [--materialize NEW_DIRECTORY]');options[key==='--archive'?'archive':'materialize']=value;}console.log(JSON.stringify(verifySourceArchive(options).report,null,2));
}
