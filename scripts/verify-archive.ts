import {readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve(import.meta.dirname,'../archive/legacy-2026-10-30');
const manifest=JSON.parse(readFileSync(join(root,'SOURCE-MANIFEST.json'),'utf8')) as {files:{path:string;sha256:string;bytes:number}[]};
const failures:string[]=[];
for(const entry of manifest.files){try{const data=readFileSync(join(root,entry.path));if(data.length!==entry.bytes||createHash('sha256').update(data).digest('hex')!==entry.sha256)failures.push(entry.path);}catch{failures.push(entry.path);}}
const review='docs/story-authenticity-review-2026-10-30.md';
// The consolidated backlog replaces the active duplicate. The original remains
// immutable in the archive and is verified by the manifest loop above.
if(!manifest.files.some(entry=>entry.path===review))failures.push('Original authenticity review is missing from the archive manifest.');
console.log(JSON.stringify({files:manifest.files.length,failures},null,2));if(failures.length)process.exitCode=1;
