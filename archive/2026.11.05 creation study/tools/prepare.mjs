#!/usr/bin/env node
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync,copyFileSync} from 'node:fs';
import {resolve,join,relative} from 'node:path';
import {pathToFileURL} from 'node:url';
import {randomUUID} from 'node:crypto';
import {freezeRuntime,runtimeHash,digest} from '../../../src/playtest/session.ts';
import {cliIdentity} from './transport.mjs';

export const GUIDANCE='This story is an educational combination game for curious high-school and adult readers. Its purpose is enjoyable making and discovery that leaves players with useful understanding of how ideas work.';
export const root=resolve(import.meta.dirname,'../../..');
const defaultStory='projects/creation-study/creation.md';
export function chapterSelector(value,total) {
  if(value==='all') return Array.from({length:total},(_,i)=>i+1);
  const chapters=new Set();
  for(const part of value.split(',')) {
    const match=/^([1-9]\d*)(?:-([1-9]\d*))?$/.exec(part.trim());assert(match,`Invalid chapter selector ${part}`);
    const first=Number(match[1]),last=Number(match[2]??match[1]);assert(first<=last&&last<=total,`Chapter selector outside 1–${total}`);
    for(let chapter=first;chapter<=last;chapter++) chapters.add(chapter);
  }
  assert(chapters.size,'No chapters selected');return [...chapters].toSorted((a,b)=>a-b);
}
export function parseArgs(args) {
  const out={story:defaultStory,project:'projects/creation-study',chapters:'all',slots:4,maxTurns:300,timeoutSeconds:300,preflight:false,guidance:GUIDANCE};
  const values={'--guidance':'guidance','--story':'story','--project':'project','--chapters':'chapters','--slots':'slots','--max-turns':'maxTurns','--timeout-seconds':'timeoutSeconds','--expect-story-sha':'expectedHash'};
  for(let i=0;i<args.length;i++) {
    const arg=args[i];
    if(arg==='--help'){out.help=true;continue;}
    if(arg==='--preflight'){out.preflight=true;continue;}
    if(arg==='--fast'||arg==='--detailed'){assert(!out.mode,'Specify exactly one playstyle');out.mode=arg.slice(2);continue;}
    assert(values[arg],`Unknown argument ${arg}`);assert(args[i+1]!==undefined&&!args[i+1].startsWith('--'),`Missing value for ${arg}`);out[values[arg]]=args[++i];
  }
  if(out.help) return out;
  assert(out.mode,'Specify exactly one of --fast or --detailed');
  for(const field of ['slots','maxTurns','timeoutSeconds']){out[field]=Number(out[field]);assert(Number.isSafeInteger(out[field])&&out[field]>0,`Invalid ${field}`);}
  assert(out.slots<=12,'Campaign capacity is 12 requests maximum');
  if(!out.preflight) assert(/^[a-f0-9]{64}$/.test(out.expectedHash??''),'Execution requires --expect-story-sha HASH to identify the selected manuscript; --preflight performs no inference.');
  return out;
}
async function frozenModules(folder) {
  const load=path=>import(pathToFileURL(join(folder,'source',path)).href);
  const [parser,adventure,sessions,grading,rubrics,files,reports,hashes]=await Promise.all([
    load('src/story/parser.ts'),load('src/playtest/adventure.ts'),load('src/playtest/chapter-session.ts'),load('src/playtest/grading.ts'),load('src/playtest/rubrics.ts'),load('src/playtest/project-files.ts'),load('src/playtest/report.ts'),load('src/playtest/session.ts')]);
  return {...parser,...adventure,...sessions,...grading,...rubrics,...files,...reports,...hashes};
}
export async function prepare(config) {
  const sourcePath=resolve(root,config.story),markdown=readFileSync(sourcePath,'utf8'),storyHash=digest(markdown);
  if(config.expectedHash) assert.equal(storyHash,config.expectedHash,'Manuscript changed since its hash was selected');
  const campaignId=`${new Date().toISOString().replaceAll(/[:.]/g,'-')}-${config.mode}-${randomUUID().slice(0,8)}`;
  const scratch=join(root,'runs/creation-playtests/campaigns',campaignId);mkdirSync(scratch,{recursive:true});
  const shared=join(scratch,'frozen'),before=runtimeHash();freezeRuntime(shared,markdown);
  assert.equal(runtimeHash(),before,'Runtime changed during freeze');
  const api=await frozenModules(shared);assert.equal(api.runtimeHash(),before,'Frozen runtime hash mismatch');
  const storyId=relative(root,sourcePath),story=api.parseStory(markdown,{id:storyId});
  const chapters=chapterSelector(config.chapters,story.chapters.length);
  const starts=new Map();
  for(const chapter of chapters){const a=api.startAdventure(story,{chapter,mode:'chapter',playStyle:config.mode});assert.equal(a.state.chapter+1,chapter,'Checkpoint did not reach selected chapter');starts.set(chapter,a);}
  const rubricText=readFileSync(join(shared,'source/docs/fun-and-evaluation.md'),'utf8');
  const synthesisRubric=rubricText.split('### Chapter synthesis grader\n')[1];assert(synthesisRubric,'Missing canonical synthesis rubric');
  const identity=cliIdentity();
  const runnerHashes={};for(const file of ['prepare.mjs','playtest.mjs','resume.mjs','pacing.mjs','transport.mjs','protocol.mjs','verify.mjs','tool-free-models.json']){const src=join(import.meta.dirname,file);runnerHashes[file]=digest(readFileSync(src));copyFileSync(src,join(scratch,file));}
  const manifest={campaignId,createdAt:new Date().toISOString(),story:storyId,storyHash,runtimeHash:before,mode:config.mode,chapters,guidance:config.guidance,guidanceHash:digest(config.guidance),slots:config.slots,maxTurns:config.maxTurns,timeoutSeconds:config.timeoutSeconds,playersPerChapter:3,playerModel:'gpt-6.1-terra',playerEffort:'medium',graderModel:'gpt-6-astra',graderEffort:'high',synthesizerModel:'gpt-6-astra',synthesizerEffort:'high',cli:identity,runnerHashes};
  writeFileSync(join(scratch,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  return {config,api,scratch,shared,story,storyId,storyHash,chapters,starts,synthesisRubric,manifest};
}
