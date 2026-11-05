#!/usr/bin/env node
/** Start a fresh cohort, then use the checkpoint-resumable pipeline immediately. */
import assert from 'node:assert/strict';
import {copyFileSync,writeFileSync,readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {prepare,parseArgs,root} from './prepare.mjs';
import {loadResume,resumeCampaign} from './resume.mjs';
const write=(path,value)=>writeFileSync(path,JSON.stringify(value,null,2)+'\n',{flag:'wx'});

export function pacedArgs(args) {
  const campaign=[],pacing={minIntervalMs:2000,cooldownMs:30000,maxAttempts:8};
  const keys={'--min-interval-ms':'minIntervalMs','--cooldown-ms':'cooldownMs','--max-attempts':'maxAttempts'};
  for(let i=0;i<args.length;i++) {
    if(keys[args[i]]){const n=Number(args[++i]);assert(Number.isSafeInteger(n)&&n>0);pacing[keys[args[i-1]]]=n;}
    else campaign.push(args[i]);
  }
  if(!campaign.includes('--slots'))campaign.push('--slots','4');
  assert(pacing.cooldownMs>=30000,'Rate cooldown must be at least 30 seconds');assert(pacing.maxAttempts>=6,'Use at least six bounded request attempts');
  const config=parseArgs(campaign);return{config,pacing:{...pacing,slots:config.slots}};
}

export function initializeFreshCampaign(prepared,pacing) {
  const{config,manifest,scratch,api,storyId,chapters,starts}=prepared;
  assert(!manifest.directory,'Fresh campaign already has a project directory');
  const directory=api.createPlaytest(resolve(root,config.project));
  manifest.directory=directory;manifest.entrypoint='playtest.mjs';manifest.initialDispatch={...pacing};
  const entry=join(import.meta.dirname,'playtest.mjs');copyFileSync(entry,join(scratch,'playtest.mjs'));
  manifest.runnerHashes['playtest.mjs']=api.digest(readFileSync(entry));
  writeFileSync(join(scratch,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  for(const chapter of chapters)for(const player of [1,2,3]) {
    const adventure=structuredClone(starts.get(chapter)),id=`c${chapter}-p${player}-${randomUUID().slice(0,8)}`;
    const session={version:6,playStyle:config.mode,id,story:storyId,storyHash:manifest.storyHash,runtimeHash:manifest.runtimeHash,createdAt:new Date().toISOString(),guidance:manifest.guidance,guidanceHash:manifest.guidanceHash,chapter,playerRubric:api.rubric('player',config.mode),graderRubric:api.rubric('grader',config.mode),model:`${manifest.playerModel} ${manifest.playerEffort}`,initial:structuredClone(adventure.frame),adventure,turns:[],pendingLook:false,requests:[]};
    api.reservePlayer({directory,player},chapter);write(join(scratch,id+'.json'),session);api.writePlayerOutputs({directory,player},chapter,api.playerOutputs(session));
  }
  return directory;
}

export async function startPaced(config,pacing,{transport,onEvent=event=>console.log(JSON.stringify(event))}={}) {
  const prepared=await prepare(config);
  if(config.preflight)return{preflight:true,scratch:prepared.scratch,manifest:prepared.manifest,pacing};
  const directory=initializeFreshCampaign(prepared,pacing);
  onEvent({event:'fresh-campaign-created',directory,scratch:prepared.scratch,mode:config.mode,chapters:prepared.chapters,players:prepared.chapters.length*3,...pacing});
  return resumeCampaign(await loadResume(prepared.scratch),{...pacing,...(transport?{transport}:{}),onEvent});
}

if(process.argv[1]&&resolve(process.argv[1])===resolve(import.meta.filename)) {
  try {
    const{config,pacing}=pacedArgs(process.argv.slice(2));
    if(config.help)console.log('node projects/creation-study/tools/playtest.mjs (--fast | --detailed) --expect-story-sha HASH [--chapters all|1,3,5-8] [--story PATH] [--project PATH] [--guidance TEXT | --guidance-file PATH] [--slots 4] [--min-interval-ms 2000] [--cooldown-ms 30000] [--max-attempts 8] [--preflight]\nCreates one fresh three-player-per-chapter cohort with frozen canonical inputs and durable checkpoints before the first request. Resume an interrupted run with resume.mjs and its printed scratch path. --preflight performs no model calls and creates no project output.');
    else {const result=await startPaced(config,pacing);if(result.preflight)console.log(JSON.stringify(result));else if(!result.complete)process.exitCode=1;}
  }catch(error){console.error(error.stack);process.exitCode=1;}
}
