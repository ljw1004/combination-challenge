/** Testers execute this file without reading its implementation, scenario, routes, or tests. */
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import * as M from './worktree/experiments/tangible-campaign/engine/model.ts';
import type {Scenario} from './worktree/experiments/tangible-campaign/schema/scenario.ts';
const s=JSON.parse(readFileSync(new URL('./candidate.scenario.json',import.meta.url),'utf8')) as Scenario;
const config:Record<string,{stage:string;context:string}>={night:{stage:'night',context:'You repaired a refuge, made a bed, and brought the stranded crew inside. You later assembled a lit shared workbench and took a supper portrait together.'},workshop:{stage:'workshop',context:'The crew are safe. Earlier you assembled a portable shared workbench and fitted its lamp. The recovered crawler now needs to carry the expedition and its specimens across rough ground.'}};
const [name,op='view',source,target]=process.argv.slice(2);if(!config[name])throw Error('Choose night or workshop. Use view; drop SOURCE_ID TARGET_ID; or hint ITEM_ID.');
const dir=new URL('./blind-sessions/',import.meta.url);mkdirSync(dir,{recursive:true});const file=new URL(name+'.json',dir);const st=s.stages.findIndex(x=>x.id===config[name].stage);
let session=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{context:config[name].context,startStage:st,game:M.checkpoint(s,'chapter-'+(st+1)),log:[]};
let result:any={};
if(op==='drop'){
 if(session.completed)throw Error('Segment complete. Keep this transcript and report your impression rather than restarting it.');
 const action=M.dropAction(s,session.game.state,source,target);const r=M.applyAction(s,session.game,action);session.game=r.game;session.log.push({gesture:{type:'drop',source,target},resolvedAction:action,accepted:r.accepted,message:r.message});result={accepted:r.accepted,message:r.message};
 if(r.accepted&&M.stageComplete(s,session.game.state)){session.completed=true;result.segmentComplete=true;}
 writeFileSync(file,JSON.stringify(session,null,2)+'\n');
}else if(op==='hint'){result={hint:M.partners(s,session.game.state,source)};session.log.push({hint:source});writeFileSync(file,JSON.stringify(session,null,2)+'\n');}
else if(op!=='view')throw Error('Use view, drop SOURCE_ID TARGET_ID, or hint ITEM_ID. The surface resolves place versus combine just as the browser does.');
console.log(JSON.stringify({context:session.context,...result,view:M.playerView(s,session.game)},null,2));
