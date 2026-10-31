/** Recipe-blind pilot surface: labels, intentional reading and partner highlighting only. */
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const integrityBytes=fs.readFileSync(path.join(root,'pilot-integrity.json'));
const integrity=JSON.parse(integrityBytes);
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
for(const required of ['play.mjs','doctrine-argument-desks-v8-candidate.json','runtime/engine/model.ts','runtime/schema/scenario.ts','runtime/schema/lifecycle.ts','runtime/package.json'])if(!integrity.files[required])throw Error('Frozen pilot manifest omits '+required);
for(const [file,expected] of Object.entries(integrity.files))if(digest(fs.readFileSync(path.join(root,file)))!==expected)throw Error('Frozen pilot integrity failed: '+file);
if(integrity.nodeVersion!==process.version)throw Error('Frozen pilot Node version changed: '+process.version);
const pilotSha256=digest(integrityBytes);
const M=await import('./runtime/engine/model.ts');
const bytes=fs.readFileSync(path.join(root,'doctrine-argument-desks-v8-candidate.json'));
const s=JSON.parse(bytes);const sha=crypto.createHash('sha256').update(bytes).digest('hex');
const [session,cmd='look',...args]=process.argv.slice(2);
if(!session||!/^[a-z0-9_-]+$/i.test(session))throw Error('Use: node play.mjs SESSION look | read ID | partners ID | combine A B | undo | stop REASON');
const dir=path.join(root,'sessions',session);fs.mkdirSync(dir,{recursive:true});const save=path.join(dir,'game.json'),log=path.join(dir,'events.jsonl'),info=path.join(dir,'session.json');
if(fs.existsSync(info)){const prior=JSON.parse(fs.readFileSync(info,'utf8'));if(prior.candidateSha256!==sha||prior.pilotSha256!==pilotSha256)throw Error('This session belongs to another frozen candidate/runtime/player. Preserve it and start a new session.');}
if(!fs.existsSync(info))fs.writeFileSync(info,JSON.stringify({session,candidateSha256:sha,pilotSha256,nodeVersion:process.version,startedAt:new Date().toISOString(),status:'running',kind:'unclassified; evaluator must identify authored harness, simulated or human'},null,2)+'\n');
let g=fs.existsSync(save)?M.restore(s,fs.readFileSync(save,'utf8')):M.createGame(s);
const label=id=>s.items.find(x=>x.id===id)?.label??id;
const look=()=>{const v=M.playerView(s,g);return {scenario:v.scenario,stage:v.stage,objectives:v.objectives,completed:v.completed,things:v.things.map(t=>({id:t.id,label:t.label,gold:t.gold,components:t.components,readable:!!s.items.find(i=>i.id===t.id)?.reading})),areas:v.areas};};
let result;
if(cmd==='look')result=look();
else if(cmd==='read'){
 const t=g.state.tokens.find(t=>t.id===args[0]&&t.area===g.state.currentArea);const it=t&&s.items.find(i=>i.id===t.kind);
 result=it?.reading?{id:it.id,label:it.label,...it.reading,sources:it.sources.map(id=>{const x=s.sources.find(x=>x.id===id);return {title:x.title,url:x.url};})}:{error:'No readable manuscript by that ID on this desk.'};
}else if(cmd==='partners'){
 const p=M.partners(s,g.state,args[0]);result={for:args[0],partners:p.partners.map(id=>({id,label:label(id)}))};
}else if(cmd==='combine'||cmd==='undo'){
 const action=cmd==='combine'?{type:'combine',a:args[0],b:args[1]}:{type:'undo'};
 const r=cmd==='undo'?M.undo(g):M.applyAction(s,g,action);g=r.game;
 const transitions=[];
 if(r.accepted&&cmd==='combine')while(M.stageComplete(s,g.state)&&!g.state.completed){const adv=M.applyAction(s,g,{type:'advance'});if(!adv.accepted)break;g=adv.game;transitions.push({stage:g.state.stage+1,completed:g.state.completed});}
 result={accepted:r.accepted,...!r.accepted?{message:r.message}:{},...r.created?{created:{id:r.created,label:label(r.created)}}:{},transitions,view:look()};
}else if(cmd==='stop'){
 const data=JSON.parse(fs.readFileSync(info,'utf8'));Object.assign(data,{status:'stopped',reason:args.join(' ')||'No reason supplied',stoppedAt:new Date().toISOString()});fs.writeFileSync(info,JSON.stringify(data,null,2)+'\n');result={recorded:'stopped',stage:g.state.stage+1,attempts:g.state.metrics.attempts};
}else throw Error('Unknown command; no game state changed.');
fs.writeFileSync(save,JSON.stringify(g));
if(g.state.completed){const data=JSON.parse(fs.readFileSync(info,'utf8'));Object.assign(data,{status:'completed',completedAt:new Date().toISOString()});fs.writeFileSync(info,JSON.stringify(data,null,2)+'\n');}
fs.appendFileSync(log,JSON.stringify({at:new Date().toISOString(),cmd,args,stage:g.state.stage+1,result})+'\n');
process.stdout.write(JSON.stringify(result,null,2)+'\n');
