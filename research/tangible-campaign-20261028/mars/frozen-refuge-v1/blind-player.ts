/** Testers: execute this surface; do not read this file, scenario, routes or evidence. */
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import * as M from './worktree/experiments/tangible-campaign/engine/model.ts';
import type {Scenario,Action} from './worktree/experiments/tangible-campaign/schema/scenario.ts';
const s=JSON.parse(readFileSync(new URL('./candidate.scenario.json',import.meta.url),'utf8')) as Scenario;
const config:Record<string,{stage:string;context:string}>={refuge:{stage:'habitat',context:'After the damaged landing you repaired a radio, built its charger, and established a signal on the crash ridge. The inner cabin survived.'},night:{stage:'night',context:'You repaired a refuge, made a bed, and brought the stranded crew inside. You later built a shared workbench and took a supper portrait together.'},water:{stage:'waterworks',context:'Earlier you filled a sealed water canister and used a little to tend a seed tray. The recovered crew are safe; this is a longer camp stay.'},oxygen:{stage:'oxygen',context:'You have just restored the depot cargo hauler using the spare controller protected earlier, fitted its platform, and brought it down the marked service route.'}};
const [name,op='view',input]=process.argv.slice(2);if(!config[name])throw Error('Choose refuge, night, water, or oxygen. Operations: view; act JSON; hint ITEM_ID.');
const dir=new URL('./blind-sessions/',import.meta.url);mkdirSync(dir,{recursive:true});const file=new URL(name+'.json',dir);const st=s.stages.findIndex(x=>x.id===config[name].stage);
let session=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{context:config[name].context,startStage:st,game:M.checkpoint(s,'chapter-'+(st+1)),log:[]};
let result:any={};if(op==='act'){
 if(session.game.state.stage!==st)throw Error('Segment already complete; retain its record and report your impression.');
 const action=JSON.parse(input) as Action;const r=M.applyAction(s,session.game,action);session.game=r.game;session.log.push({action,accepted:r.accepted,message:r.message});result={accepted:r.accepted,message:r.message};
 if(r.accepted&&M.stageComplete(s,session.game.state)){session.completed=true;result.segmentComplete=true;}
 writeFileSync(file,JSON.stringify(session,null,2)+'\n');
}else if(op==='hint'){result={hint:M.partners(s,session.game.state,input)};session.log.push({hint:input});writeFileSync(file,JSON.stringify(session,null,2)+'\n');}
else if(op!=='view')throw Error('Use view, act JSON, or hint ITEM_ID.');
console.log(JSON.stringify({context:session.context,...result,view:M.playerView(s,session.game)},null,2));
