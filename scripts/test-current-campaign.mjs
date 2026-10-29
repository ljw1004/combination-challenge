import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const root=new URL('../',import.meta.url),files=JSON.parse(readFileSync(new URL('current-campaign-tests.json',import.meta.url),'utf8'));
const {ELEMENTS_TEST_URL:unused,...env}=process.env;
const result=spawnSync(process.execPath,['--test','--test-concurrency=1',...files],{cwd:root,env,stdio:'inherit'});
if(result.error)throw result.error;process.exit(result.status??1);
