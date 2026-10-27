import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const dir=import.meta.dirname,root=path.resolve(dir,'../..');
const sha=(p:string)=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const source='reviews/integration-audit/manifest.json';
const audit=JSON.parse(fs.readFileSync(path.join(root,source),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
for(const [p,h] of Object.entries(audit.testedSourceSHA256))assert.equal(sha(path.join(root,p)),h,`Independent audit is stale for ${p}`);
const entries={...audit.auditEvidenceSHA256,[source]:sha(path.join(root,source))};
const targetDir=path.join(dir,'evidence/independent-audit');fs.mkdirSync(targetDir,{recursive:true});
for(const [p,h] of Object.entries(entries)){
  assert.ok(p.startsWith('reviews/integration-audit/'));assert.equal(sha(path.join(root,p)),h,`Independent audit evidence changed: ${p}`);
  const target=path.join(targetDir,p.slice('reviews/integration-audit/'.length));fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.copyFileSync(path.join(root,p),target);manifest.sourceSha256[p]=h;
}
manifest.independentAudit={sourceManifest:source,report:'evidence/independent-audit/REPORT.md',manifest:'evidence/independent-audit/manifest.json',testedSourceSHA256:audit.testedSourceSHA256,verifiedAgainstCurrentIntegration:true};
fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Copied and verified ${Object.keys(entries).length} independent audit evidence files against the exact current engine/scenarios.`);
