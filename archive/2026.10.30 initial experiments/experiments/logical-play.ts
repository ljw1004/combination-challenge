/** Public abstract-action interface. Fresh players use only this command. */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { LOGICAL_GAMES, createLogicalRun, logicalAct, replayLogical } from './logical-games.ts';
import type { LogicalRun } from './logical-games.ts';

const [command,id,...args]=process.argv.slice(2);
const usage={commands:['list','init ID GAME SCENARIO [seed=1] [condition=fresh]','view ID','rules ID (all public rules, recipes and map)','actions ID [JSON_FILTER] (all legal actions, optionally filtered by exact fields)','act ID JSON_ACTION [JSON_PREDICTION]','preview ID JSON_ACTION (only games offering exact previews)','checkpoint ID [reason] (assigned task may stop here)','continue ID JSON_INTENTION (elective play under this test prompt)','note ID JSON_ACCOUNT (append a checkpoint account)', 'notes ID (read your own checkpoint accounts)', 'report ID JSON_REPORT (optional player account; no effect on game state)'],annotation:'Optional: episode id, kind, unresolved question, expected effect, alternative or tradeoff. A plan may span several actions; do not manufacture a new dilemma for every command.',isolation:'Players may use this interface only. No source, saved traces, other sessions or model search. Isolation is by instruction.'};
try {
  if(command==='list'||!command){console.log(JSON.stringify({games:Object.values(LOGICAL_GAMES).map(game=>({id:game.id,version:game.version,scenarios:game.scenarios})),usage},null,2));process.exit(0);}
  if(!id||!/^[a-z0-9_-]+$/.test(id))throw new Error('Use a simple lowercase session ID.');
  const folder='results/logical-players';mkdirSync(folder,{recursive:true});const file=`${folder}/${id}.json`;
  if(command==='init'){
    if(existsSync(file))throw new Error('Session already exists; choose another ID.');
    const [gameId,scenario,rawSeed='1',condition='fresh']=args,game=LOGICAL_GAMES[gameId];
    if(!game)throw new Error('Unknown game; use list.');
    const seed=Number(rawSeed);if(!Number.isSafeInteger(seed))throw new Error('Use an integer seed.');
    const created=createLogicalRun(game,id,scenario,seed,condition);
    if(condition.startsWith('elective-after-')){
      const parentId=condition.slice('elective-after-'.length);
      if(/^[a-z0-9_-]+$/.test(parentId)&&existsSync(`${folder}/${parentId}.json`)){
        const parent=JSON.parse(readFileSync(`${folder}/${parentId}.json`,'utf8')) as LogicalRun;
        const choice=(parent.continuations??(parent.continuation?[parent.continuation]:[])).findLast(choice=>choice.nextSession===id);
        if(choice?.recordedAt)created.electiveOrigin={run:parentId,decisionIndex:choice.decisionIndex,recordedAt:choice.recordedAt};
      }
    }
    writeFileSync(file,JSON.stringify(created,null,2));
  }else if(!['view','act','preview','report','note','notes','checkpoint','continue','rules','actions'].includes(command))throw new Error('Unknown command.');
  let run=JSON.parse(readFileSync(file,'utf8')) as LogicalRun;
  const game=LOGICAL_GAMES[run.game];let state=replayLogical(run);
  if(command==='notes'){console.log(JSON.stringify({notes:run.notes??[]},null,2));process.exit(0);}
  if(command==='note'){
    const account=JSON.parse(args[0]);if(!account||typeof account!=='object'||Array.isArray(account))throw new Error('Note must be a JSON object.');
    run.notes=[...(run.notes??[]),{decisionIndex:run.decisions.length,account,recordedAt:new Date().toISOString()}];writeFileSync(file,JSON.stringify(run,null,2));
  }
  if(command==='rules'||command==='actions'){
    const observation=game.observe(state) as Record<string,unknown>,query=args[0]?JSON.parse(args[0]):undefined;
    run.queries=[...(run.queries??[]),{decisionIndex:run.decisions.length,kind:command,...(query?{query}:{}),phase:run.continuation&&run.decisions.length>=run.continuation.decisionIndex?'elective':'assigned',recordedAt:new Date().toISOString()}];writeFileSync(file,JSON.stringify(run,null,2));
    if(command==='rules')console.log(JSON.stringify(game.rules?.()??{rules:observation.rules,recipes:observation.recipes,actionSchema:observation.actionSchema},null,2));
    else{const all=game.actions?.(state)??(observation.legalActions as unknown[]|undefined)??[];const actions=query?all.filter(action=>Object.entries(query).every(([key,value])=>(action as Record<string,unknown>)[key]===value)):all;console.log(JSON.stringify({actions,count:actions.length,total:all.length,...(!all.length?{actionSchema:observation.actionSchema}: {})},null,2));}
    process.exit(0);
  }
  if(command==='checkpoint'){
    run.checkpoints=[...(run.checkpoints??[]),{decisionIndex:run.decisions.length,reason:args[0]??'Assigned exposure complete; stopping is a valid result.'}];writeFileSync(file,JSON.stringify(run,null,2));
  }
  if(command==='continue'){
    if(!run.checkpoints?.length)throw new Error('Record a valid stopping checkpoint first.');
    const choice=JSON.parse(args[0]);if(typeof choice?.intention!=='string'||!choice.intention.trim())throw new Error('Name what you want to attempt; do not record continuation merely to complete the task.');
    const history=run.continuations??(run.continuation?[run.continuation]:[]);
    run.continuation={decisionIndex:run.decisions.length,intention:choice.intention,source:typeof choice.source==='string'?choice.source:'elicited under test prompt',recordedAt:new Date().toISOString(),...(typeof choice.nextSession==='string'?{nextSession:choice.nextSession}:{})};
    run.continuations=[...history,run.continuation];writeFileSync(file,JSON.stringify(run,null,2));
  }
  if(command==='report'){
    const report=JSON.parse(args[0]);if(!report||typeof report!=='object'||Array.isArray(report))throw new Error('Report must be a JSON object.');
    run.report=report;writeFileSync(file,JSON.stringify(run,null,2));
  }
  if(command==='act'||command==='preview'){
    const action=JSON.parse(args[0]);
    if(command==='preview'){
      if(!game.preview)throw new Error('This game exposes candidate forecasts but not unperformed observations. Preview is not available.');
      const preview=game.preview(state,action);run.previews=[...(run.previews??[]),{decisionIndex:run.decisions.length,action,result:preview,phase:run.continuation&&run.decisions.length>=run.continuation.decisionIndex?'elective':'assigned',recordedAt:new Date().toISOString()}];
      writeFileSync(file,JSON.stringify(run,null,2));console.log(JSON.stringify({preview},null,2));process.exit(0);
    }
    try{const next=logicalAct(run,action,args[1]?JSON.parse(args[1]):undefined);run=next.run;state=next.state;}
    catch(error){run.attempts.push({decisionIndex:run.decisions.length,action,error:error instanceof Error?error.message:String(error)});writeFileSync(file,JSON.stringify(run,null,2));throw error;}
    writeFileSync(file,JSON.stringify(run,null,2));
  }
  console.log(JSON.stringify({session:id,decisionCount:run.decisions.length,condition:run.condition,...game.observe(state) as object,usage},null,2));
}catch(error){console.error(JSON.stringify({error:error instanceof Error?error.message:String(error),usage}));process.exitCode=1;}
