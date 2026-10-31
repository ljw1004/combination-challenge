import { mkdirSync, existsSync, readFileSync, writeFileSync, readdirSync, copyFileSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { loadStory } from '../story/load.ts';
import { parseStory } from '../story/parser.ts';
import { newGame, act, replay } from '../engine/game.ts';
import { observe,readItem } from './observe.ts';
import type { PlayerAction } from './observe.ts';
import type { State } from '../engine/types.ts';
import type { Story } from '../story/types.ts';

export interface Account { intention?:string; expected?:string; alternatives?:string; experience?:string; hypothesis?:string }
export interface Entry { sequence:number; action:PlayerAction; account?:Account; before:ReturnType<typeof observe>; after:unknown; error?:string }
export interface Session {
  version:1;id:string;story:string;storyHash:string;runtimeHash:string;createdAt:string;
  condition:'fresh'|'diagnostic';assignment:string;model?:string;state:State;entries:Entry[];
  outcome?:'completed'|'stopped'|'budget'|'technical-interruption';report?:Record<string,unknown>;
}
const root=resolve(import.meta.dirname,'../..');
export const runsRoot=process.env.COMBINATION_RUNS_DIR?resolve(process.env.COMBINATION_RUNS_DIR):join(root,'runs');
export function digest(text:string|Buffer){return createHash('sha256').update(text).digest('hex');}
function sourceFiles(dir=join(root,'src')):string[]{return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?sourceFiles(join(dir,e.name)):[join(dir,e.name)]).sort();}
export function runtimeHash(){return digest(sourceFiles().map(p=>relative(root,p)+'\0'+digest(readFileSync(p))).join('\n'));}
export function runPath(id:string){if(!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(id))throw new Error('Session IDs may contain letters, numbers, underscores and hyphens.');return join(runsRoot,id);}
export function createSession(id:string,storyId:string,options:{condition?:Session['condition'];assignment?:string;model?:string}={}):Session{
  const folder=runPath(id);if(existsSync(folder))throw new Error('Session already exists; use a new ID.');
  const {story,hash,markdown}=loadStory(storyId);mkdirSync(folder,{recursive:true});writeFileSync(join(folder,'story.md'),markdown);
  for(const path of sourceFiles()){const dest=join(folder,'source',relative(root,path));mkdirSync(resolve(dest,'..'),{recursive:true});copyFileSync(path,dest);}
  for(const name of ['package.json','package-lock.json'])copyFileSync(join(root,name),join(folder,'source',name));
  const session:Session={version:1,id,story:storyId,storyHash:hash,runtimeHash:runtimeHash(),createdAt:new Date().toISOString(),condition:options.condition??'fresh',assignment:options.assignment??'Explore the story through combining. Stop if satisfied, bored or confused; completion is optional. Report concrete moments you valued or disliked, without trying to please the designer.',...(options.model?{model:options.model}:{}),state:newGame(story),entries:[]};
  saveSession(session);return session;
}
export function saveSession(session:Session){writeFileSync(join(runPath(session.id),'session.json'),JSON.stringify(session,null,2)+'\n');}
export function openSession(id:string):{session:Session;story:Story}{
  const folder=runPath(id),session=JSON.parse(readFileSync(join(folder,'session.json'),'utf8')) as Session,markdown=readFileSync(join(folder,'story.md'),'utf8');
  if(digest(markdown)!==session.storyHash)throw new Error('The frozen story changed; this session cannot be continued.');
  if(runtimeHash()!==session.runtimeHash)throw new Error('The runtime changed. Start a new session; the original source and evidence are retained.');
  const story=parseStory(markdown,{id:session.story,file:`runs/${id}/story.md`});
  return {session,story};
}
export function step(session:Session,story:Story,action:PlayerAction,account?:Account){
  if(session.outcome)throw new Error('This session is closed. Preserve it and start a new trial.');
  if(!action||typeof action!=='object'||!['combine','move','advance','dismiss','read'].includes(action.type))throw new Error('Malformed player protocol: expected a recognized action object.');
  const entry:Entry={sequence:session.entries.length+1,action,...(account?{account}:{}),before:observe(story,session.state),after:null};
  try{if(action.type==='read')entry.after=readItem(story,session.state,action.item);else{session.state=act(story,session.state,action);entry.after=observe(story,session.state);}}catch(error){entry.error=(error as Error).message;entry.after=entry.before;}
  session.entries.push(entry);saveSession(session);return entry;
}
export function verifySession(session:Session,story:Story){
  const state=replay(story,session.state.actions);
  if(JSON.stringify(state)!==JSON.stringify(session.state))throw new Error('The recorded final state does not match exact replay.');
  const accepted=session.entries.filter(e=>!e.error&&e.action.type!=='read').map(e=>e.action);
  if(JSON.stringify(accepted)!==JSON.stringify(session.state.actions))throw new Error('The event ledger does not match the game actions.');
  return true;
}
