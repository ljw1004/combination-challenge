#!/usr/bin/env node
/** Exact subprocess evidence, including errors. Use this entrypoint for fresh play. */
import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
const args=process.argv.slice(2),root=path.resolve(import.meta.dirname,'..');
const r=spawnSync(process.execPath,[path.join(import.meta.dirname,'cli.ts'),...args],{encoding:'utf8'});
const status=r.status??1,stdout=r.stdout??'',stderr=r.stderr??'';
const record={at:new Date().toISOString(),argv:args,stdout,stderr,status,signal:r.signal,error:r.error?.message};
const id=args[1],dir=id&&/^[a-zA-Z0-9_-]{1,100}$/.test(id)?path.join(root,'sessions',id):null;
const target=dir&&fs.existsSync(dir)?path.join(dir,'transcript.jsonl'):path.join(root,'failed-commands.jsonl');
fs.appendFileSync(target,JSON.stringify(record)+'\n');process.stdout.write(stdout);process.stderr.write(stderr);process.exitCode=status;
