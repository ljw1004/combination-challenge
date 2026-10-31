/** Frozen player surface: no graph access; preserves an append-only command log. */
import fs from 'node:fs';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url));
for(const [path,expected] of Object.entries(JSON.parse(fs.readFileSync(root+'pilot-manifest.json')))){
 if(crypto.createHash('sha256').update(fs.readFileSync(root+path)).digest('hex')!==expected)throw Error('Frozen player source changed: '+path);
}
const args=process.argv.slice(2);if(!['init','view','inspect','hint','drop','undo'].includes(args[0]))throw Error('Use init|view|inspect|hint|drop|undo');
const r=spawnSync(process.execPath,[root+'pilot-player.ts',...args],{cwd:root,encoding:'utf8'});
fs.appendFileSync(root+'pilots/commands.jsonl',JSON.stringify({at:new Date().toISOString(),args,status:r.status,stdout:r.stdout,stderr:r.stderr})+'\n');
process.stdout.write(r.stdout);process.stderr.write(r.stderr);process.exitCode=r.status??1;
