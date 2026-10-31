import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {runPath,digest} from './session.ts';
import type {Session} from './session.ts';
import {evaluate} from './evaluate.ts';
try{
  const args=process.argv.slice(2),ids=args.filter(arg=>!arg.startsWith('--'));
  if(ids.length!==1 || args.some(arg=>arg.startsWith('--')&&arg!=='--verify-only'))throw new Error('Usage: npm run evaluate -- SESSION [--verify-only]');
  const id=ids[0],folder=runPath(id),session=JSON.parse(readFileSync(join(folder,'session.json'),'utf8')) as Session,text=readFileSync(join(folder,'story.md'),'utf8');
  if(digest(text)!==session.storyHash)throw new Error('Frozen story hash mismatch.');
  const {parseStory}=await import(pathToFileURL(join(folder,'source/src/story/parser.ts')).href),{verifySession,runtimeHash}=await import(pathToFileURL(join(folder,'source/src/playtest/session.ts')).href);
  if(runtimeHash()!==session.runtimeHash)throw new Error('Frozen runtime hash mismatch.');
  verifySession(session,parseStory(text,{id:session.story}));
  if(args.includes('--verify-only'))console.log(JSON.stringify({session:id,replayVerified:true}));
  else{const profile={...evaluate(session),replayVerified:true};writeFileSync(join(folder,'evaluation.json'),JSON.stringify(profile,null,2)+'\n');console.log(JSON.stringify(profile,null,2));}
}catch(error){console.error((error as Error).message);process.exitCode=1;}
